export interface AIProviderConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIQuestionInput {
  questionText: string;
  boardName: string;
  levelName: string;
  subjectName: string;
}

export interface AIResponseOutput {
  directAnswer: string;
  structureGuide: {
    introduction: string;
    body: string;
    evaluation?: string;
    conclusion?: string;
    formattingNotes: string;
    paragraphFlow: string;
  };
  commonMistakes: string[];
  visuals: string[];
}

export interface AIProvider {
  name: string;
  generateAnswer(input: AIQuestionInput): Promise<AIResponseOutput>;
}
