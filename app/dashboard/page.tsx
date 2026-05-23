import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardHome } from "@/components/dashboard/dashboard-home";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const [recentSessions, metric, quiz, liveCount, questionsThisWeek] = await Promise.all([
    prisma.questionSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 2,
      include: { subject: true, board: true, aiResponse: true },
    }),
    prisma.gamificationMetric.findUnique({ where: { userId: session.user.id } }),
    prisma.onboardingQuiz.findUnique({
      where: { userId: session.user.id },
      select: { status: true, resultProfile: true },
    }),
    prisma.liveUserCount.findUnique({ where: { id: "1" } }),
    prisma.questionSession.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  const quizProfile = quiz?.status === "COMPLETED" ? (quiz.resultProfile as any) : null;

  return (
    <DashboardHome
      userName={session.user.name ?? "Student"}
      recentSessions={recentSessions}
      metrics={metric ?? { accuracyScore: 0, consistencyScore: 0, streakDays: 0 }}
      questionsThisWeek={questionsThisWeek}
      liveUserCount={liveCount?.count ?? 127493}
      quizProfile={quizProfile}
    />
  );
}
