import type { AIProvider, AIProviderConfig, AIQuestionInput, AIResponseOutput } from "./types";
import { OpenAIProvider } from "./openai";
import { GeminiProvider } from "./gemini";

let providerInstance: AIProvider | null = null;

function getProviderConfig(): AIProviderConfig {
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable not configured");
    }
    return { apiKey };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not configured");
  }
  return { apiKey };
}

export function getAIProvider(): AIProvider {
  if (providerInstance) return providerInstance;

  const config = getProviderConfig();
  const provider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();

  switch (provider) {
    case "openai":
      providerInstance = new OpenAIProvider(config);
      break;
    case "gemini":
    default:
      providerInstance = new GeminiProvider(config);
      break;
  }

  return providerInstance;
}

export async function generateAIResponse(
  input: AIQuestionInput
): Promise<AIResponseOutput> {
  const provider = getAIProvider();
  return provider.generateAnswer(input);
}
