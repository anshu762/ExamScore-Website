"use client";

import { useState, useEffect, useCallback } from "react";
import { BoardSelector, getStoredSelection, type StoredSelection } from "@/components/shared/BoardSelector";

export default function AskPage() {
  const [selection, setSelection] = useState<StoredSelection | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<{
    directAnswer: string;
    structureGuide: {
      introduction: string;
      body: string;
      evaluation?: string;
      conclusion?: string;
      formattingNotes: string;
      paragraphFlow: string;
    };
    commonMistakes: string[];
    visuals: string[];
  } | null>(null);

  useEffect(() => {
    const stored = getStoredSelection();
    if (stored) setSelection(stored);
  }, []);

  const handleBoardComplete = useCallback((sel: StoredSelection) => {
    setSelection(sel);
  }, []);

  const handleChange = useCallback(() => {
    setSelection(null);
    setQuestion("");
    setResponse(null);
    setError("");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !selection) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: question,
          boardCode: selection.boardCode,
          levelId: selection.levelId,
          subjectId: selection.subjectId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to get answer");
      }

      const data = await res.json();
      setResponse(data.aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!selection) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-semibold text-[#0A1A14]">Ask a Question</h1>
          <p className="mt-1 text-sm text-[#3D4F47]">
            Select your curriculum context to get board-specific answers.
          </p>
        </div>
        <BoardSelector onComplete={handleBoardComplete} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-[#3D4F47]">
          <span className="font-medium text-[#0F3226]">{selection.boardName}</span>
          <span className="text-[#D6D0C4]">/</span>
          <span className="font-medium text-[#0F3226]">{selection.levelName}</span>
          <span className="text-[#D6D0C4]">/</span>
          <span className="font-medium text-[#0F3226]">{selection.subjectName}</span>
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

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[#0A1A14]">Your Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your exam question here..."
          rows={5}
          className="w-full resize-none rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] p-4 text-sm text-[#0A1A14] outline-none transition-colors placeholder:text-[#6B7A72]/60 focus:border-[#0F3226]/40 focus:ring-1 focus:ring-[#0F3226]/20"
          disabled={loading}
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#6B7A72]">
            Answer will be tailored to {selection.boardName} ({selection.levelName}) — {selection.subjectName}
          </p>
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-lg bg-[#0F3226] px-5 py-2 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#0F3226]/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Generating answer..." : "Get Answer"}
          </button>
        </div>
      </form>

      {loading && (
        <div className="space-y-4 rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] p-6">
          <div className="h-4 w-3/4 animate-pulse rounded bg-[#D6D0C4]/30" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-[#D6D0C4]/30" />
          <div className="h-20 w-full animate-pulse rounded bg-[#D6D0C4]/30" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-[#D6D0C4]/30" />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600 shrink-0">!</span>
          <div>
            <p className="text-sm font-medium text-red-700">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {response && (
        <div className="space-y-5">
          <div className="rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] p-6">
            <h3 className="mb-3 font-serif text-lg font-semibold text-[#0A1A14]">Direct Answer</h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">{response.directAnswer}</p>
          </div>

          <div className="rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold text-[#0A1A14]">Structure Guide</h3>
            <div className="space-y-4">
              {response.structureGuide.introduction && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">Introduction</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">{response.structureGuide.introduction}</p>
                </div>
              )}
              {response.structureGuide.body && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">Body</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">{response.structureGuide.body}</p>
                </div>
              )}
              {response.structureGuide.evaluation && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">Evaluation</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">{response.structureGuide.evaluation}</p>
                </div>
              )}
              {response.structureGuide.conclusion && (
                <div>
                  <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">Conclusion</h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">{response.structureGuide.conclusion}</p>
                </div>
              )}
            </div>
          </div>

          {response.commonMistakes.length > 0 && (
            <div className="rounded-lg border border-[#D6D0C4]/50 bg-[#FDFCF9] p-6">
              <h3 className="mb-3 font-serif text-lg font-semibold text-[#0A1A14]">Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {response.commonMistakes.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#3D4F47]">
                    <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-red-500 shrink-0">!</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
