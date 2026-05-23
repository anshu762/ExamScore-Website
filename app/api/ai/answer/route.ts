import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateAIResponse } from "@/lib/ai/provider";
import { trackEvent } from "@/lib/analytics";
import { updateMetrics } from "@/lib/gamification";

const answerSchema = z.object({
  boardCode: z.string().min(1, "Board code is required"),
  boardId: z.string().min(1, "Board ID is required"),
  levelId: z.string().min(1, "Level ID is required"),
  subjectId: z.string().min(1, "Subject ID is required"),
  questionText: z
    .string()
    .min(5, "Question must be at least 5 characters")
    .max(2000, "Question must be at most 2000 characters"),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = answerSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { boardCode, boardId, levelId, subjectId, questionText } = parsed.data;

    const [board, level, subject] = await Promise.all([
      prisma.board.findUnique({ where: { id: boardId } }),
      prisma.academicLevel.findUnique({ where: { id: levelId } }),
      prisma.subject.findUnique({ where: { id: subjectId } }),
    ]);

    if (!board || !level || !subject) {
      return NextResponse.json(
        { error: "Invalid board, level, or subject" },
        { status: 400 }
      );
    }

    let aiResponse;
    try {
      aiResponse = await generateAIResponse({
        questionText,
        boardName: board.name,
        boardCode: board.code.toLowerCase(),
        levelName: level.name,
        subjectName: subject.name,
      });
    } catch (aiError: any) {
      console.error("AI generation failed:", aiError?.message ?? aiError);
      const isRateLimit = aiError?.message?.includes("quota") || aiError?.message?.includes("429") || aiError?.status === 429;
      const isTimeout = aiError?.name === "AbortError" || aiError?.message?.includes("timeout") || aiError?.message?.includes("abort");
      const isOverload = aiError?.status === 503;

      let msg: string;
      if (isRateLimit) {
        msg = "The AI service is currently at capacity due to high demand. Please wait a moment and try again.";
      } else if (isTimeout) {
        msg = "The AI service took too long to respond. Please try a shorter or more specific question.";
      } else if (isOverload) {
        msg = "The AI service is temporarily overloaded. Please try again shortly.";
      } else {
        msg = "I encountered an issue while generating your answer. Please try submitting your question again.";
      }

      aiResponse = {
        directAnswer: msg,
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

    const sessionRecord = await prisma.questionSession.create({
      data: {
        userId: session.user.id,
        boardId: board.id,
        levelId,
        subjectId,
        questionText,
        aiResponse: {
          create: {
            directAnswer: aiResponse.directAnswer,
            structureGuide: aiResponse.structureGuide as any,
            commonMistakes: aiResponse.commonMistakes as any,
            visuals: aiResponse.visuals as any,
          },
        },
      },
      include: { aiResponse: true },
    });

    const metric = await prisma.gamificationMetric.findUnique({
      where: { userId: session.user.id },
    });

    if (metric) {
      await prisma.gamificationMetric.update({
        where: { userId: session.user.id },
        data: {
          accuracyScore: Math.min(100, metric.accuracyScore + 0.5),
          consistencyScore: Math.min(100, metric.consistencyScore + 0.3),
          streakDays: metric.streakDays + 1,
        },
      });
    }

    await Promise.all([
      trackEvent(session.user.id, "question_asked", {
        boardCode: board.code.toLowerCase(),
        subjectName: subject.name,
      }),
      updateMetrics(session.user.id),
    ]);

    return NextResponse.json(
      {
        sessionId: sessionRecord.id,
        directAnswer: aiResponse.directAnswer,
        structureGuide: aiResponse.structureGuide,
        commonMistakes: aiResponse.commonMistakes,
        visuals: aiResponse.visuals,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("AI answer API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
