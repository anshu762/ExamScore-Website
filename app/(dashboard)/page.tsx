import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/overview";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [recentSessions, metrics, folders] = await Promise.all([
    prisma.questionSession.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        subject: true,
        board: true,
        aiResponse: true,
      },
    }),
    prisma.gamificationMetric.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.folder.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 4,
    }),
  ]);

  return (
    <DashboardOverview
      userName={session.user.name ?? "Student"}
      recentSessions={recentSessions}
      metrics={metrics ?? { accuracyScore: 0, consistencyScore: 0, streakDays: 0 }}
      folders={folders}
    />
  );
}
