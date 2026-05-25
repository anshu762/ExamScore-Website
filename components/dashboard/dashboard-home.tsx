"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Flame, BarChart3, BookOpen, TrendingUp, Target, Zap } from "lucide-react";

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

function GreetingIcon() {
  const h = new Date().getHours();
  if (h < 12) return <Sparkles className="h-5 w-5 text-[#C9A84C]" />;
  if (h < 17) return <Zap className="h-5 w-5 text-[#C9A84C]" />;
  return <MoonIcon />;
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardHome({
  userName,
  recentSessions,
  metrics,
  questionsThisWeek,
  liveUserCount,
  quizProfile,
}: DashboardHomeProps) {
  const topTech = quizProfile?.recommendedTechniques?.[0] ?? null;
  const studyStyle = quizProfile?.studyStyle ?? null;
  const hasActivity = metrics.streakDays > 0 || questionsThisWeek > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl space-y-6 sm:space-y-8"
    >
      {/* ── Greeting ── */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#6B7A72]">
            <span className="inline-block h-1 w-1 rounded-full bg-[#C9A84C]" />
            Dashboard
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
            {getGreeting()}, {userName}.
          </h1>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-[#D6D0C4]/30 bg-[#FDFCF9] px-4 py-2 shadow-sm sm:flex">
          <div className="flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-medium text-[#6B7A72]">
            {liveUserCount.toLocaleString()} active
          </span>
        </div>
      </motion.div>

      {/* ── Quick stats row ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#0F3226]/[0.03]" />
          <Flame className="mb-2 h-5 w-5 text-[#0F3226]" />
          <p className="font-serif text-2xl font-semibold text-[#0A1A14]">{metrics.streakDays}</p>
          <p className="mt-0.5 text-xs text-[#6B7A72]">Day streak</p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#0F3226]/[0.03]" />
          <Target className="mb-2 h-5 w-5 text-[#0F3226]" />
          <p className="font-serif text-2xl font-semibold text-[#0A1A14]">{questionsThisWeek}</p>
          <p className="mt-0.5 text-xs text-[#6B7A72]">Questions this week</p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#0F3226]/[0.03]" />
          <BarChart3 className="mb-2 h-5 w-5 text-[#0F3226]" />
          <p className="font-serif text-2xl font-semibold text-[#0A1A14]">{metrics.consistencyScore}%</p>
          <p className="mt-0.5 text-xs text-[#6B7A72]">Consistency</p>
        </div>
        <div className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-4 shadow-sm transition-all hover:shadow-md sm:p-5">
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-[#C9A84C]/[0.06]" />
          <TrendingUp className="mb-2 h-5 w-5 text-[#C9A84C]" />
          <p className="font-serif text-2xl font-semibold text-[#0A1A14]">{metrics.accuracyScore}%</p>
          <p className="mt-0.5 text-xs text-[#6B7A72]">Accuracy</p>
        </div>
      </motion.div>

      {/* ── Quick Actions ── */}
      <motion.div variants={itemVariants} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <Link
          href="/ask"
          className="group relative overflow-hidden rounded-xl border border-[#0F3226]/10 bg-gradient-to-br from-[#0F3226] to-[#1A4A36] p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FDFCF9]/[0.04]" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-[#FDFCF9]/[0.02]" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FDFCF9]/50">Quick Action</p>
              <h2 className="font-serif text-lg font-semibold text-[#FDFCF9] sm:text-xl">Ask a Question</h2>
              <p className="max-w-xs text-sm leading-relaxed text-[#FDFCF9]/60">
                Get AI-powered answers with step-by-step explanations.
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#FDFCF9]/10 text-[#FDFCF9] transition-all group-hover:bg-[#FDFCF9]/20">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#C9A84C] transition-all group-hover:gap-2">
            Ask now <ArrowRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
          </div>
        </Link>

        <Link
          href="/flashcards"
          className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-5 shadow-sm transition-all hover:shadow-md sm:p-6"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0F3226]/[0.02]" />
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6B7A72]">Review</p>
              <h2 className="font-serif text-lg font-semibold text-[#0A1A14] sm:text-xl">Flashcards</h2>
              <p className="max-w-xs text-sm leading-relaxed text-[#3D4F47]">
                Reinforce concepts with spaced repetition.
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F3226]/5 text-[#0F3226] transition-all group-hover:bg-[#0F3226]/10">
              <Brain className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#0F3226] transition-all group-hover:gap-2">
            Open deck <ArrowRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>

      {/* ── Continue Where You Left Off ── */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-[#0F3226]/20 to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">Recent Activity</span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#0F3226]/20 to-transparent" />
        </div>

        {recentSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#D6D0C4]/40 bg-[#FDFCF9] px-6 py-14 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0F3226]/5">
              <BookOpen className="h-6 w-6 text-[#0F3226]/40" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-[#0A1A14]">No study sessions yet</h3>
            <p className="mt-1 max-w-sm text-sm text-[#6B7A72]">
              Your first question is just a click away. Ask anything and start your learning journey.
            </p>
            <Link
              href="/ask"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-[#1A4A36]"
            >
              <Sparkles className="h-4 w-4" />
              Ask your first question
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recentSessions.map((s, i) => (
              <Link
                key={s.id}
                href={`/history/${s.id}`}
                className="group relative overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-[#0F3226] to-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-center gap-2 text-[11px] font-medium">
                  <span className="rounded-md bg-[#0F3226]/5 px-2 py-0.5 text-[#0F3226]">
                    {s.board.name}
                  </span>
                  <span className="text-[#6B7A72]">{s.subject.name}</span>
                  <span className="ml-auto text-[#B8B0A0]">
                    {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-snug text-[#0A1A14]">
                  {s.questionText}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#0F3226] transition-all group-hover:gap-1.5">
                  View answer <ArrowRight className="h-3 w-3 transition-all group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Strategy & Insights ── */}
      {(topTech || studyStyle) && (
        <motion.div variants={itemVariants}>
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-[#C9A84C]/20 to-transparent" />
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">Your Strategy</span>
            <div className="h-px flex-1 bg-gradient-to-l from-[#C9A84C]/20 to-transparent" />
          </div>
          <div className="overflow-hidden rounded-xl border border-[#C9A84C]/15 bg-gradient-to-br from-[#FDFCF9] via-[#FDFCF9] to-[#C9A84C]/[0.03] p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A84C]/10 to-[#C9A84C]/5">
                <Target className="h-6 w-6 text-[#C9A84C]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
                  Recommended Technique
                </p>
                <p className="mt-1 font-serif text-lg font-semibold capitalize text-[#0A1A14]">
                  {topTech?.replace(/_/g, " ") ?? "Active Recall"}
                </p>
                {studyStyle && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-[#C9A84C]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#A8882E]">
                      {studyStyle.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-[#6B7A72]">
                      Study style
                    </span>
                  </div>
                )}
              </div>
              <Link
                href="/progress"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6D0C4]/40 bg-[#FDFCF9] px-4 py-2 text-sm font-medium text-[#0F3226] transition-all hover:border-[#0F3226]/30 hover:shadow-sm"
              >
                View insights <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Bottom CTA (only if no strategy yet) ── */}
      {!topTech && !studyStyle && (
        <motion.div variants={itemVariants}>
          <div className="rounded-xl border border-dashed border-[#C9A84C]/20 bg-gradient-to-br from-[#C9A84C]/[0.02] to-transparent p-5 text-center sm:p-6">
            <p className="text-sm text-[#6B7A72]">
              Complete your{" "}
              <Link href="/onboarding/quiz" className="font-medium text-[#0F3226] underline underline-offset-2 hover:text-[#1A4A36]">
                learning profile
              </Link>{" "}
              to get personalized study strategies.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
