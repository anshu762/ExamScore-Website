import { prisma } from "./prisma";

export async function updateMetrics(userId: string) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const recentEvents = await prisma.analyticsEvent.findMany({
    where: {
      userId,
      type: "question_asked",
      createdAt: { gte: sevenDaysAgo },
    },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const dates = new Set(
    recentEvents.map((e) => e.createdAt.toISOString().slice(0, 10))
  );

  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streakDays++;
    } else if (i > 0) {
      break;
    }
  }

  const uniqueDays = dates.size;
  const consistencyScore = Math.min(100, Math.round((uniqueDays / 7) * 100));

  const lastMetric = await prisma.gamificationMetric.findUnique({
    where: { userId },
  });

  const accuracyScore = lastMetric?.accuracyScore ?? 50.0;

  await prisma.gamificationMetric.upsert({
    where: { userId },
    create: {
      userId,
      accuracyScore,
      consistencyScore,
      streakDays,
    },
    update: {
      consistencyScore,
      streakDays,
    },
  });
}
