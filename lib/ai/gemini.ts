import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, AIProviderConfig, AIQuestionInput, AIResponseOutput, Visual } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 15000;
const TIMEOUT_MS = 25000;

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_MAX = 50;
const CIRCUIT_THRESHOLD = 0.5;
const CIRCUIT_WINDOW = 10;
const MAX_CONCURRENCY = 2;

interface CircuitState {
  failures: number;
  total: number;
  lastReset: number;
}

interface CacheEntry {
  result: AIResponseOutput;
  ts: number;
}

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private client: GoogleGenerativeAI;
  private primaryModel: string;
  private maxTokens: number;
  private temperature: number;

  private static requestQueue: Array<() => void> = [];
  private static activeRequests = 0;
  private static circuit: CircuitState = { failures: 0, total: 0, lastReset: Date.now() };
  private static responseCache = new Map<string, CacheEntry>();

  constructor(config: AIProviderConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.primaryModel = config.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    this.maxTokens = Math.min(config.maxTokens ?? 4096, 4096);
    this.temperature = config.temperature ?? 0.2;
  }

  async generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput> {
    const cacheKey = this.buildCacheKey(input);
    const cached = GeminiProvider.responseCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.result;
    }

    if (this.isCircuitOpen()) {
      console.warn("Circuit breaker open — returning fallback");
      return this.makeFallback("", "busy");
    }

    const systemPrompt = buildSystemPrompt(input.boardCode, input.levelName, input.subjectName);
    const userPrompt = buildUserPrompt(input.questionText, input.boardCode, input.levelName, input.subjectName);
    const modelsToTry = [
      this.primaryModel,
      ...FALLBACK_MODELS.filter((m) => m !== this.primaryModel),
    ];

    let lastError: Error | null = null;
    let lastErrorType: "quota" | "timeout" | "other" = "other";

    await this.acquireSlot();

    try {
      for (const modelName of modelsToTry) {
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const model = this.client.getGenerativeModel({
              model: modelName,
              generationConfig: {
                temperature: this.temperature,
                maxOutputTokens: this.maxTokens,
              },
              systemInstruction: systemPrompt,
            });

            const result = await this.makeRequest(model, userPrompt);
            const parsed = this.parseResponse(result);

            this.recordSuccess();
            if (GeminiProvider.responseCache.size >= CACHE_MAX) {
              const firstKey = GeminiProvider.responseCache.keys().next().value;
              if (firstKey) GeminiProvider.responseCache.delete(firstKey);
            }
            GeminiProvider.responseCache.set(cacheKey, { result: parsed, ts: Date.now() });

            return parsed;
          } catch (err) {
            lastError = err instanceof Error ? err : new Error("Gemini request failed");
            lastErrorType = this.classifyError(err);

            const delay = this.backoffDelay(attempt, lastErrorType);

            if (attempt < 2) {
              await new Promise((r) => setTimeout(r, delay));
              continue;
            }
            break;
          }
        }
      }

      this.recordFailure();
      const msg = this.friendlyMessage(lastErrorType);
      return this.makeFallback(msg, lastErrorType);
    } finally {
      this.releaseSlot();
    }
  }

  private buildCacheKey(input: AIQuestionInput): string {
    const q = input.questionText.trim().toLowerCase().replace(/\s+/g, " ");
    return `${input.boardCode}:${input.levelName}:${input.subjectName}:${q}`;
  }

  private classifyError(err: unknown): "quota" | "timeout" | "other" {
    if (!err) return "other";
    const e = err as any;
    if (e.status === 429 || (e.message && e.message.includes("quota"))) return "quota";
    if (e.status === 503 || e.name === "AbortError" || e.message?.includes("timeout") || e.message?.includes("abort")) return "timeout";
    return "other";
  }

  private backoffDelay(attempt: number, type: "quota" | "timeout" | "other"): number {
    const base = type === "quota" ? BASE_DELAY_MS * 2 : BASE_DELAY_MS;
    const exponential = Math.min(base * Math.pow(2, attempt), MAX_DELAY_MS);
    const jitter = Math.floor(Math.random() * 1000);
    return exponential + jitter;
  }

  private friendlyMessage(type: "quota" | "timeout" | "other"): string {
    switch (type) {
      case "quota":
        return "The AI service is currently experiencing high demand. Please wait a moment and try again.";
      case "timeout":
        return "The AI service took too long to respond. Please try a shorter or simpler question.";
      default:
        return "The AI service encountered an error. Please try again.";
    }
  }

  private isCircuitOpen(): boolean {
    const state = GeminiProvider.circuit;
    if (state.total < CIRCUIT_WINDOW) return false;
    const failureRate = state.failures / state.total;
    if (failureRate > CIRCUIT_THRESHOLD && Date.now() - state.lastReset > 30000) {
      GeminiProvider.circuit = { failures: 0, total: 0, lastReset: Date.now() };
      return false;
    }
    return failureRate > CIRCUIT_THRESHOLD;
  }

  private recordSuccess(): void {
    const state = GeminiProvider.circuit;
    state.total = Math.min(state.total + 1, CIRCUIT_WINDOW * 2);
  }

  private recordFailure(): void {
    const state = GeminiProvider.circuit;
    state.failures = Math.min(state.failures + 1, CIRCUIT_WINDOW * 2);
    state.total = Math.min(state.total + 1, CIRCUIT_WINDOW * 2);
  }

  private acquireSlot(): Promise<void> {
    if (GeminiProvider.activeRequests < MAX_CONCURRENCY) {
      GeminiProvider.activeRequests++;
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      GeminiProvider.requestQueue.push(resolve);
    });
  }

  private releaseSlot(): void {
    if (GeminiProvider.requestQueue.length > 0) {
      const next = GeminiProvider.requestQueue.shift();
      if (next) next();
    } else {
      GeminiProvider.activeRequests = Math.max(0, GeminiProvider.activeRequests - 1);
    }
  }

  private async makeRequest(
    model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
    prompt: string
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const result = await model.generateContent(prompt);
      clearTimeout(timeout);
      return result.response.text();
    } catch (err) {
      clearTimeout(timeout);
      throw err;
    }
  }

  private parseResponse(content: string): AIResponseOutput {
    const candidates: string[] = [];

    const fenceStripped = this.stripMarkdownFences(content);
    candidates.push(fenceStripped);

    const outerBrace = content.match(/\{[\s\S]*\}/);
    if (outerBrace) candidates.push(outerBrace[0]);

    const innerBrace = fenceStripped.match(/\{[\s\S]*\}/);
    if (innerBrace) candidates.push(innerBrace[0]);

    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        if (parsed && typeof parsed === "object" && typeof parsed.directAnswer === "string") {
          return this.extractFromParsed(parsed);
        }
      } catch {
        // try next
      }
    }

    return this.makeFallback(fenceStripped, "parse");
  }

  private extractFromParsed(parsed: any): AIResponseOutput {
    const fix = (s: string) =>
      s
        .replace(/\x0C(?=rac)/g, "f")
        .replace(/\x08(?=eta)/g, "b")
        .replace(/\x0A(?=eq|ot|otice|ew)/g, "n")
        .replace(/\x0D(?=ightarrow|ight)/g, "r")
        .replace(/\x09(?=heta|ilde|ext)/g, "t")
        .replace(/\x0B(?=ert)/g, "v");

    const visuals: Visual[] = Array.isArray(parsed.visuals)
      ? parsed.visuals.map((v: any) => ({
          description: fix(String(v.description ?? "")),
          type: (["diagram", "graph", "equation", "none"] as const).includes(v.type) ? v.type : "none",
          hint: fix(String(v.hint ?? "")),
        }))
      : [];

    return {
      directAnswer: fix(String(parsed.directAnswer ?? "")),
      structureGuide: {
        introduction: fix(String(parsed.structureGuide?.introduction ?? "")),
        body: fix(String(parsed.structureGuide?.body ?? "")),
        evaluation: parsed.structureGuide?.evaluation ? fix(String(parsed.structureGuide.evaluation)) : null,
        conclusion: fix(String(parsed.structureGuide?.conclusion ?? "")),
        formattingNotes: fix(String(parsed.structureGuide?.formattingNotes ?? "")),
        paragraphFlow: fix(String(parsed.structureGuide?.paragraphFlow ?? "")),
      },
      commonMistakes: Array.isArray(parsed.commonMistakes)
        ? parsed.commonMistakes.map((m: any) => fix(String(m)))
        : [],
      visuals,
    };
  }

  private makeFallback(raw: string, reason: string): AIResponseOutput {
    const message =
      reason === "quota"
        ? "The AI service is currently at capacity. Please try again in a few minutes."
        : reason === "timeout"
          ? "The AI took too long to respond. Try asking a shorter or more specific question."
          : reason === "parse"
            ? "The AI returned a response we couldn't read. Please try asking your question again."
            : "The AI service is temporarily unavailable. Please try again shortly.";

    return {
      directAnswer: message,
      structureGuide: { introduction: "", body: "", evaluation: null, conclusion: "", formattingNotes: "", paragraphFlow: "" },
      commonMistakes: [],
      visuals: [],
    };
  }

  private stripMarkdownFences(text: string): string {
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/, "");
    cleaned = cleaned.replace(/\n?```\s*$/, "");
    return cleaned.trim();
  }
}
