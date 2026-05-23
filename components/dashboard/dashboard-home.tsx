"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Brain, Flame, Zap, Target } from "lucide-react";

interface DashboardHomeProps {
  userName: string;
  recentSessions: Array<{
    id: string;
    questionText: string;
    createdAt: Date;
    subject: { name: string };
    board: { name: string };
    aiResponse?: { directAnswer: string } | null;
  }>;
  metrics: {
    accuracyScore: number;
    consistencyScore: number;
    streakDays: number;
  };
  questionsThisWeek: number;
  liveUserCount: number;
  quizProfile: {
    recommendedTechniques?: string[];
    studyStyle?: string;
  } | null;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHome({
  userName,
  recentSessions,
  metrics,
  questionsThisWeek,
  liveUserCount,
  quizProfile,
}: DashboardHomeProps) {
  const topTech = quizProfile?.recommendedTechniques?.[0] ?? null;

  return (
    <div className="space-y-8">
      {/* Greeting + Live Counter */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
            Dashboard
          </p>
          <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-foreground">
            {getGreeting()}, {userName}.
          </h1>
        </div>
        <p className="hidden text-right text-[11px] leading-relaxed text-text-muted sm:block">
          {liveUserCount.toLocaleString()}
          <br />
          students are improving strategically.
        </p>
      </div>

      {/* Metric strip */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          <span className="text-sm text-foreground">
            <span className="font-semibold">{metrics.streakDays}</span> day streak
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm text-foreground">
            <span className="font-semibold">{questionsThisWeek}</span> questions this week
          </span>
        </div>
      </div>

      {/* Continue where you left off */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Continue where you left off
        </p>
        {recentSessions.length === 0 ? (
          <p className="text-sm text-text-secondary">No study sessions yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentSessions.map((s) => (
              <Link
                key={s.id}
                href={`/history/${s.id}`}
                className="group rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted">
                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                    {s.board.name}
                  </span>
                  <span>{s.subject.name}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-snug text-foreground">
                  {s.questionText}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors group-hover:text-primary-dark">
                  View Answer <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Your strategy today */}
      {topTech && (
        <div className="rounded-xl border border-primary/10 bg-primary/[0.02] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
                Your strategy today
              </p>
              <p className="mt-0.5 text-sm font-medium text-foreground capitalize">
                {topTech.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ask a new question CTA */}
      <Link
        href="/ask"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-[#FDFCF9] shadow-sm transition-all hover:bg-primary-dark"
      >
        <Sparkles className="h-4 w-4" />
        Ask a new question
      </Link>
    </div>
  );
}
