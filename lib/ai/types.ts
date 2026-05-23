export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIQuestionInput {
  questionText: string;
  boardName: string;
  boardCode: string;
  levelName: string;
  subjectName: string;
}

export interface Visual {
  description: string;
  type: "diagram" | "graph" | "equation" | "none";
  hint: string;
}

export interface AIResponseOutput {
  directAnswer: string;
  structureGuide: {
    introduction: string;
    body: string;
    evaluation?: string | null;
    conclusion: string;
    formattingNotes: string;
    paragraphFlow: string;
  };
  commonMistakes: string[];
  visuals: Visual[];
}

export interface AIProvider {
  name: string;
  generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput>;
}
