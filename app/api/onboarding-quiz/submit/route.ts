import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { questions } from "@/lib/quiz/questions";
import { generateProfile } from "@/lib/quiz/profiler";

const submitSchema = z.object({
  answers: z.record(z.string(), z.string().regex(/^[a-d]$/)),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }

    const answers = parsed.data.answers;
    const answersNum: Record<number, string> = {};
    for (const [key, value] of Object.entries(answers)) {
      answersNum[Number(key)] = value;
    }

    const quiz = await prisma.onboardingQuiz.findUnique({
      where: { userId: session.user.id },
    });
    if (!quiz) {
      return NextResponse.json({ error: "No quiz found for this user" }, { status: 404 });
    }
    if (quiz.status === "COMPLETED") {
      return NextResponse.json({ error: "Quiz already completed" }, { status: 409 });
    }

    const resultProfile = generateProfile(answersNum, questions);

    await prisma.onboardingQuiz.update({
      where: { userId: session.user.id },
      data: {
        status: "COMPLETED",
        answers: answersNum as any,
        resultProfile: resultProfile as any,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({ resultProfile }, { status: 200 });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 });
  }
}
