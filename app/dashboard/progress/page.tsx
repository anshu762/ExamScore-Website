import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Brain, Sparkles, TrendingUp } from "lucide-react";

export default async function ProgressPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const metric = await prisma.gamificationMetric.findUnique({
    where: { userId: session.user.id },
  });

  const sessionCount = await prisma.questionSession.count({
    where: { userId: session.user.id },
  });

  const metrics = metric ?? {
    accuracyScore: 0,
    consistencyScore: 0,
    streakDays: 0,
  };

  const stats = [
    {
      label: "Accuracy",
      value: `${metrics.accuracyScore}%`,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Consistency",
      value: `${metrics.consistencyScore}%`,
      icon: Brain,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Day Streak",
      value: `${metrics.streakDays}`,
      icon: Sparkles,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Total Sessions",
      value: `${sessionCount}`,
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/5",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Progress
        </h1>
        <p className="mt-1 text-text-secondary">
          Track your study performance and growth.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-primary">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-text-secondary">Accuracy</span>
                <span className="text-sm font-medium text-foreground">
                  {metrics.accuracyScore}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${metrics.accuracyScore}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-text-secondary">Consistency</span>
                <span className="text-sm font-medium text-foreground">
                  {metrics.consistencyScore}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${metrics.consistencyScore}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
