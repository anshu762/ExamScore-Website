"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, ChevronDown, BookOpen, FileText, GraduationCap, TrendingUp, Brain, Target, Sparkles, ArrowRight, ChevronRight, Quote, BarChart3, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    title: "Board-Specific Answers",
    description: "Every response is tailored to your curriculum — IB, AP, Cambridge, CBSE, or ICSE. Our AI understands the exact syllabus and marking scheme.",
    icon: FileText,
  },
  {
    title: "Examiner-Aligned",
    description: "Structured answers follow examiner expectations. Learn how to frame responses that earn full marks, with proper evaluation and conclusions.",
    icon: GraduationCap,
  },
  {
    title: "Progress Analytics",
    description: "Monitor accuracy, consistency, and study streaks. Understand your strengths and pinpoint exactly where to focus next.",
    icon: TrendingUp,
  },
  {
    title: "AI-Powered Flashcards",
    description: "Auto-generated flashcards from your study sessions. Reinforce key concepts with spaced repetition and smart reviews.",
    icon: Brain,
  },
  {
    title: "Personalized Learning",
    description: "Our adaptive algorithm identifies weak areas and recommends focused practice to maximize your score improvement.",
    icon: Target,
  },
  {
    title: "Study Organisation",
    description: "Organise questions into folders by topic, exam, or difficulty. Keep everything structured and easy to revisit.",
    icon: BookOpen,
  },
];

const steps = [
  { number: "01", title: "Choose Your Board", description: "Select from IB, AP, Cambridge, CBSE, or ICSE. Your content is immediately tailored to your curriculum." },
  { number: "02", title: "Ask Anything", description: "Type any question from your syllabus. Our AI responds with a structured, examiner-approved answer." },
  { number: "03", title: "Review & Improve", description: "Track accuracy, consistency, and progress over time. Focus on what matters most." },
];

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "15+", label: "Boards Supported" },
  { value: "98.5%", label: "Satisfaction Rate" },
  { value: "4.8x", label: "Score Improvement" },
];

function LiveCounter() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/stats/live-user-count")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => setCount(127493));
  }, []);
  return (
    <span className="tabular-nums">{count?.toLocaleString() ?? "127,493"}</span>
  );
}

