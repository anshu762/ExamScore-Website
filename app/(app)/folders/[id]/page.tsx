"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FolderKanban, ArrowLeft, BookOpen, Trash2, Book, Star, Beaker,
  Calculator, Globe, ChartNoAxesColumnIncreasing, AlertTriangle, Sparkles,
  Check, ArrowRight, BarChart3, Lightbulb, PenLine,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/shared/Markdown";

const ICON_MAP: Record<string, React.ElementType> = {
  book: Book, star: Star, beaker: Beaker, calculator: Calculator,
  globe: Globe, chart: ChartNoAxesColumnIncreasing, brain: BookOpen,
};

interface QuestionItem {
  id: string;
  referenceId: string;
  details: {
    id: string;
    questionText: string;
    createdAt: string;
    subject: { name: string };
    board: { name: string };
    level: { name: string };
    aiResponse: {
      id: string;
      directAnswer: string;
      structureGuide: Record<string, unknown>;
      commonMistakes: string[];
    } | null;
  } | null;
}

interface Folder {
  id: string; name: string; color: string; icon: string;
}

type AnswerTab = "answer" | "guide" | "mistakes";

const SECTION_META: Record<string, { icon: React.ElementType; accent: string }> = {
  Introduction: { icon: Star, accent: "from-emerald-500/10 to-transparent" },
  Body: { icon: ArrowRight, accent: "from-amber-500/10 to-transparent" },
  Evaluation: { icon: BarChart3, accent: "from-blue-500/10 to-transparent" },
  Conclusion: { icon: Check, accent: "from-purple-500/10 to-transparent" },
  "Formatting Notes": { icon: Lightbulb, accent: "from-pink-500/10 to-transparent" },
  "Paragraph Flow": { icon: PenLine, accent: "from-teal-500/10 to-transparent" },
};

