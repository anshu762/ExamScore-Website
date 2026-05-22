export type UserRole = "STUDENT" | "ADMIN";
export type BoardCode = "IB" | "AP" | "CAMBRIDGE" | "CBSE" | "ICSE";
export type FolderItemType = "QUESTION" | "FLASHCARD" | "NOTE" | "GRAPH";
export type FlashcardSource = "AI_GENERATED" | "MANUAL";
export type QuizStatus = "PENDING" | "COMPLETED";

export interface Board {
  id: string;
  code: BoardCode;
  name: string;
  description: string;
  academicLevels: AcademicLevel[];
  subjects: Subject[];
}

export interface AcademicLevel {
  id: string;
  boardId: string;
  name: string;
  order: number;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  boardId: string;
  levelId: string | null;
  name: string;
  code: string;
  isActive: boolean;
}

export interface AIResponse {
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

export interface QuestionSession {
  id: string;
  userId: string;
  boardId: string;
  levelId: string;
  subjectId: string;
  questionText: string;
  createdAt: Date;
  aiResponse?: AIResponse;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
  items: FolderItem[];
}

export interface FolderItem {
  id: string;
  folderId: string;
  type: FolderItemType;
  referenceId: string;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  linkedSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flashcard {
  id: string;
  userId: string;
  front: string;
  back: string;
  boardId: string;
  subjectId: string;
  source: FlashcardSource;
  createdAt: Date;
}

export interface OnboardingQuiz {
  id: string;
  userId: string;
  status: QuizStatus;
  answers: Record<string, unknown>;
  resultProfile: Record<string, unknown>;
  completedAt?: Date;
}

export interface GamificationMetric {
  id: string;
  userId: string;
  accuracyScore: number;
  consistencyScore: number;
  streakDays: number;
  lastUpdated: Date;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}
