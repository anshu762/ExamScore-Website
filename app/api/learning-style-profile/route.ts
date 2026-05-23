import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await prisma.onboardingQuiz.findUnique({
      where: { userId: session.user.id },
      select: { status: true, resultProfile: true },
    });

    if (!quiz || quiz.status !== "COMPLETED") {
      return NextResponse.json({ resultProfile: null }, { status: 200 });
    }

    return NextResponse.json({ resultProfile: quiz.resultProfile }, { status: 200 });
  } catch (error) {
    console.error("Learning style profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