export default function FolderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const folderId = params.id as string;

  const [folder, setFolder] = useState<Folder | null>(null);
  const [items, setItems] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [folderRes, itemsRes] = await Promise.all([
        fetch("/api/folders").then((r) => r.json()),
        fetch(`/api/folders/${folderId}/items`).then((r) => r.json()),
      ]);
      const found = folderRes.find((f: Folder) => f.id === folderId);
      setFolder(found ?? null);
      setItems(Array.isArray(itemsRes) ? itemsRes : []);
    } catch {
      toast.error("Failed to load folder");
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function removeItem(itemId: string) {
    try {
      const res = await fetch(`/api/folders/${folderId}/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Item removed");
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      toast.error("Failed to remove item");
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-24 rounded bg-border/60" />
        <div className="rounded-2xl bg-card p-6" style={{ backgroundColor: "#0F3226" + "0D" }}>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-border/60" />
            <div className="space-y-2">
              <div className="h-6 w-36 rounded bg-border/60" />
              <div className="h-4 w-20 rounded bg-border/60" />
            </div>
          </div>
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/30 bg-card p-4">
            <div className="h-4 w-3/4 rounded bg-border/60 mb-2" />
            <div className="h-3 w-1/2 rounded bg-border/60" />
          </div>
        ))}
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-secondary">Folder not found</p>
        <button onClick={() => router.push("/folders")} className="mt-4 text-sm text-primary underline">
          Back to folders
        </button>
      </div>
    );
  }

  const IconComp = ICON_MAP[folder.icon] ?? FolderKanban;

  return (
    <div>
      <button
        onClick={() => router.push("/folders")}
        className="mb-6 flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Folders
      </button>

      <div className="relative mb-6 overflow-hidden rounded-2xl p-6" style={{ backgroundColor: folder.color + "0D" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundColor: folder.color }} />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-[#FDFCF9] shadow-md" style={{ backgroundColor: folder.color }}>
            <IconComp className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">{folder.name}</h1>
            <p className="mt-0.5 text-sm text-text-muted">
              {items.length} {items.length === 1 ? "question" : "questions"}
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 px-6 py-16 text-center">
          <BookOpen className="mb-3 h-8 w-8 text-text-muted/30" />
          <p className="text-sm text-text-secondary">No questions saved in this folder</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          {items.map((item) => {
            const d = item.details;
            const title = d?.questionText ?? "Untitled";
            const date = d?.createdAt ? formatDate(new Date(d.createdAt)) : "";
            const subject = d?.subject?.name ?? "";
            const board = d?.board?.name ?? "";
            const level = d?.level?.name ?? "";
            const aiResp = d?.aiResponse ?? null;
            const directAnswer = aiResp?.directAnswer ?? "";
            const structureGuide = aiResp?.structureGuide ?? null;
            const commonMistakes = aiResp?.commonMistakes ?? [];

            return (
              <details
                key={item.id}
                className="group rounded-xl border border-border/30 bg-card shadow-sm transition-all hover:shadow-md open:shadow-md"
              >
                <summary className="flex cursor-pointer items-center gap-4 px-5 py-4">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium text-foreground">
                      {title.length > 80 ? title.slice(0, 80) + "..." : title}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {date}
                      {(subject || board) && <span> · {board}{level ? ` - ${level}` : ""}{subject ? ` - ${subject}` : ""}</span>}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted/40 transition-colors hover:bg-red-50 hover:text-error"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </summary>

                {directAnswer && (
                  <ExpandedAnswer
                    directAnswer={directAnswer}
                    structureGuide={structureGuide}
                    commonMistakes={commonMistakes}
                  />
                )}
              </details>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function ExpandedAnswer({
  directAnswer, structureGuide, commonMistakes,
}: {
  directAnswer: string;
  structureGuide: Record<string, unknown> | null;
  commonMistakes: string[];
}) {
  const [tab, setTab] = useState<AnswerTab>("answer");

  const guideSections = structureGuide
    ? [
        { title: "Introduction", content: (structureGuide as any).introduction },
        { title: "Body", content: (structureGuide as any).body },
        { title: "Evaluation", content: (structureGuide as any).evaluation },
        { title: "Conclusion", content: (structureGuide as any).conclusion },
        { title: "Formatting Notes", content: (structureGuide as any).formattingNotes },
        { title: "Paragraph Flow", content: (structureGuide as any).paragraphFlow },
      ].filter((s) => s.content)
    : [];

  return (
    <div className="border-t border-border/20 px-5 py-4">
      <div className="mb-4 flex gap-1 rounded-lg bg-primary/5 p-0.5">
        <button
          onClick={() => setTab("answer")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
            tab === "answer" ? "bg-card text-primary shadow-sm" : "text-text-muted hover:text-primary"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Answer
        </button>
        {guideSections.length > 0 && (
          <button
            onClick={() => setTab("guide")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
              tab === "guide" ? "bg-card text-primary shadow-sm" : "text-text-muted hover:text-primary"
            }`}
          >
            <PenLine className="h-3 w-3" />
            Structure
          </button>
        )}
        {commonMistakes.length > 0 && (
          <button
            onClick={() => setTab("mistakes")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
              tab === "mistakes" ? "bg-card text-primary shadow-sm" : "text-text-muted hover:text-primary"
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Mistakes
          </button>
        )}
      </div>

      {tab === "answer" && (
        <div className="text-sm leading-relaxed text-text-secondary">
          <Markdown content={directAnswer} />
        </div>
      )}

      {tab === "guide" && guideSections.map((s) => {
        const meta = SECTION_META[s.title] ?? { icon: PenLine, accent: "from-gray-500/10 to-transparent" };
        const Icon = meta.icon;
        return (
          <div key={s.title} className="mb-3 last:mb-0">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Icon className="h-3 w-3 text-primary/50" />
              <h5 className="text-[11px] font-semibold text-foreground">{s.title}</h5>
            </div>
            <div className="text-sm leading-relaxed text-text-secondary">
              <Markdown content={s.content ?? ""} />
            </div>
          </div>
        );
      })}

      {tab === "mistakes" && (
        <div className="space-y-1.5">
          {commonMistakes.map((m, i) => (
            <div key={i} className="flex items-start gap-2.5 rounded-lg border border-red-100/50 bg-red-50/30 px-3.5 py-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-text-secondary">{m}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
