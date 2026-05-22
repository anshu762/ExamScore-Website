import OpenAI from "openai";
import type { AIProvider, AIProviderConfig, AIQuestionInput, AIResponseOutput } from "./types";
import { buildPrompt, getSystemPrompt } from "./prompt-builder";

export class OpenAIProvider implements AIProvider {
  name = "openai";
  private client: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(config: AIProviderConfig) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model ?? "gpt-4o-mini";
    this.maxTokens = config.maxTokens ?? 2000;
    this.temperature = config.temperature ?? 0.3;
  }

  async generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput> {
    const prompt = buildPrompt(input);

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: prompt },
      ],
      max_tokens: this.maxTokens,
      temperature: this.temperature,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI provider");
    }

    return this.parseResponse(content);
  }

  private parseResponse(content: string): AIResponseOutput {
    try {
      const parsed = JSON.parse(content);

      return {
        directAnswer: parsed.directAnswer ?? "",
        structureGuide: {
          introduction: parsed.structureGuide?.introduction ?? "",
          body: parsed.structureGuide?.body ?? "",
          evaluation: parsed.structureGuide?.evaluation,
          conclusion: parsed.structureGuide?.conclusion,
          formattingNotes: parsed.structureGuide?.formattingNotes ?? "",
          paragraphFlow: parsed.structureGuide?.paragraphFlow ?? "",
        },
        commonMistakes: parsed.commonMistakes ?? [],
        visuals: parsed.visuals ?? [],
      };
    } catch {
      return {
        directAnswer: content,
        structureGuide: {
          introduction: "",
          body: "",
          formattingNotes: "",
          paragraphFlow: "",
        },
        commonMistakes: [],
        visuals: [],
      };
    }
  }
}
