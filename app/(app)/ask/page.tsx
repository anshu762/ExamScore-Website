"use client";

import { useState, useEffect, useCallback } from "react";
import { BoardSelector, getStoredSelection, type StoredSelection } from "@/components/shared/BoardSelector";
import { QuestionInput } from "@/components/shared/QuestionInput";
import { AnswerDisplay } from "@/components/shared/AnswerDisplay";
import { useSession } from "next-auth/react";
import { Clock, RotateCcw } from "lucide-react";
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
    <div className="flex gap-8">
      <div className="min-w-0 flex-1">
        {noSelection ? (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h1 className="font-serif text-2xl font-semibold text-[#0A1A14]">
                Ask a Question
              </h1>
              <p className="mt-1 text-sm text-[#3D4F47]">
                Select your curriculum context to get board-specific answers.
              </p>
            </div>
            <BoardSelector onComplete={handleBoardComplete} />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-[#3D4F47]">
                <span className="font-medium text-[#0F3226]">
                  {selection.boardName}
                </span>
                <span className="text-[#D6D0C4]">/</span>
                <span className="font-medium text-[#0F3226]">
                  {selection.levelName}
                </span>
                <span className="text-[#D6D0C4]">/</span>
                <span className="font-medium text-[#0F3226]">
                  {selection.subjectName}
                </span>
                <span className="ml-1.5 rounded-full bg-[#0F3226]/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#0F3226]/70">
                  {selection.boardCode}
                </span>
              </div>
              <button
                onClick={handleChange}
                className="rounded-md px-2.5 py-1 text-xs font-medium text-[#6B7A72] transition-colors hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
              >
                Change
              </button>
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-serif text-sm font-medium text-[#0A1A14]">
                Your Question
              </label>
              <QuestionInput
                value={question}
                onChange={setQuestion}
                onSubmit={handleSubmit}
                disabled={loading}
                placeholder={`Ask your question for ${selection.subjectName} — ${selection.boardName} style`}
                maxLength={2000}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !question.trim()}
              className="mb-8 w-full rounded-xl bg-[#0F3226] py-3 font-serif text-base font-semibold text-[#FDFCF9] shadow-sm transition-all hover:bg-[#0F3226]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-pulse rounded-full bg-[#FDFCF9]/30" />
                  Generating your board-specific answer...
                </span>
              ) : (
                "Get Answer"
              )}
            </button>

            {loading && (
              <div className="space-y-4 rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] p-6 shadow-sm">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#D6D0C4]/30" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-[#D6D0C4]/30" />
                <div className="h-24 w-full animate-pulse rounded bg-[#D6D0C4]/30" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-[#D6D0C4]/30" />
                <div className="h-5 w-5/6 animate-pulse rounded bg-[#D6D0C4]/30" />
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </span>
                <div>
                  <p className="text-sm font-medium text-red-700">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {response && (
              <AnswerDisplay
                directAnswer={response.directAnswer}
                structureGuide={response.structureGuide}
                commonMistakes={response.commonMistakes}
                visuals={response.visuals}
                sessionId={sessionId ?? undefined}
              />
            )}
          </div>
        )}
      </div>

      {!noSelection && (
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-24">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-[#6B7A72]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6B7A72]">
                Recent Questions
              </h3>
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-[#6B7A72]/50">
                No questions yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleRestoreQuestion(item.questionText)}
                      className="group w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-[#0F3226]/5"
                    >
                      <p className="line-clamp-2 text-xs text-[#3D4F47] group-hover:text-[#0F3226]">
                        {item.questionText}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-[#6B7A72]/50">
                        <RotateCcw className="h-3 w-3" />
                        Restore
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
