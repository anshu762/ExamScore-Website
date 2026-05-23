import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProgressDashboard } from "@/components/dashboard/progress-dashboard";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [metric, totalQuestions, questionsThisWeek, dailyCounts, topSubjects, quiz] =
    await Promise.all([
      prisma.gamificationMetric.findUnique({ where: { userId: session.user.id } }),
      prisma.questionSession.count({ where: { userId: session.user.id } }),
      prisma.questionSession.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.$queryRaw<
        { date: Date; count: bigint }[]
      >`
        SELECT DATE("createdAt") as date, COUNT(*)::int as count
        FROM "QuestionSession"
        WHERE "userId" = ${session.user.id}
          AND "createdAt" >= NOW() - INTERVAL '6 days'
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,
      prisma.questionSession.groupBy({
        by: ["subjectId"],
        where: { userId: session.user.id },
        _count: true,
        orderBy: { _count: { subjectId: "desc" } },
        take: 3,
      }),
      prisma.onboardingQuiz.findUnique({
        where: { userId: session.user.id },
        select: { resultProfile: true, status: true },
      }),
    ]);

  const subjectIds = topSubjects.map((s) => s.subjectId);
  const subjects = subjectIds.length > 0
    ? await prisma.subject.findMany({
        where: { id: { in: subjectIds } },
        select: { id: true, name: true },
      })
    : [];

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const focusAreas = topSubjects.map((s) => ({
    name: subjectMap.get(s.subjectId) ?? "Unknown",
    count: s._count,
  }));

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const countMap = new Map(
    dailyCounts.map((r) => {
      const d = r.date instanceof Date ? r.date : new Date(r.date);
      return [d.toISOString().slice(0, 10), Number(r.count)];
    })
  );
  const activityData = last7.map((date) => ({
    date,
    count: countMap.get(date) ?? 0,
  }));

  const quizProfile =
    quiz?.status === "COMPLETED" ? (quiz.resultProfile as any) : null;

  return (
    <ProgressDashboard
      streakDays={metric?.streakDays ?? 0}
      consistencyScore={metric?.consistencyScore ?? 0}
      accuracyScore={metric?.accuracyScore ?? 50.0}
      totalQuestions={totalQuestions}
      questionsThisWeek={questionsThisWeek}
      activityData={activityData}
      focusAreas={focusAreas}
      quizProfile={quizProfile}
    />
  );
}
