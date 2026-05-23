import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/overview";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

const [recentSessions, metrics, folders, quiz] = await Promise.all([
    prisma.questionSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { subject: true, board: true, aiResponse: true },
    }),
    prisma.gamificationMetric.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.folder.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
    prisma.onboardingQuiz.findUnique({
      where: { userId: session.user.id },
      select: { status: true, resultProfile: true },
    }),
  ]);

  const quizProfile = quiz?.status === "COMPLETED" ? (quiz.resultProfile as any) : null;

  return (
    <DashboardOverview
      userName={session.user.name ?? "Student"}
      recentSessions={recentSessions}
      metrics={metrics ?? { accuracyScore: 0, consistencyScore: 0, streakDays: 0 }}
      folders={folders}
      quizProfile={quizProfile}
    />
  );
}
