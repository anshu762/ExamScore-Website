import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [metric, totalQuestions, questionsThisWeek, topSubjects] = await Promise.all([
      prisma.gamificationMetric.findUnique({ where: { userId: session.user.id } }),
      prisma.questionSession.count({ where: { userId: session.user.id } }),
      prisma.questionSession.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.questionSession.groupBy({
        by: ["subjectId"],
        where: { userId: session.user.id },
        _count: true,
        orderBy: { _count: { subjectId: "desc" } },
        take: 1,
      }),
    ]);

    let topSubject = "";
    if (topSubjects.length > 0) {
      const subj = await prisma.subject.findUnique({
        where: { id: topSubjects[0].subjectId },
        select: { name: true },
      });
      topSubject = subj?.name ?? "";
    }

    const lastActivity = await prisma.questionSession.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    return NextResponse.json({
      streakDays: metric?.streakDays ?? 0,
      consistencyScore: metric?.consistencyScore ?? 0,
      accuracyScore: metric?.accuracyScore ?? 50.0,
      totalQuestions,
      questionsThisWeek,
      topSubject,
      lastActivity: lastActivity?.createdAt ?? null,
    });
  } catch (error) {
    console.error("Gamification summary error:", error);
    return NextResponse.json({ error: "Failed to load summary" }, { status: 500 });
  }
}
