import type { AIProvider, AIProviderConfig } from "./types";
import { OpenAIProvider } from "./openai";

let providerInstance: AIProvider | null = null;

function getProviderConfig(): AIProviderConfig {
  const provider = process.env.AI_PROVIDER ?? "openai";
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("AI provider API key not configured");
  }

  return { apiKey };
}

export function getAIProvider(): AIProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const config = getProviderConfig();

  switch (process.env.AI_PROVIDER) {
    case "openai":
    default:
      providerInstance = new OpenAIProvider(config);
      break;
  }

  return providerInstance;
}

export async function generateAIResponse(input: Parameters<AIProvider["generateAnswer"]>[0]) {
  const provider = getAIProvider();
  return provider.generateAnswer(input);
}
