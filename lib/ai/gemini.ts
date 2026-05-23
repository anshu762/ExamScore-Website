import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, AIProviderConfig, AIQuestionInput, AIResponseOutput, Visual } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private client: GoogleGenerativeAI;
  private primaryModel: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: AIProviderConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.primaryModel = config.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    this.maxTokens = config.maxTokens ?? 8192;
    this.temperature = config.temperature ?? 0.2;
  }

  async generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput> {
    const systemPrompt = buildSystemPrompt(input.boardCode, input.levelName, input.subjectName);
    const userPrompt = buildUserPrompt(input.questionText, input.boardCode, input.levelName, input.subjectName);

    const modelsToTry = [
      this.primaryModel,
      ...FALLBACK_MODELS.filter((m) => m !== this.primaryModel),
    ];

    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
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
          return this.parseResponse(result);
        } catch (err) {
          lastError = err instanceof Error ? err : new Error("Gemini request failed");
          const isOverloaded = this.isOverloadError(err);
          if (attempt === 0 && isOverloaded) {
            await new Promise((r) => setTimeout(r, 3000));
            continue;
          }
          if (attempt === 0 && !isOverloaded) {
            await new Promise((r) => setTimeout(r, 1000));
            continue;
          }
          break;
        }
      }
    }

    throw lastError ?? new Error("Gemini request failed after retries");
  }

  private isOverloadError(err: unknown): boolean {
    if (err && typeof err === "object" && "status" in err) {
      const status = (err as any).status;
      return status === 429 || status === 503;
    }
    return false;
  }

  private async makeRequest(
    model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
    prompt: string
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

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
    // Build a list of candidate JSON strings to try, from most to least specific.
    const candidates: string[] = [];

    // 1. Strip all markdown fences (handles ```json ... ``` and plain ``` ... ```)
    const fenceStripped = this.stripMarkdownFences(content);
    candidates.push(fenceStripped);

    // 2. Extract the outermost { ... } block — handles AI adding prose before/after JSON
    const outerBrace = content.match(/\{[\s\S]*\}/);
    if (outerBrace) candidates.push(outerBrace[0]);

    // 3. Same on the fence-stripped version
    const innerBrace = fenceStripped.match(/\{[\s\S]*\}/);
    if (innerBrace) candidates.push(innerBrace[0]);

    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        // Only accept if it looks like our expected schema
        if (parsed && typeof parsed === "object" && typeof parsed.directAnswer === "string") {
          return this.extractFromParsed(parsed);
        }
      } catch {
        // Try next candidate
      }
    }

    // All parsing failed — return a safe fallback (never dump raw JSON to UI)
    return this.makeFallback(fenceStripped);
  }

  /** Map a successfully parsed object to AIResponseOutput */
  private extractFromParsed(parsed: any): AIResponseOutput {
    const visuals: Visual[] = Array.isArray(parsed.visuals)
      ? parsed.visuals.map((v: any) => ({
          description: String(v.description ?? ""),
          type: (["diagram", "graph", "equation", "none"] as const).includes(v.type)
            ? v.type
            : "none",
          hint: String(v.hint ?? ""),
        }))
      : [];

    return {
      directAnswer: String(parsed.directAnswer ?? ""),
      structureGuide: {
        introduction: String(parsed.structureGuide?.introduction ?? ""),
        body: String(parsed.structureGuide?.body ?? ""),
        evaluation: parsed.structureGuide?.evaluation
          ? String(parsed.structureGuide.evaluation)
          : null,
        conclusion: String(parsed.structureGuide?.conclusion ?? ""),
        formattingNotes: String(parsed.structureGuide?.formattingNotes ?? ""),
        paragraphFlow: String(parsed.structureGuide?.paragraphFlow ?? ""),
      },
      commonMistakes: Array.isArray(parsed.commonMistakes)
        ? parsed.commonMistakes.map(String)
        : [],
      visuals,
    };
  }

  /**
   * Safe fallback — called only when all JSON parse attempts fail.
   * If the raw text looks like JSON (starts with { or [), we refuse to render it
   * directly; instead we show a friendly retry message so the user never sees
   * raw schema keys or escaped strings.
   */
  private makeFallback(raw: string): AIResponseOutput {
    const trimmed = raw.trim();
    const looksLikeRawJson =
      trimmed.startsWith("{") ||
      trimmed.startsWith("[") ||
      /"directAnswer"/.test(trimmed) ||
      /"structureGuide"/.test(trimmed);

    return {
      directAnswer: looksLikeRawJson
        ? "The AI response could not be parsed into a structured answer. Please try submitting your question again."
        : trimmed,
      structureGuide: {
        introduction: "",
        body: "",
        evaluation: null,
        conclusion: "",
        formattingNotes: "",
        paragraphFlow: "",
      },
      commonMistakes: [],
      visuals: [],
    };
  }

  /**
   * Strip markdown code fences from AI output.
   * Handles all variants the model may produce:
   *   ```json\n{...}\n```
   *   ```\n{...}\n```
   *   {... bare JSON ...}
   */
  private stripMarkdownFences(text: string): string {
    let cleaned = text.trim();
    // Remove leading fence (with or without language hint)
    cleaned = cleaned.replace(/^```(?:json|JSON)?\s*\n?/, "");
    // Remove trailing fence
    cleaned = cleaned.replace(/\n?```\s*$/, "");
    return cleaned.trim();
  }
}
