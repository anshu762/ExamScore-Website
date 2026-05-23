"use client";

import { BarChart3, Flame, Target, Zap, Brain, BookOpen, Clock, Sparkles } from "lucide-react";

interface ActivityDay {
  date: string;
  count: number;
}

interface FocusArea {
  name: string;
  count: number;
}

interface ProgressDashboardProps {
  streakDays: number;
  consistencyScore: number;
  accuracyScore: number;
  totalQuestions: number;
  questionsThisWeek: number;
  activityData: ActivityDay[];
  focusAreas: FocusArea[];
  quizProfile: {
    recommendedTechniques?: string[];
    studyStyle?: string;
  } | null;
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ProgressDashboard({
  streakDays,
  consistencyScore,
  accuracyScore,
  totalQuestions,
  questionsThisWeek,
  activityData,
  focusAreas,
  quizProfile,
}: ProgressDashboardProps) {
  const maxCount = Math.max(...activityData.map((d) => d.count), 1);

  const topTech = quizProfile?.recommendedTechniques?.[0] ?? null;

  const streakMessage =
    streakDays === 0
      ? "Start your strategy today."
      : streakDays <= 3
        ? "Revision streak active."
        : streakDays <= 7
          ? "Consistency building. Progress updated."
          : "Marks secured. Keep this momentum.";

  return (
    <div className="space-y-8">
      {/* Section 1 — Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={<Flame className="h-5 w-5 text-primary" />}
          value={`${streakDays}`}
          label="Revision Streak"
          suffix="days active"
          barValue={Math.min(100, (streakDays / 14) * 100)}
        />
        <MetricCard
          icon={<Target className="h-5 w-5 text-primary" />}
          value={`${consistencyScore}`}
          label="Consistency"
          suffix="%"
          barValue={consistencyScore}
        />
        <MetricCard
          icon={<BarChart3 className="h-5 w-5 text-primary" />}
          value={`${totalQuestions}`}
          label="Questions Asked"
          suffix="total"
        />
        <MetricCard
          icon={<Zap className="h-5 w-5 text-primary" />}
          value={`${questionsThisWeek}`}
          label="This Week"
          suffix="questions"
        />
      </div>

      {/* Section 2 — Activity Graph + Focus Areas */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm lg:col-span-4">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Activity — Last 7 Days
          </p>
          <div className="flex items-end justify-between gap-1.5" style={{ height: 140 }}>
            {activityData.map((day, i) => {
              const h = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-text-muted">{day.count}</span>
                  <div className="flex w-full items-end justify-center" style={{ height: 100 }}>
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-primary transition-all"
                      style={{ height: `${Math.max(h, day.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {dayLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm lg:col-span-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Your Focus Areas
          </p>
          {focusAreas.length === 0 ? (
            <p className="text-sm text-text-secondary">Ask questions to see your top subjects.</p>
          ) : (
            <div className="space-y-3">
              {focusAreas.map((area) => (
                <div
                  key={area.name}
                  className="flex items-center justify-between rounded-lg border border-border/40 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{area.name}</span>
                  <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {area.count}
                  </span>
                </div>
              ))}
            </div>
          )}

          {topTech && (
            <div className="mt-4 rounded-lg border border-border/40 bg-primary/[0.02] px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                Recommended Technique
              </p>
              <p className="mt-1 text-sm font-medium text-foreground capitalize">
                {topTech.replace(/_/g, " ")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 4 — Gamification Status */}
      <div className="rounded-xl border border-primary/10 bg-primary/[0.02] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <p className="font-serif text-sm italic text-text-secondary">
            {streakMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  suffix,
  barValue,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix: string;
  barValue?: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
            {label}
          </p>
          {icon}
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          <span className="text-xs text-text-muted">{suffix}</span>
        </div>
        {barValue !== undefined && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${Math.min(100, barValue)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
