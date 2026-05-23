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
  Loader2,
  Filter,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-[#0F3226]/50" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/50 bg-[#FDFCF9] px-6 py-20 text-center">
        <Brain className="mb-4 h-12 w-12 text-[#6B7A72]/30" />
        <h2 className="mb-1 font-serif text-xl font-semibold text-[#0A1A14]">No flashcards yet</h2>
        <p className="mb-6 text-sm text-[#6B7A72]">Create flashcards from your AI answers to review later</p>
      </div>
    );
  }

  if (visibleCards.length === 0) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0A1A14]">Flashcards</h1>
            <p className="mt-1 text-sm text-[#6B7A72]">Review and study key concepts</p>
          </div>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-[#0A1A14]"
          >
            <RotateCcw className="h-4 w-4" />
            Reset All
          </button>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-6 py-20 text-center">
          <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-400" />
          <h2 className="mb-1 font-serif text-lg font-semibold text-[#0A1A14]">All done!</h2>
          <p className="text-sm text-[#6B7A72]">You've reviewed all {knownIds.size} flashcards.</p>
          <button
            onClick={resetAll}
            className="mt-6 flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-colors hover:bg-[#0A1A14]"
          >
            <RotateCcw className="h-4 w-4" />
            Review Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0A1A14]">Flashcards</h1>
          <p className="mt-1 text-sm text-[#6B7A72]">
            {visibleCards.length} card{visibleCards.length !== 1 && "s"} to review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-1.5">
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
            <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-1.5">
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

      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="mb-4 flex items-center justify-between text-xs text-[#6B7A72]">
            <span>{currentIndex + 1} of {visibleCards.length}</span>
            <span>{knownIds.size} known</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id ?? "empty"}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.2 }}
              className="relative mb-6"
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
                    minHeight: "280px",
                  }}
                >
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] p-6 shadow-sm"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#0F3226]/40">
                      Question
                    </div>
                    <div className="font-serif text-base leading-relaxed text-[#0A1A14]">
                      {current && <Markdown content={current.front} />}
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#6B7A72]/40">
                      Tap to flip
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-[#0F3226]/20 bg-[#0F3226] p-6 shadow-sm"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#FDFCF9]/40">
                      Answer
                    </div>
                    <div className="font-serif text-base leading-relaxed text-[#FDFCF9]">
                      {current && <Markdown content={current.back} />}
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#FDFCF9]/30">
                      Tap to flip back
                    </div>
                  </div>
                </div>
              </div>

              {current && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  <span className="rounded-md bg-[#0F3226]/5 px-2 py-0.5 text-[10px] text-[#6B7A72]">
                    {current.board.name}
                  </span>
                  <span className="rounded-md bg-[#0F3226]/5 px-2 py-0.5 text-[10px] text-[#6B7A72]">
                    {current.subject.name}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/40 bg-[#FDFCF9] px-4 py-2.5 text-sm font-medium text-[#6B7A72] transition-all hover:border-[#0F3226]/30 hover:text-[#0F3226] disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <button
              onClick={markKnown}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-[#FDFCF9] transition-all hover:bg-emerald-700"
            >
              <CheckCircle2 className="h-4 w-4" />
              Known
            </button>

            <button
              onClick={nextCard}
              disabled={currentIndex >= visibleCards.length - 1}
              className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/40 bg-[#FDFCF9] px-4 py-2.5 text-sm font-medium text-[#6B7A72] transition-all hover:border-[#0F3226]/30 hover:text-[#0F3226] disabled:opacity-30"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {knownIds.size > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={resetAll}
                className="text-xs font-medium text-[#6B7A72] underline transition-colors hover:text-[#0F3226]"
              >
                Reset all ({knownIds.size} known)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
