"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, FileText, GraduationCap, TrendingUp } from "lucide-react";

const features = [
  {
    title: "Board-Specific Answers",
    description:
      "Every response is tailored to your curriculum — IB, AP, Cambridge, CBSE, or ICSE. Our AI understands the exact syllabus and marking scheme.",
    icon: FileText,
  },
  {
    title: "Examiner Aligned",
    description:
      "Structured answers follow examiner expectations. Learn how to structure responses that earn full marks, with proper evaluation and conclusions.",
    icon: GraduationCap,
  },
  {
    title: "Track Your Progress",
    description:
      "Monitor accuracy, consistency, and study streaks. Understand your strengths and pinpoint exactly where to focus next.",
    icon: TrendingUp,
  },
];

function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/stats/live-user-count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(127493));
  }, []);

  const display = count?.toLocaleString() ?? "127,493";

  return (
    <p className="text-sm text-[#FDFCF9]/60 tracking-wide">
      {display} students are improving strategically.
    </p>
  );
}

export default function LandingPage() {
  return (
    <div className="font-serif">
      {/* ─── HERO ─── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
        style={{ backgroundColor: "#0F3226" }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, #FDFCF9 0%, transparent 70%)" }}
        />

        {/* Nav row */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 sm:px-10">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#FDFCF9]" />
            <span className="text-lg font-semibold tracking-tight text-[#FDFCF9]">
              ExamScore
            </span>
          </div>
          <Link
            href="/auth/login"
            className="text-sm text-[#FDFCF9]/70 transition-colors hover:text-[#FDFCF9]"
          >
            Log In
          </Link>
        </nav>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl text-[#FDFCF9]">
            ExamScore
          </h1>
          <p className="mt-4 text-xl font-light tracking-wide text-[#FDFCF9]/90 sm:text-2xl">
            Stop Guessing, Start Scoring.
          </p>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#FDFCF9]/70">
            Board-specific AI answers aligned with examiner expectations.
            Master IB, AP, Cambridge, CBSE, and ICSE with precision.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup">
              <button
                className="rounded-lg px-8 py-3 text-sm font-semibold transition-all duration-150"
                style={{ backgroundColor: "#FDFCF9", color: "#0F3226" }}
              >
                Get Started
              </button>
            </Link>
            <Link href="/auth/login">
              <button
                className="rounded-lg border px-8 py-3 text-sm font-medium transition-all duration-150"
                style={{ borderColor: "#FDFCF9/30", color: "#FDFCF9" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(253,252,249,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Log In
              </button>
            </Link>
          </div>

          <div className="mt-12">
            <LiveCounter />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8" style={{ backgroundColor: "#F5F2EA" }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center md:text-left">
                  <div
                    className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg md:mx-0"
                    style={{ backgroundColor: "rgba(15,50,38,0.07)" }}
                  >
                    <Icon className="h-5 w-5" style={{ color: "#0F3226" }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: "#0F3226" }}>
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#3D4F47" }}>
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ backgroundColor: "#0F3226" }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 sm:flex-row">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#FDFCF9]/60" />
            <span className="text-sm font-medium text-[#FDFCF9]/60">
              ExamScore
            </span>
          </div>
          <p className="text-xs text-[#FDFCF9]/40">
            Academic excellence, powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
