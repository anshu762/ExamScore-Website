"use client";

import { motion } from "framer-motion";
import { Flame, Target, BarChart3, Zap, Brain, BookOpen, TrendingUp, Sparkles } from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-5xl space-y-6 sm:space-y-8"
    >
      {/* Section 1 — Metric Cards */}
      <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <MetricCard
          icon={<Flame className="h-4 w-4" />}
          value={`${streakDays}`}
          label="Revision Streak"
          suffix="days"
          trend="up"
          barValue={Math.min(100, (streakDays / 14) * 100)}
        />
        <MetricCard
          icon={<Target className="h-4 w-4" />}
          value={`${consistencyScore}`}
          label="Consistency"
          suffix="%"
          trend={consistencyScore >= 50 ? "up" : "neutral"}
          barValue={consistencyScore}
        />
        <MetricCard
          icon={<BarChart3 className="h-4 w-4" />}
          value={`${totalQuestions}`}
          label="Total Questions"
          suffix="asked"
          trend="neutral"
        />
        <MetricCard
          icon={<TrendingUp className="h-4 w-4" />}
          value={`${questionsThisWeek}`}
          label="This Week"
          suffix="questions"
          trend={questionsThisWeek > 0 ? "up" : "neutral"}
        />
      </motion.div>

      {/* Section 2 — Activity Graph + Focus Areas */}
      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-7 lg:gap-6">
        <div className="rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-5 shadow-sm sm:p-6 lg:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
              Activity — Last 7 Days
            </p>
            <div className="flex items-center gap-1.5 rounded-md bg-[#0F3226]/5 px-2 py-1">
              <Zap className="h-3 w-3 text-[#0F3226]" />
              <span className="text-[10px] font-medium text-[#0F3226]">{questionsThisWeek} total</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-1" style={{ height: 150 }}>
            {activityData.map((day, i) => {
              const h = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
              const isToday = i === activityData.length - 1;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-[#6B7A72]">{day.count}</span>
                  <div className="flex w-full items-end justify-center" style={{ height: 110 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(h, day.count > 0 ? 6 : 0)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`w-full max-w-[28px] rounded-t-md transition-colors ${
                        isToday ? "bg-[#0F3226]" : "bg-[#0F3226]/40"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] ${isToday ? "font-semibold text-[#0F3226]" : "text-[#6B7A72]"}`}>
                    {dayLabels[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-5 shadow-sm sm:p-6 lg:col-span-3">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
            Focus Areas
          </p>
          {focusAreas.length === 0 ? (
            <div className="flex flex-col items-center py-6 text-center">
              <BookOpen className="mb-3 h-8 w-8 text-[#6B7A72]/30" />
              <p className="text-sm text-[#6B7A72]">Ask questions to see your top subjects.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {focusAreas.map((area, i) => {
                const maxCount = Math.max(...focusAreas.map((a) => a.count), 1);
                const pct = (area.count / maxCount) * 100;
                return (
                  <div key={area.name} className="group relative overflow-hidden rounded-lg border border-[#D6D0C4]/30 px-4 py-3 transition-colors hover:border-[#0F3226]/20">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#0F3226]/5 transition-all group-hover:bg-[#0F3226]/8"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F3226]/5 text-[10px] font-semibold text-[#0F3226]">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium text-[#0A1A14]">{area.name}</span>
                      </div>
                      <span className="rounded-md bg-[#0F3226]/5 px-2 py-0.5 text-xs font-semibold text-[#0F3226]">
                        {area.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {topTech && (
            <div className="mt-4 rounded-lg border border-[#C9A84C]/15 bg-gradient-to-r from-[#C9A84C]/[0.03] to-transparent px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
                Recommended
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium capitalize text-[#0A1A14]">
                <Brain className="h-3.5 w-3.5 text-[#C9A84C]" />
                {topTech.replace(/_/g, " ")}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Section 3 — Streak Status */}
      <motion.div variants={itemVariants} className="rounded-xl border border-[#0F3226]/10 bg-gradient-to-r from-[#0F3226]/[0.02] via-[#FDFCF9] to-[#FDFCF9] p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0F3226]/5 to-[#0F3226]/10">
              <Sparkles className="h-5 w-5 text-[#0F3226]" />
            </div>
            <div>
              <p className="font-serif text-sm italic text-[#3D4F47]">
                {streakMessage}
              </p>
              {streakDays > 0 && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7A72]">
                  <Flame className="h-3 w-3 text-[#C9A84C]" />
                  {streakDays} day streak · {consistencyScore}% consistency
                </p>
              )}
            </div>
          </div>
          {focusAreas.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-[#6B7A72]">
              <span className="hidden sm:inline">Top subject:</span>
              <span className="rounded-md bg-[#0F3226]/5 px-2 py-1 font-medium text-[#0F3226]">
                {focusAreas[0].name}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  suffix,
  trend,
  barValue,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix: string;
  trend: "up" | "neutral";
  barValue?: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] shadow-sm transition-all hover:shadow-md">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#0F3226] to-[#0F3226]/40" />
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#0F3226]/[0.02]" />
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B7A72]">
            {label}
          </p>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F3226]/5 text-[#0F3226]">
            {icon}
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
            {value}
          </span>
          <span className="text-xs text-[#6B7A72]">{suffix}</span>
          {trend === "up" && Number(value) > 0 && (
            <span className="ml-auto flex items-center gap-0.5 text-[10px] font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" />
            </span>
          )}
        </div>
        {barValue !== undefined && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#EDE8DC]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, barValue)}%` }}
              transition={{ duration: 0.8 }}
              className="h-full rounded-full bg-gradient-to-r from-[#0F3226] to-[#0F3226]/60"
            />
          </div>
        )}
      </div>
    </div>
  );
}
