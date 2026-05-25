"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BoardSelector, getStoredSelection, type StoredSelection } from "@/components/shared/BoardSelector";
import { QuestionInput } from "@/components/shared/QuestionInput";
import { AnswerDisplay } from "@/components/shared/AnswerDisplay";
import { useSession } from "next-auth/react";
import { Sparkles, Clock, RotateCcw, BookOpen, ChevronRight, ArrowRight, GraduationCap, History } from "lucide-react";
import type { Visual } from "@/lib/ai/types";

interface HistoryItem {
  id: string;
  questionText: string;
  createdAt: string;
}

export default function AskPage() {
  const { data: session } = useSession();
  const [selection, setSelection] = useState<StoredSelection | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<{
    directAnswer: string;
    structureGuide: {
      introduction: string;
      body: string;
      evaluation?: string | null;
      conclusion: string;
      formattingNotes: string;
      paragraphFlow: string;
    };
    commonMistakes: string[];
    visuals: Visual[];
  } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = getStoredSelection();
    if (stored) setSelection(stored);
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/question?limit=3");
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch {}
  }

  const handleBoardComplete = useCallback((sel: StoredSelection) => {
    setSelection(sel);
  }, []);

  const handleChange = useCallback(() => {
    setSelection(null);
    setQuestion("");
    setResponse(null);
    setError("");
    setSessionId(null);
  }, []);

  async function handleSubmit() {
    if (!question.trim() || !selection) return;
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const res = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: question,
          boardCode: selection.boardCode,
          boardId: selection.boardId,
          levelId: selection.levelId,
          subjectId: selection.subjectId,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to get answer");
      }
      const data = await res.json();
      setResponse({
        directAnswer: data.directAnswer,
        structureGuide: data.structureGuide,
        commonMistakes: data.commonMistakes,
        visuals: data.visuals,
      });
      setSessionId(data.sessionId);
      fetchHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleRestoreQuestion(q: string) {
    setQuestion(q);
  }

  const noSelection = !selection;

  return (
    <div className="flex gap-10">
      <div className="min-w-0 flex-1">
        {noSelection ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#0F3226]/10 bg-[#0F3226]/5 px-4 py-1.5">
                <GraduationCap className="h-3.5 w-3.5 text-[#0F3226]" />
                <span className="text-[11px] font-medium text-[#0F3226]">Board-specific answers</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#0A1A14] sm:text-4xl">
                Ask a Question
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-[#3D4F47]">
                Select your curriculum context. We&apos;ll tailor the answer to your board&apos;s marking scheme.
              </p>
            </div>
            <BoardSelector onComplete={handleBoardComplete} />
          </motion.div>
        ) : (
          <div className="mx-auto max-w-3xl">
            {/* Context bar — premium */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] shadow-sm"
            >
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5 text-sm">
                  <span className="flex items-center gap-1.5 rounded-lg bg-[#0F3226]/5 px-2.5 py-1 font-medium text-[#0F3226]">
                    <BookOpen className="h-3.5 w-3.5" />
                    {selection.boardName}
                  </span>
                  <ChevronRight className="h-3 w-3 shrink-0 text-[#D6D0C4]" />
                  <span className="rounded-lg bg-[#0F3226]/5 px-2.5 py-1 font-medium text-[#0F3226]">
                    {selection.levelName}
                  </span>
                  <ChevronRight className="h-3 w-3 shrink-0 text-[#D6D0C4]" />
                  <span className="rounded-lg bg-[#C9A84C]/10 px-2.5 py-1 font-medium text-[#A8882E]">
                    {selection.subjectName}
                  </span>
                  <span className="ml-1 rounded-full bg-[#0F3226]/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F3226]/60">
                    {selection.boardCode}
                  </span>
                </div>
                <button
                  onClick={handleChange}
                  className="ml-3 shrink-0 rounded-lg border border-[#D6D0C4]/40 px-3 py-1.5 text-[11px] font-medium text-[#6B7A72] transition-all hover:border-[#0F3226]/30 hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
                >
                  Change
                </button>
              </div>
              <div className="h-px bg-gradient-to-r from-[#0F3226]/10 via-[#C9A84C]/10 to-transparent" />
            </motion.div>

            {/* Question input — premium */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#0F3226]/10 to-[#0F3226]/5">
                  <Sparkles className="h-3.5 w-3.5 text-[#0F3226]" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
                  Your Question
                </span>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#0F3226]/20 via-[#C9A84C]/10 to-[#0F3226]/20 opacity-0 blur-sm transition-opacity group-focus-within:opacity-100" />
                <div className="relative">
                  <QuestionInput
                    value={question}
                    onChange={setQuestion}
                    onSubmit={handleSubmit}
                    disabled={loading}
                    placeholder={`Ask your ${selection.subjectName} question — ${selection.boardName} style...`}
                    maxLength={2000}
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <button
                onClick={handleSubmit}
                disabled={loading || !question.trim()}
                className="group relative w-full overflow-hidden rounded-xl bg-[#0F3226] py-3.5 font-serif text-base font-semibold text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDFCF9]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {loading ? (
                  <span className="relative flex items-center justify-center gap-2.5">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "300ms" }} />
                    </span>
                    Generating your board-specific answer...
                  </span>
                ) : (
                  <span className="relative flex items-center justify-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Get Answer
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </button>
            </motion.div>

            {/* Loading skeleton */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-4"
                >
                  <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/30 bg-[#FDFCF9] shadow-sm">
                    <div className="flex items-center gap-3 border-b border-[#D6D0C4]/20 bg-[#0F3226] px-6 py-4">
                      <div className="h-8 w-8 animate-pulse rounded-xl bg-[#FDFCF9]/10" />
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-40 animate-pulse rounded bg-[#FDFCF9]/10" />
                        <div className="h-2 w-28 animate-pulse rounded bg-[#FDFCF9]/8" />
                      </div>
                    </div>
                    <div className="space-y-2.5 px-6 py-5">
                      <div className="h-3 w-full animate-pulse rounded bg-[#D6D0C4]/30" />
                      <div className="h-3 w-5/6 animate-pulse rounded bg-[#D6D0C4]/30" />
                      <div className="h-3 w-4/6 animate-pulse rounded bg-[#D6D0C4]/30" />
                      <div className="h-3 w-3/4 animate-pulse rounded bg-[#D6D0C4]/30" />
                      <div className="h-3 w-2/3 animate-pulse rounded bg-[#D6D0C4]/30" />
                    </div>
                  </div>
                  <div className="flex gap-2 px-1">
                    <div className="h-8 w-20 animate-pulse rounded-lg bg-[#D6D0C4]/20" />
                    <div className="h-8 w-24 animate-pulse rounded-lg bg-[#D6D0C4]/20" />
                    <div className="h-8 w-16 animate-pulse rounded-lg bg-[#D6D0C4]/20" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  className="mb-6 overflow-hidden rounded-xl border border-red-200/80 bg-[#FDFCF9] shadow-sm"
                >
                  <div className="flex items-start gap-3 px-5 py-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100">
                      <span className="text-xs font-bold text-red-600">!</span>
                    </span>
                    <div>
                      <p className="text-sm font-medium text-red-700">Unable to generate answer</p>
                      <p className="mt-0.5 text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-red-200/60 via-red-200/30 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer */}
            <AnimatePresence>
              {response && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <AnswerDisplay
                    directAnswer={response.directAnswer}
                    structureGuide={response.structureGuide}
                    commonMistakes={response.commonMistakes}
                    visuals={response.visuals}
                    sessionId={sessionId ?? undefined}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Sidebar — Recent Questions */}
      {!noSelection && (
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0F3226]/5">
                <History className="h-3.5 w-3.5 text-[#0F3226]" />
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6B7A72]">
                Recent
              </h3>
            </div>
            {history.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#D6D0C4]/30 px-4 py-5 text-center">
                <Clock className="mx-auto mb-2 h-5 w-5 text-[#6B7A72]/30" />
                <p className="text-[11px] text-[#6B7A72]/50">
                  No questions yet
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleRestoreQuestion(item.questionText)}
                    className="group w-full rounded-lg border border-transparent px-3 py-2.5 text-left transition-all hover:border-[#D6D0C4]/30 hover:bg-[#FDFCF9] hover:shadow-sm"
                  >
                    <p className="line-clamp-2 text-xs leading-relaxed text-[#3D4F47] group-hover:text-[#0F3226]">
                      {item.questionText}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#6B7A72]/40 group-hover:text-[#0F3226]/60">
                      <RotateCcw className="h-3 w-3" />
                      Restore question
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-4 h-px bg-gradient-to-r from-[#D6D0C4]/40 to-transparent" />
          </div>
        </aside>
      )}
    </div>
  );
}
