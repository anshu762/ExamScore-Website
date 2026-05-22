import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { questionSchema } from "@/lib/validators/auth";
import { generateAIResponse } from "@/lib/ai/provider";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      const issues = "issues" in parsed.error ? parsed.error.issues : (parsed.error as any).errors ?? [];
      return NextResponse.json(
        { error: issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { questionText, boardId, levelId, subjectId } = parsed.data;

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
        levelName: level.name,
        subjectName: subject.name,
      });
    } catch (aiError) {
      console.error("AI generation failed, using fallback:", aiError);
      aiResponse = {
        directAnswer:
          "I understand you're asking about this topic. To provide a comprehensive answer, please ensure your OpenAI API key is configured. Here's a structured approach: Start by identifying key concepts, then build your argument with specific examples, and conclude with a summary of main points.",
        structureGuide: {
          introduction: "Begin with a clear thesis statement that directly addresses the question.",
          body: "Develop your argument in 3-4 paragraphs, each focusing on a single main point with supporting evidence.",
          formattingNotes: "Use clear paragraph breaks and maintain formal academic language throughout.",
          paragraphFlow: "Each paragraph should transition smoothly to the next using connecting phrases.",
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
        boardId,
        levelId,
        subjectId,
        questionText,
        aiResponse: {
          create: {
            directAnswer: aiResponse.directAnswer,
            structureGuide: aiResponse.structureGuide,
            commonMistakes: aiResponse.commonMistakes,
            visuals: aiResponse.visuals,
            rawProviderPayload: null,
          },
        },
      },
      include: {
        aiResponse: true,
      },
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
        aiResponse: {
          directAnswer: aiResponse.directAnswer,
          structureGuide: aiResponse.structureGuide,
          commonMistakes: aiResponse.commonMistakes,
          visuals: aiResponse.visuals,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Question API error:", error);
    return NextResponse.json(
      { error: "Failed to process question" },
      { status: 500 }
    );
  }
}
