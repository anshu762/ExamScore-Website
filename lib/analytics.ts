import { prisma } from "./prisma";

export type AnalyticsEventType =
  | "question_asked"
  | "folder_created"
  | "flashcard_created"
  | "quiz_completed"
  | "session_started";

export async function trackEvent(
  userId: string,
  type: AnalyticsEventType,
  payload: Record<string, unknown> = {}
) {
  await prisma.analyticsEvent
    .create({
      data: { userId, type, payload: payload as any },
    })
    .catch((err) => console.error("Analytics trackEvent failed:", err));
}
