import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateAIResponse } from "@/lib/ai/provider";

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
    } catch (aiError) {
      console.error("AI generation failed:", aiError);
      aiResponse = {
        directAnswer:
          "I understand you're asking about this topic. To provide a comprehensive answer, please ensure your AI provider API key is configured. Here's a structured approach: Start by identifying key concepts, then build your argument with specific examples, and conclude with a summary of main points.",
        structureGuide: {
          introduction:
            "Begin with a clear thesis statement that directly addresses the question.",
          body: "Develop your argument in 3-4 paragraphs, each focusing on a single main point with supporting evidence.",
          evaluation: null,
          conclusion:
            "Summarize your main argument and restate your thesis in light of the evidence presented.",
          formattingNotes:
            "Use clear paragraph breaks and maintain formal academic language throughout.",
          paragraphFlow:
            "Each paragraph should transition smoothly to the next using connecting phrases.",
        },
        commonMistakes: [
          "Not directly answering the question asked",
          "Lack of specific examples or evidence",
          "Poor time management in exam conditions",
        ],
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
      { error: "Failed to process your question" },
      { status: 500 }
    );
  }
}
