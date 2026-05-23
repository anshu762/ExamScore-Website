"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  AlertTriangle,
  BarChart3,
  Copy,
  FolderPlus,
  Lightbulb,
  PenLine,
  Check,
  Star,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Visual } from "@/lib/ai/types";
import { Markdown } from "./Markdown";
import { FolderSelectorModal } from "./FolderSelectorModal";

interface AnswerDisplayProps {
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
  sessionId?: string;
}

type TabId = "answer" | "guide" | "mistakes";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "answer", label: "Direct Answer", icon: BookOpen },
  { id: "guide", label: "Structure Guide", icon: PenLine },
  { id: "mistakes", label: "Common Mistakes", icon: AlertTriangle },
];

const SECTION_META: Record<string, { icon: React.ElementType; accent: string }> = {
  Introduction: { icon: Star, accent: "from-emerald-500/10 to-transparent" },
  Body: { icon: ArrowRight, accent: "from-amber-500/10 to-transparent" },
  Evaluation: { icon: BarChart3, accent: "from-blue-500/10 to-transparent" },
  Conclusion: { icon: Check, accent: "from-purple-500/10 to-transparent" },
  "Formatting Notes": { icon: Lightbulb, accent: "from-pink-500/10 to-transparent" },
  "Paragraph Flow": { icon: PenLine, accent: "from-teal-500/10 to-transparent" },
};

export function AnswerDisplay({
  directAnswer,
  structureGuide,
  commonMistakes,
  visuals,
  sessionId,
}: AnswerDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabId>("answer");

  const hasVisuals = Array.isArray(visuals) ? visuals.some((v) => v.type !== "none") : false;
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [flashcardSaving, setFlashcardSaving] = useState(false);

  function handleCopy() {
    const text = [directAnswer, structureGuide.introduction, structureGuide.body]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Answer copied to clipboard");
  }

  function handleSaveToFolder() {
    setFolderModalOpen(true);
  }

  async function handleCreateFlashcard() {
    if (!sessionId) {
      toast.error("No session available");
      return;
    }
    setFlashcardSaving(true);
    try {
      const res = await fetch(`/api/flashcards/from-session/${sessionId}`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Flashcard created");
    } catch {
      toast.error("Failed to create flashcard");
    } finally {
      setFlashcardSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Tab bar */}
      <div className="relative flex gap-1 rounded-2xl bg-[#0F3226]/5 p-1.5">
        <div className="absolute inset-x-1.5 top-0 h-px bg-gradient-to-r from-transparent via-[#0F3226]/20 to-transparent" />
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#FDFCF9] text-[#0F3226] shadow-md shadow-black/5"
                  : "text-[#6B7A72] hover:bg-[#0F3226]/[0.04] hover:text-[#0F3226]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "" : "opacity-60"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "answer" && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F3226]/[0.02] to-transparent" />
              <div className="relative px-7 py-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F3226] text-[#FDFCF9]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0F3226]/50">
                      Examiner's Model Answer
                    </p>
                    <p className="text-xs text-[#6B7A72]">
                      What examiners expect to see
                    </p>
                  </div>
                </div>
                <div className="font-serif leading-relaxed text-[#3D4F47]">
                  <Markdown content={directAnswer} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "guide" && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {(
              [
                { title: "Introduction", content: structureGuide.introduction },
                { title: "Body", content: structureGuide.body },
                { title: "Evaluation", content: structureGuide.evaluation },
                { title: "Conclusion", content: structureGuide.conclusion },
                { title: "Formatting Notes", content: structureGuide.formattingNotes },
                { title: "Paragraph Flow", content: structureGuide.paragraphFlow },
              ] as const
            )
              .filter((s) => s.content)
              .map((section, idx) => {
                const meta = SECTION_META[section.title] ?? {
                  icon: PenLine,
                  accent: "from-gray-500/10 to-transparent",
                };
                const Icon = meta.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                    className="relative overflow-hidden rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] shadow-sm"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${meta.accent}`}
                    />
                    <div className="relative px-6 py-5">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0F3226]/5">
                          <Icon className="h-3.5 w-3.5 text-[#0F3226]" />
                        </div>
                        <h4 className="font-serif text-sm font-semibold text-[#0A1A14]">
                          {section.title}
                        </h4>
                      </div>
                      <div className="text-sm leading-relaxed text-[#3D4F47]">
                        <Markdown content={section.content ?? ""} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </motion.div>
        )}

        {activeTab === "mistakes" && (
          <motion.div
            key="mistakes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl border border-red-200/60 bg-[#FDFCF9] shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent" />
              <div className="relative px-7 py-6">
                <div className="mb-5 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500/60">
                      Pitfalls
                    </p>
                    <p className="text-xs text-[#6B7A72]">
                      Mistakes that cost marks
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {commonMistakes.map((mistake, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-red-100/50 bg-red-50/30 px-4 py-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-600">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-[#3D4F47]">
                        {mistake}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasVisuals && (
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0F3226]/40">
            Visual Aids
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {visuals
              .filter((v) => v.type !== "none")
              .map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                        v.type === "graph"
                          ? "bg-blue-50 text-blue-600"
                          : v.type === "diagram"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {v.type === "graph" ? (
                        <BarChart3 className="h-4 w-4" />
                      ) : v.type === "diagram" ? (
                        <PenLine className="h-4 w-4" />
                      ) : (
                        <Lightbulb className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#0F3226]/50">
                      {v.type}
                    </span>
                  </div>
                  <div className="mb-3 text-sm leading-relaxed text-[#3D4F47]">
                    <Markdown content={v.description} />
                  </div>
                  <div className="rounded-xl bg-[#0F3226]/[0.03] px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0F3226]/50">
                      How to draw
                    </p>
                    <p className="mt-0.5 text-sm italic text-[#6B7A72]">
                      {v.hint}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Spacer for fixed action bar */}
      <div className="h-20" />
      
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#0F3226]/15 bg-[#0F3226] px-5 py-3.5 shadow-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2">
          <button
            onClick={handleSaveToFolder}
            className="flex items-center gap-2 rounded-xl bg-[#FDFCF9]/10 px-4 py-2 text-xs font-medium text-[#FDFCF9] transition-all hover:bg-[#FDFCF9]/20 active:scale-[0.97]"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Save
          </button>
          <div className="h-5 w-px bg-[#FDFCF9]/20" />
          <button
            onClick={handleCreateFlashcard}
            disabled={flashcardSaving}
            className="flex items-center gap-2 rounded-xl bg-[#FDFCF9]/10 px-4 py-2 text-xs font-medium text-[#FDFCF9] transition-all hover:bg-[#FDFCF9]/20 active:scale-[0.97] disabled:opacity-40"
          >
            {flashcardSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Flashcard
          </button>
          <div className="h-5 w-px bg-[#FDFCF9]/20" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl bg-[#FDFCF9]/10 px-4 py-2 text-xs font-medium text-[#FDFCF9] transition-all hover:bg-[#FDFCF9]/20 active:scale-[0.97]"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>

      {sessionId && (
        <FolderSelectorModal
          open={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          sessionId={sessionId}
        />
      )}
    </div>
  );
}
