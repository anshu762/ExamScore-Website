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
    const cleaned = this.stripMarkdownFences(content);

    try {
      const parsed = JSON.parse(cleaned);
      const visuals: Visual[] = Array.isArray(parsed.visuals)
        ? parsed.visuals.map((v: any) => ({
            description: v.description ?? "",
            type: ["diagram", "graph", "equation", "none"].includes(v.type) ? v.type : "none",
            hint: v.hint ?? "",
          }))
        : [];

      return {
        directAnswer: parsed.directAnswer ?? "",
        structureGuide: {
          introduction: parsed.structureGuide?.introduction ?? "",
          body: parsed.structureGuide?.body ?? "",
          evaluation: parsed.structureGuide?.evaluation ?? null,
          conclusion: parsed.structureGuide?.conclusion ?? "",
          formattingNotes: parsed.structureGuide?.formattingNotes ?? "",
          paragraphFlow: parsed.structureGuide?.paragraphFlow ?? "",
        },
        commonMistakes: Array.isArray(parsed.commonMistakes) ? parsed.commonMistakes : [],
        visuals,
      };
    } catch {
      return {
        directAnswer: cleaned,
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
  }

  private stripMarkdownFences(text: string): string {
    let cleaned = text.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "");
      cleaned = cleaned.replace(/\n?```\s*$/, "");
    }
    return cleaned.trim();
  }
}
