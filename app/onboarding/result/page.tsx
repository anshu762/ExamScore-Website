"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, ArrowRight, BookOpen, Brain, Target, Clock, Zap, BarChart3 } from "lucide-react";
import { TECHNIQUE_META } from "@/lib/quiz/profiler";
import type { ResultProfile } from "@/lib/quiz/profiler";

const ICON_MAP: Record<string, React.ElementType> = {
  flashcards: Brain,
  active_recall: Zap,
  timed_practice: Clock,
  blurting: BookOpen,
  mind_maps: BarChart3,
  past_paper_drilling: Target,
  streak_building: Zap,
  daily_goals: Target,
};

export default function OnboardingResultPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ResultProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learning-style-profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.resultProfile) {
          router.push("/onboarding/quiz");
          return;
        }
        setProfile(data.resultProfile as ResultProfile);
      })
      .catch(() => router.push("/onboarding/quiz"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F3226]">
        <Loader2 className="h-6 w-6 animate-spin text-[#FDFCF9]/60" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F3226] px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl bg-[#FDFCF9] px-8 py-10 shadow-xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F3226]">
              <Sparkles className="h-7 w-7 text-[#FDFCF9]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#0A1A14]">Your Academic Strategy</h1>
            <p className="mt-2 text-sm text-[#6B7A72]">
              Personalised recommendations based on your responses
            </p>
          </div>

          {/* Weaknesses */}
          {profile.weaknesses.length > 0 && (
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/50">Areas to Work On</p>
              <div className="flex flex-wrap gap-2">
                {profile.weaknesses.map((w) => (
                  <span
                    key={w}
                    className="rounded-lg border border-amber-200/60 bg-amber-50/50 px-3.5 py-1.5 text-xs font-medium text-amber-800"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended techniques */}
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/50">Recommended Techniques</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {profile.recommendedTechniques.map((key) => {
                const meta = TECHNIQUE_META[key];
                if (!meta) return null;
                const Icon = ICON_MAP[key] ?? Sparkles;
                return (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-xl border border-[#D6D0C4]/40 bg-[#FDFCF9] px-4 py-3.5 shadow-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F3226]/5">
                      <Icon className="h-4 w-4 text-[#0F3226]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0A1A14]">{meta.name}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#6B7A72]">{meta.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study style + session preference */}
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#D6D0C4]/40 bg-[#0F3226]/5 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0F3226]/50">Study Style</p>
              <p className="mt-1 text-sm font-medium text-[#0A1A14] capitalize">{profile.studyStyle}</p>
            </div>
            <div className="rounded-xl border border-[#D6D0C4]/40 bg-[#0F3226]/5 px-4 py-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0F3226]/50">Session Preference</p>
              <p className="mt-1 text-sm font-medium text-[#0A1A14]">
                {profile.sessionPreference === "short_frequent" ? "Short & Frequent" : "Long & Deep"}
              </p>
            </div>
          </div>

          {/* Notes */}
          {profile.notes && (
            <div className="mb-8 rounded-xl border border-[#D6D0C4]/40 bg-[#0F3226]/[0.02] px-5 py-4">
              <p className="text-sm italic leading-relaxed text-[#6B7A72]">{profile.notes}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ask"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F3226] px-6 py-3 text-sm font-semibold text-[#FDFCF9] transition-all hover:bg-[#1A4A36]"
            >
              <Sparkles className="h-4 w-4" />
              Ask Your First Question
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/flashcards"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D6D0C4]/50 px-6 py-3 text-sm font-semibold text-[#0F3226] transition-all hover:bg-[#0F3226]/5"
            >
              <Brain className="h-4 w-4" />
              View Flashcards
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
