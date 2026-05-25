"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, Clock, BookOpen, Calendar } from "lucide-react";

interface Session {
  id: string;
  questionText: string;
  createdAt: string;
  board: { name: string; code: string };
  subject: { name: string };
  level: { name: string };
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [boardFilter, setBoardFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchSessions = useCallback(async (reset = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (boardFilter) params.set("boardCode", boardFilter.toUpperCase());
    if (subjectFilter) params.set("subjectId", subjectFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (!reset && cursor) params.set("cursor", cursor);

    const res = await fetch(`/api/questions?${params}`);
    const data = await res.json();
    if (reset) {
      setSessions(data.sessions ?? []);
    } else {
      setSessions((prev) => [...prev, ...(data.sessions ?? [])]);
    }
    setHasMore(!!data.nextCursor);
    setCursor(data.nextCursor);
    setLoading(false);
  }, [boardFilter, subjectFilter, dateFrom, dateTo, cursor]);

  useEffect(() => {
    fetchSessions(true);
  }, [boardFilter, subjectFilter, dateFrom, dateTo]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.15em] text-[#6B7A72]">
          <span className="inline-block h-1 w-1 rounded-full bg-[#C9A84C]" />
          History
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14] sm:text-3xl">
          Question History
        </h1>
        <p className="text-sm text-[#3D4F47]">
          Browse all your past questions and AI answers.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-2 shadow-sm">
          <Search className="h-3.5 w-3.5 text-[#6B7A72]" />
          <input
            placeholder="Board (CBSE, ICSE...)"
            value={boardFilter}
            onChange={(e) => { setBoardFilter(e.target.value); setCursor(null); }}
            className="min-w-0 border-0 bg-transparent text-xs text-[#0A1A14] outline-none placeholder:text-[#6B7A72]/50"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-2 shadow-sm">
          <BookOpen className="h-3.5 w-3.5 text-[#6B7A72]" />
          <input
            placeholder="Subject"
            value={subjectFilter}
            onChange={(e) => { setSubjectFilter(e.target.value); setCursor(null); }}
            className="min-w-0 border-0 bg-transparent text-xs text-[#0A1A14] outline-none placeholder:text-[#6B7A72]/50"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-3 py-2 shadow-sm">
          <Calendar className="h-3.5 w-3.5 text-[#6B7A72]" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setCursor(null); }}
            className="min-w-0 border-0 bg-transparent text-xs text-[#0A1A14] outline-none [&::-webkit-calendar-picker-indicator]:opacity-40"
          />
          <span className="text-xs text-[#D6D0C4]">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setCursor(null); }}
            className="min-w-0 border-0 bg-transparent text-xs text-[#0A1A14] outline-none [&::-webkit-calendar-picker-indicator]:opacity-40"
          />
        </div>
        {(boardFilter || subjectFilter || dateFrom || dateTo) && (
          <button
            onClick={() => { setBoardFilter(""); setSubjectFilter(""); setDateFrom(""); setDateTo(""); setCursor(null); }}
            className="rounded-lg px-3 py-2 text-xs font-medium text-[#6B7A72] transition-colors hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
          >
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {sessions.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
          >
            <Link
              href={`/history/${s.id}`}
              className="group relative flex items-center gap-4 overflow-hidden rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0F3226]/20 hover:shadow-md sm:p-5"
            >
              <div className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-[#0F3226] to-[#C9A84C] opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
                  <span className="rounded-md bg-[#0F3226]/5 px-2 py-0.5 text-[#0F3226]">
                    {s.board.name}
                  </span>
                  <span className="text-[#B8B0A0]">·</span>
                  <span className="text-[#6B7A72]">{s.subject.name}</span>
                  <span className="text-[#B8B0A0]">·</span>
                  <span className="text-[#6B7A72]">{s.level.name}</span>
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-[#B8B0A0]">
                    <Clock className="h-3 w-3" />
                    {new Date(s.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-1 text-sm font-medium text-[#0A1A14]">
                  {s.questionText}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0F3226]/5 text-[#0F3226] opacity-0 transition-all group-hover:opacity-100 group-hover:bg-[#0F3226]/10">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          </motion.div>
        ))}

        {loading && (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-[#D6D0C4]/20 bg-[#FDFCF9] p-5 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-3 w-16 rounded bg-[#D6D0C4]/30" />
                  <div className="h-3 w-3 rounded-full bg-[#D6D0C4]/20" />
                  <div className="h-3 w-20 rounded bg-[#D6D0C4]/30" />
                  <div className="h-3 w-3 rounded-full bg-[#D6D0C4]/20" />
                  <div className="h-3 w-16 rounded bg-[#D6D0C4]/30" />
                  <div className="ml-auto h-3 w-24 rounded bg-[#D6D0C4]/20" />
                </div>
                <div className="h-4 w-3/4 rounded bg-[#D6D0C4]/30" />
              </div>
            ))}
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D0C4]/40 bg-[#FDFCF9] px-6 py-16 text-center shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0F3226]/5 to-[#0F3226]/10">
              <Search className="h-6 w-6 text-[#0F3226]/40" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold text-[#0A1A14]">No questions found</h3>
            <p className="mt-1 text-sm text-[#6B7A72]">
              {boardFilter || subjectFilter || dateFrom || dateTo
                ? "Try adjusting your filters."
                : "Ask your first question to see it here."}
            </p>
            {!boardFilter && !subjectFilter && !dateFrom && !dateTo && (
              <a
                href="/ask"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F3226] px-5 py-2.5 text-sm font-medium text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md"
              >
                Ask a question
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        )}
      </div>

      {/* Load more */}
      {hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={() => fetchSessions(false)}
            className="group inline-flex items-center gap-2 rounded-xl border border-[#D6D0C4]/30 bg-[#FDFCF9] px-6 py-2.5 text-xs font-medium text-[#6B7A72] shadow-sm transition-all hover:border-[#0F3226]/30 hover:text-[#0F3226] hover:shadow-md"
          >
            Load more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}