function FadeIn({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const y = direction === "up" ? 32 : 0;
  const x = direction === "left" ? -24 : direction === "right" ? 24 : 0;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <div className="overflow-hidden font-serif">
      {/* ─── NAV ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0F3226]/80 px-6 py-4 backdrop-blur-xl sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="ExamScore" className="h-8 w-8 rounded-md object-cover" />
          <span className="text-base font-semibold tracking-tight text-[#FDFCF9]">
            ExamScore
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDFCF9]/10 text-xs font-semibold text-[#FDFCF9]/70 transition-colors hover:bg-[#FDFCF9]/20"
                >
                  {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-10 w-44 overflow-hidden rounded-lg border border-[#FDFCF9]/10 bg-[#0A1A14] shadow-xl">
                    <div className="border-b border-[#FDFCF9]/5 px-4 py-3">
                      <p className="truncate text-sm font-medium text-[#FDFCF9]/90">{session?.user?.name ?? "User"}</p>
                      <p className="truncate text-xs text-[#FDFCF9]/40">{session?.user?.email ?? ""}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#FDFCF9]/70 transition-colors hover:bg-[#FDFCF9]/5 hover:text-[#FDFCF9]"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setMenuOpen(false); signOut(); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#FDFCF9]/50 transition-colors hover:bg-[#FDFCF9]/5 hover:text-[#FDFCF9]/90"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link
                href="/auth/login"
                className="text-sm text-[#FDFCF9]/70 transition-colors hover:text-[#FDFCF9]"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-[#FDFCF9] px-5 py-2 text-sm font-semibold text-[#0F3226] transition-all duration-150 hover:bg-[#FDFCF9]/90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0F3226]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, rgba(253,252,249,0.08) 0%, transparent 70%)" }} />
          <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(253,252,249,0.05) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRENGQzkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-28 pb-20 sm:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }}
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/8 px-3.5 py-1 text-xs font-medium tracking-wide text-[#C9A84C]">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Exam Preparation
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-[#FDFCF9] sm:text-6xl md:text-7xl lg:text-7xl"
              >
                Stop Guessing,{" "}
                <span className="bg-gradient-to-r from-[#C9A84C] to-[#DCC47A] bg-clip-text text-transparent">
                  Start Scoring.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="mt-5 text-base leading-relaxed text-[#FDFCF9]/70 sm:text-lg max-w-lg mx-auto lg:mx-0"
              >
                Board-specific AI answers aligned with examiner expectations.
                Master IB, AP, Cambridge, CBSE, and ICSE with precision.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
              >
                {isLoggedIn ? (
                  <Link
                    href="/dashboard"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FDFCF9] px-8 py-3.5 text-sm font-semibold text-[#0F3226] transition-all duration-150 hover:bg-[#FDFCF9]/90 sm:w-auto"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/signup"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#FDFCF9] px-8 py-3.5 text-sm font-semibold text-[#0F3226] transition-all duration-150 hover:bg-[#FDFCF9]/90 sm:w-auto"
                    >
                      Start Your Journey
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    <Link
                      href="/auth/login"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#FDFCF9]/20 px-8 py-3.5 text-sm font-medium text-[#FDFCF9]/80 backdrop-blur-sm transition-all duration-150 hover:border-[#FDFCF9]/30 hover:text-[#FDFCF9] sm:w-auto"
                    >
                      Log In
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm lg:justify-start"
              >
                <div className="flex items-center gap-2 text-[#FDFCF9]/50">
                  <div className="flex -space-x-1.5">
                    {["#C9A84C", "#FDFCF9/20", "#FDFCF9/15", "#FDFCF9/10"].map((c, i) => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-[#0F3226] bg-gradient-to-br from-[#FDFCF9]/30 to-[#FDFCF9]/10" />
                    ))}
                  </div>
                  <span>
                    <LiveCounter /> students
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#C9A84C]/70">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Start free, no credit card</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-br from-[#C9A84C]/10 via-transparent to-[#FDFCF9]/5 blur-xl" />
                <div className="relative overflow-hidden rounded-xl border border-[#FDFCF9]/10 bg-[#0A1A14]/40 backdrop-blur-sm">
                  <div className="flex items-center gap-2 border-b border-[#FDFCF9]/5 px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FDFCF9]/20" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#C9A84C]/40" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#2D6A4F]/40" />
                    </div>
                    <span className="ml-3 text-xs text-[#FDFCF9]/30">dashboard.examscore.app</span>
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between rounded-lg bg-[#FDFCF9]/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#C9A84C]/15 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-[#C9A84C]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#FDFCF9]/90">IB History Paper 2</p>
                          <p className="text-xs text-[#FDFCF9]/40">Causes of WWI · 95% accuracy</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#FDFCF9]/5">
                        <div className="h-full w-[95%] rounded-full bg-gradient-to-r from-[#C9A84C] to-[#DCC47A]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#FDFCF9]/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#FDFCF9]/8 flex items-center justify-center">
                          <Brain className="h-4 w-4 text-[#FDFCF9]/70" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#FDFCF9]/90">AP Calculus BC</p>
                          <p className="text-xs text-[#FDFCF9]/40">Integration techniques · 87% accuracy</p>
                        </div>
                      </div>
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#FDFCF9]/5">
                        <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#C9A84C] to-[#DCC47A]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-[#FDFCF9]/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-[#2D6A4F]/15 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-[#2D6A4F]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#FDFCF9]/90">CBSE Class 12 Physics</p>
                          <p className="text-xs text-[#FDFCF9]/40">Electromagnetism · Completed</p>
                        </div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-[#2D6A4F]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative bg-[#0F3226] border-t border-[#FDFCF9]/5">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[#FDFCF9] sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-[#FDFCF9]/50">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="relative bg-[#F5F2EA] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F3226]/10 bg-[#0F3226]/5 px-3.5 py-1 text-xs font-medium tracking-wide text-[#0F3226]/70">
                <Sparkles className="h-3 w-3" />
                Everything You Need
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0A1A14] sm:text-4xl">
                Built for serious exam preparation
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#3D4F47]">
                From board-specific answers to progress tracking — everything you need to study smarter.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.title} delay={i * 0.05}>
                  <div className="group relative rounded-xl border border-[#D6D0C4]/60 bg-[#FDFCF9] p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0F3226]/[0.02] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F3226]/5 ring-1 ring-[#0F3226]/10">
                        <Icon className="h-5 w-5 text-[#0F3226]" />
                      </div>
                      <h3 className="mt-4 text-base font-semibold text-[#0A1A14]">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#3D4F47]">{f.description}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="relative bg-[#FDFCF9] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/8 px-3.5 py-1 text-xs font-medium tracking-wide text-[#C9A84C]">
                <Zap className="h-3 w-3" />
                Three Simple Steps
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0A1A14] sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#3D4F47]">
                Get started in minutes and see results in days.
              </p>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <FadeIn key={s.number} delay={i * 0.1}>
                <div className="group relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0F3226] text-lg font-bold text-[#FDFCF9] shadow-sm transition-transform group-hover:scale-105">
                    {s.number}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-[#0A1A14]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#3D4F47]">{s.description}</p>
                  {i < steps.length - 1 && (
                    <div className="absolute top-7 -right-4 hidden text-[#D6D0C4] md:block">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOARDS ─── */}
      <section className="relative bg-[#F5F2EA] py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 sm:px-10">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0F3226]/10 bg-[#0F3226]/5 px-3.5 py-1 text-xs font-medium tracking-wide text-[#0F3226]/70">
                <BookOpen className="h-3 w-3" />
                Supported Curricula
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0A1A14] sm:text-4xl">
                One platform, every board
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#3D4F47]">
                Comprehensive coverage of major international and national curricula.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {["IB", "AP", "Cambridge", "CBSE", "ICSE"].map((board) => (
                <div
                  key={board}
                  className="group rounded-xl border border-[#D6D0C4]/60 bg-[#FDFCF9] px-5 py-6 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <p className="text-lg font-bold tracking-tight text-[#0F3226] transition-colors group-hover:text-[#C9A84C]">
                    {board}
                  </p>
                  <p className="mt-1 text-xs text-[#6B7A72]">Curriculum</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative overflow-hidden bg-[#0F3226] py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(253,252,249,0.05) 0%, transparent 70%)" }} />
        </div>

        <FadeIn>
          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-10">
            <h2 className="text-3xl font-bold tracking-tight text-[#FDFCF9] sm:text-4xl">
              Ready to transform your exam preparation?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#FDFCF9]/60">
              Join thousands of students who are already scoring higher with AI-powered, board-specific study tools.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#FDFCF9] px-8 py-3.5 text-sm font-semibold text-[#0F3226] transition-all duration-150 hover:bg-[#FDFCF9]/90"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#FDFCF9] px-8 py-3.5 text-sm font-semibold text-[#0F3226] transition-all duration-150 hover:bg-[#FDFCF9]/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
            <p className="mt-5 text-xs text-[#FDFCF9]/30">No credit card required. Free forever, for serious students.</p>
          </div>
        </FadeIn>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#FDFCF9]/5 bg-[#0F3226]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="ExamScore" className="h-8 w-8 rounded-md object-cover" />
                <span className="text-base font-semibold tracking-tight text-[#FDFCF9]">ExamScore</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FDFCF9]/40">
                Board-specific AI answers aligned with examiner expectations. Master IB, AP, Cambridge, CBSE, and ICSE.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FDFCF9]/30">Product</p>
              <ul className="mt-4 space-y-3">
                {["Features", "Boards", "Pricing", "FAQ"].map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-[#FDFCF9]/50 transition-colors hover:text-[#FDFCF9]/80">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#FDFCF9]/30">Company</p>
              <ul className="mt-4 space-y-3">
                {["About", "Blog", "Contact", "Privacy"].map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-sm text-[#FDFCF9]/50 transition-colors hover:text-[#FDFCF9]/80">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-14 border-t border-[#FDFCF9]/5 pt-8 text-center">
            <p className="text-xs text-[#FDFCF9]/30">
              &copy; {new Date().getFullYear()} ExamScore. Academic excellence, powered by AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
