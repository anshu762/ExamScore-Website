"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Search } from "lucide-react";

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
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
          History
        </p>
        <h1 className="mt-1 font-serif text-2xl font-semibold text-foreground">Question History</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Board code (IB, AP, CBSE...)"
          value={boardFilter}
          onChange={(e) => { setBoardFilter(e.target.value); setCursor(null); }}
          className="h-9 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
        />
        <input
          placeholder="Subject ID"
          value={subjectFilter}
          onChange={(e) => { setSubjectFilter(e.target.value); setCursor(null); }}
          className="h-9 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground outline-none placeholder:text-text-muted focus:border-primary"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => { setDateFrom(e.target.value); setCursor(null); }}
          className="h-9 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => { setDateTo(e.target.value); setCursor(null); }}
          className="h-9 rounded-lg border border-border/60 bg-card px-3 text-xs text-foreground outline-none focus:border-primary"
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/history/${s.id}`}
            className="group flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4 transition-all hover:border-border hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted">
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                  {s.board.name}
                </span>
                <span>{s.subject.name}</span>
                <span>· {s.level.name}</span>
                <span>· {new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">
                {s.questionText}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
          </Link>
        ))}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
          </div>
        )}
        {!loading && sessions.length === 0 && (
          <div className="py-12 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-text-muted/40" />
            <p className="text-sm text-text-secondary">No questions match your filters.</p>
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <button
          onClick={() => fetchSessions(false)}
          className="mx-auto flex items-center gap-2 rounded-lg border border-border/60 px-5 py-2 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          Load more
        </button>
      )}
    </div>
  );
}
