"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Filter,
  Sparkles,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Markdown } from "@/components/shared/Markdown";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  source: string;
  createdAt: string;
  board: { name: string; code: string };
  subject: { name: string };
}

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [filterBoard, setFilterBoard] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  useEffect(() => {
    fetch("/api/flashcards")
      .then((r) => r.json())
      .then((data) => {
        setCards(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to load flashcards"))
      .finally(() => setLoading(false));
  }, []);

  const boards = [...new Set(cards.map((c) => c.board.code))];
  const subjects = [...new Set(cards.filter((c) => filterBoard === "all" || c.board.code === filterBoard).map((c) => c.subject.name))];

  const filtered = cards.filter((c) => {
    if (filterBoard !== "all" && c.board.code !== filterBoard) return false;
    if (filterSubject !== "all" && c.subject.name !== filterSubject) return false;
    return true;
  });

  const visibleCards = filtered.filter((c) => !knownIds.has(c.id));
  const safeIndex = currentIndex >= visibleCards.length ? 0 : currentIndex;
  const current = visibleCards[safeIndex] ?? null;

  function nextCard() {
    if (safeIndex < visibleCards.length - 1) {
      setCurrentIndex(safeIndex + 1);
      setFlipped(false);
    }
  }

  function prevCard() {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
      setFlipped(false);
    }
  }

  function markKnown() {
    if (current) {
      setKnownIds((prev) => new Set(prev).add(current.id));
      setFlipped(false);
      if (safeIndex < visibleCards.length - 1) {
        setCurrentIndex(safeIndex + 1);
      }
    }
  }

  function resetAll() {
    setKnownIds(new Set());
    setCurrentIndex(0);
    setFlipped(false);
  }

  const progressPct = visibleCards.length > 0
    ? ((currentIndex + 1) / visibleCards.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 rounded bg-[#D6D0C4]/30" />
              <div className="h-6 w-40 rounded bg-[#D6D0C4]/30" />
            </div>
            <div className="h-9 w-28 rounded-xl bg-[#D6D0C4]/20" />
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/20 bg-[#FDFCF9] shadow-sm" style={{ minHeight: "300px" }}>
          <div className="animate-pulse p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-[#D6D0C4]/30" />
              <div className="h-3 w-16 rounded bg-[#D6D0C4]/20" />
            </div>
            <div className="mb-3 h-3 w-16 rounded bg-[#D6D0C4]/30" />
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-[#D6D0C4]/30" />
              <div className="h-4 w-5/6 rounded bg-[#D6D0C4]/30" />
              <div className="h-4 w-3/4 rounded bg-[#D6D0C4]/30" />
              <div className="h-4 w-2/3 rounded bg-[#D6D0C4]/30" />
            </div>
          </div>
          <div className="border-t border-[#D6D0C4]/20 p-4">
            <div className="mx-auto flex w-64 animate-pulse gap-3">
              <div className="h-10 flex-1 rounded-xl bg-[#D6D0C4]/20" />
              <div className="h-10 flex-1 rounded-xl bg-[#D6D0C4]/20" />
              <div className="h-10 flex-1 rounded-xl bg-[#D6D0C4]/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/40 bg-[#FDFCF9] px-6 py-20 text-center shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3226]/5 to-[#0F3226]/10">
            <Brain className="h-7 w-7 text-[#0F3226]/40" />
          </div>
          <h3 className="mt-5 font-serif text-xl font-semibold text-[#0A1A14]">No flashcards yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#6B7A72]">
            Create flashcards from your AI answers to review key concepts and reinforce your learning.
          </p>
          <a
            href="/ask"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md"
          >
            <Sparkles className="h-4 w-4" />
            Ask a question to get started
          </a>
        </motion.div>
      </div>
    );
  }

  if (visibleCards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#6B7A72]">
              <span className="inline-block h-1 w-1 rounded-full bg-[#C9A84C]" />
              Flashcards
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
              All done!
            </h1>
            <p className="text-sm text-[#3D4F47]">
              You&apos;ve reviewed all {knownIds.size} flashcard{knownIds.size !== 1 ? "s" : ""}.
            </p>
          </div>
          <button
            onClick={resetAll}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDFCF9]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <RotateCcw className="relative h-4 w-4" />
            <span className="relative">Review Again</span>
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-6 py-16 text-center shadow-sm"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="mt-4 font-serif text-lg font-semibold text-[#0A1A14]">All reviewed</h3>
          <p className="mt-1 text-sm text-[#6B7A72]">Great work! You&apos;ve mastered these cards.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#6B7A72]">
            <span className="inline-block h-1 w-1 rounded-full bg-[#C9A84C]" />
            Flashcards
          </div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
            Review
          </h1>
          <p className="text-sm text-[#3D4F47]">
            {visibleCards.length} card{visibleCards.length !== 1 && "s"} to review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-1.5 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-[#6B7A72]" />
            <select
              value={filterBoard}
              onChange={(e) => { setFilterBoard(e.target.value); setFilterSubject("all"); setCurrentIndex(0); setFlipped(false); }}
              className="border-0 bg-transparent text-xs font-medium text-[#0A1A14] outline-none"
            >
              <option value="all">All Boards</option>
              {boards.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          {filterBoard !== "all" && (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-1.5 shadow-sm">
              <select
                value={filterSubject}
                onChange={(e) => { setFilterSubject(e.target.value); setCurrentIndex(0); setFlipped(false); }}
                className="border-0 bg-transparent text-xs font-medium text-[#0A1A14] outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4 flex items-center justify-between text-xs text-[#6B7A72]">
        <span className="font-medium">{currentIndex + 1} of {visibleCards.length}</span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          {knownIds.size} known
        </span>
      </div>
      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-[#D6D0C4]/15">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#0F3226] to-[#0F3226]/60"
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id ?? "empty"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="relative mb-5"
            >
              <div
                onClick={() => setFlipped(!flipped)}
                className="group relative cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="relative transition-all duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: flipped ? "rotateY(180deg)" : "",
                    minHeight: "320px",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 flex flex-col rounded-2xl border border-[#D6D0C4]/30 bg-[#FDFCF9] shadow-sm"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="flex-1 overflow-y-auto px-6 pt-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F3226]/5">
                          <GraduationCap className="h-3.5 w-3.5 text-[#0F3226]" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0F3226]/40">
                          Question
                        </span>
                      </div>
                      <div className="font-serif text-base leading-relaxed text-[#0A1A14]">
                        {current && <Markdown content={current.front} />}
                      </div>
                    </div>
                    <div className="text-center text-[10px] text-[#6B7A72]/30 bg-[#FDFCF9] py-3 border-t border-[#D6D0C4]/10">
                      Tap anywhere to reveal answer
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 flex flex-col rounded-2xl border border-[#0F3226]/20 bg-[#0F3226] shadow-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex-1 overflow-y-auto px-6 pt-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FDFCF9]/10">
                          <Brain className="h-3.5 w-3.5 text-[#C9A84C]" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#FDFCF9]/40">
                          Answer
                        </span>
                      </div>
                      <div className="font-serif text-base leading-relaxed text-[#FDFCF9] [&_*]:text-[#FDFCF9] [&_strong]:text-[#FDFCF9] [&_code]:text-[#FDFCF9] [&_code]:bg-[#FDFCF9]/10 [&_th]:text-[#FDFCF9] [&_td]:text-[#FDFCF9] break-words">
                        {current && <Markdown content={current.back} />}
                      </div>
                    </div>
                    <div className="text-center text-[10px] text-[#FDFCF9]/20 bg-[#0F3226] py-3 border-t border-[#FDFCF9]/5">
                      Tap to flip back
                    </div>
                  </div>
                </div>
              </div>

              {current && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-[#0F3226]/5 px-3 py-1 text-[10px] font-medium text-[#0F3226]">
                    <BookOpen className="h-3 w-3" />
                    {current.board.name}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-[#0F3226]/5 px-3 py-1 text-[10px] font-medium text-[#0F3226]">
                    {current.subject.name}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-4 py-2.5 text-sm font-medium text-[#6B7A72] shadow-sm transition-all hover:border-[#0F3226]/30 hover:text-[#0F3226] hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Previous
            </button>

            <button
              onClick={markKnown}
              className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDFCF9]/8 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <CheckCircle2 className="relative h-4 w-4" />
              <span className="relative">Known</span>
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex >= visibleCards.length - 1}
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-4 py-2.5 text-sm font-medium text-[#6B7A72] shadow-sm transition-all hover:border-[#0F3226]/30 hover:text-[#0F3226] hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none"
            >
              Next
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {knownIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 text-center"
            >
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#D6D0C4]/40 px-4 py-2 text-xs font-medium text-[#6B7A72] transition-colors hover:border-[#0F3226]/30 hover:text-[#0F3226]"
              >
                <RotateCcw className="h-3 w-3" />
                Reset ({knownIds.size} known)
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
