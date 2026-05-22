import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIProvider, AIProviderConfig, AIQuestionInput, AIResponseOutput, Visual } from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

export class GeminiProvider implements AIProvider {
  name = "gemini";
  private client: GoogleGenerativeAI;
  private modelName: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: AIProviderConfig) {
    this.client = new GoogleGenerativeAI(config.apiKey);
    this.modelName = config.model ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    this.maxTokens = config.maxTokens ?? 8192;
    this.temperature = config.temperature ?? 0.2;
  }

  async generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput> {
    const systemPrompt = buildSystemPrompt(input.boardCode, input.levelName, input.subjectName);
    const userPrompt = buildUserPrompt(input.questionText, input.boardCode, input.levelName, input.subjectName);

    const model = this.client.getGenerativeModel({
      model: this.modelName,
      generationConfig: {
        temperature: this.temperature,
        maxOutputTokens: this.maxTokens,
      },
      systemInstruction: systemPrompt,
    });

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await this.makeRequest(model, userPrompt);
        return this.parseResponse(result);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Gemini request failed");
        if (attempt < 2) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError ?? new Error("Gemini request failed after retries");
  }

  private async makeRequest(
    model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
    prompt: string
  ): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

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
