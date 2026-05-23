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
  ChevronDown,
  Eye,
  Layout,
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

interface GuideSection {
  key: string;
  title: string;
  content: string | null | undefined;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  bgColor: string;
  labelColor: string;
}

// ── Card entrance animation ─────────────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

// ── Section accordion item ───────────────────────────────────────────────────
function AccordionSection({ section, defaultOpen }: { section: GuideSection; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = section.icon;

  return (
    <div className={`overflow-hidden rounded-xl border ${section.borderColor} ${section.bgColor}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-black/[0.02]"
      >
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${section.accentColor}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1 font-serif text-sm font-semibold text-[#0A1A14]">
          {section.title}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#6B7A72] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#D6D0C4]/30 px-5 pb-4 pt-3.5">
              <div className={`text-sm leading-relaxed ${section.labelColor}`}>
                <Markdown content={section.content ?? ""} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Visual aid card ──────────────────────────────────────────────────────────
function VisualCard({ visual, index }: { visual: Visual; index: number }) {
  const typeConfig = {
    graph: {
      icon: BarChart3,
      badge: "bg-blue-50 text-blue-600 border-blue-100",
      label: "Graph",
    },
    diagram: {
      icon: Eye,
      badge: "bg-amber-50 text-amber-600 border-amber-100",
      label: "Diagram",
    },
    equation: {
      icon: Layout,
      badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
      label: "Equation",
    },
    none: {
      icon: Lightbulb,
      badge: "bg-gray-50 text-gray-500 border-gray-100",
      label: "Visual",
    },
  };

  const config = typeConfig[visual.type] ?? typeConfig.none;
  const TypeIcon = config.icon;

  return (
    <motion.div
      variants={cardVariants}
      custom={index}
      className="overflow-hidden rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] shadow-sm"
    >
      {/* Card header */}
      <div className="flex items-center gap-2.5 border-b border-[#D6D0C4]/30 px-4 py-3">
        <TypeIcon className="h-4 w-4 text-[#0F3226]/60" />
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      {/* Description */}
      <div className="px-4 py-3 text-sm leading-relaxed text-[#3D4F47]">
        <Markdown content={visual.description} />
      </div>

      {/* How to draw hint */}
      {visual.hint && (
        <div className="mx-4 mb-4 rounded-lg bg-[#0F3226]/[0.04] px-3.5 py-2.5">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F3226]/50">
            How to draw
          </p>
          <p className="text-xs italic leading-relaxed text-[#6B7A72]">{visual.hint}</p>
        </div>
      )}
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export function AnswerDisplay({
  directAnswer,
  structureGuide,
  commonMistakes,
  visuals,
  sessionId,
}: AnswerDisplayProps) {
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [flashcardSaving, setFlashcardSaving] = useState(false);

  const hasVisuals = Array.isArray(visuals) && visuals.some((v) => v.type !== "none");

  const guideSections: GuideSection[] = [
    {
      key: "introduction",
      title: "Introduction",
      content: structureGuide.introduction,
      icon: Star,
      accentColor: "bg-emerald-50 text-emerald-600",
      borderColor: "border-emerald-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
    {
      key: "body",
      title: "Body",
      content: structureGuide.body,
      icon: PenLine,
      accentColor: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
    {
      key: "evaluation",
      title: "Evaluation",
      content: structureGuide.evaluation,
      icon: BarChart3,
      accentColor: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
    {
      key: "conclusion",
      title: "Conclusion",
      content: structureGuide.conclusion,
      icon: Check,
      accentColor: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
    {
      key: "formattingNotes",
      title: "Formatting Notes",
      content: structureGuide.formattingNotes,
      icon: Lightbulb,
      accentColor: "bg-pink-50 text-pink-600",
      borderColor: "border-pink-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
    {
      key: "paragraphFlow",
      title: "Paragraph Flow",
      content: structureGuide.paragraphFlow,
      icon: ArrowRight,
      accentColor: "bg-teal-50 text-teal-600",
      borderColor: "border-teal-100/60",
      bgColor: "bg-white",
      labelColor: "text-[#3D4F47]",
    },
  ].filter((s) => s.content) as GuideSection[];

  function handleCopy() {
    const text = [directAnswer, structureGuide.introduction, structureGuide.body]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Answer copied to clipboard");
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
    <motion.div
      initial="hidden"
      animate="show"
      className="space-y-5 pb-24"
    >

      {/* ── CARD 1: Direct Answer ─────────────────────────────────────── */}
      <motion.div variants={cardVariants} custom={0}>
        <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/50 bg-[#FDFCF9] shadow-sm">
          {/* Card header strip */}
          <div className="flex items-center gap-3 border-b border-[#D6D0C4]/30 bg-[#0F3226] px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDFCF9]/10">
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#FDFCF9]/50">
                Examiner's Model Answer
              </p>
              <p className="text-xs font-medium text-[#FDFCF9]/80">
                Board-aligned, structured response
              </p>
            </div>
          </div>

          {/* Answer content */}
          <div className="px-6 py-5">
            <div className="answer-prose">
              <Markdown content={directAnswer} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── CARD 2: Structure Guide ───────────────────────────────────── */}
      {guideSections.length > 0 && (
        <motion.div variants={cardVariants} custom={1}>
          <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/50 bg-[#FDFCF9] shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-[#D6D0C4]/30 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F3226]/5 ring-1 ring-[#0F3226]/10">
                <BookOpen className="h-4 w-4 text-[#0F3226]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0F3226]/40">
                  Structure Guide
                </p>
                <p className="text-xs text-[#6B7A72]">
                  How to structure your exam answer
                </p>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="space-y-2 p-4">
              {guideSections.map((section, i) => (
                <AccordionSection
                  key={section.key}
                  section={section}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── CARD 3: Visual Aids ───────────────────────────────────────── */}
      {hasVisuals && (
        <motion.div variants={cardVariants} custom={2}>
          <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/50 bg-[#FDFCF9] shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-[#D6D0C4]/30 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                <Eye className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600/60">
                  Visual Aids
                </p>
                <p className="text-xs text-[#6B7A72]">
                  Diagrams, graphs and equations
                </p>
              </div>
            </div>

            {/* Visuals grid */}
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {visuals
                .filter((v) => v.type !== "none")
                .map((v, i) => (
                  <VisualCard key={i} visual={v} index={i} />
                ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── CARD 4: Common Mistakes ───────────────────────────────────── */}
      {commonMistakes.length > 0 && (
        <motion.div variants={cardVariants} custom={3}>
          <div className="overflow-hidden rounded-2xl border border-red-200/60 bg-[#FDFCF9] shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-red-100/60 bg-red-50/40 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 ring-1 ring-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500/70">
                  Common Mistakes
                </p>
                <p className="text-xs text-[#6B7A72]">
                  Pitfalls that cost marks in exams
                </p>
              </div>
            </div>

            {/* Mistake list */}
            <div className="space-y-2.5 p-4">
              {commonMistakes.map((mistake, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-red-100/50 bg-red-50/30 px-4 py-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-600">
                    {i + 1}
                  </span>
                  <div className="text-sm leading-relaxed text-[#3D4F47]">
                    <Markdown content={mistake} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Fixed Action Bar ──────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#FDFCF9]/5 bg-[#0F3226]/95 px-5 py-3.5 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-1.5">
          <button
            onClick={() => setFolderModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-[#FDFCF9]/70 transition-all hover:bg-[#FDFCF9]/10 hover:text-[#FDFCF9] active:scale-[0.97]"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Save
          </button>

          <div className="h-4 w-px bg-[#FDFCF9]/10" />

          <button
            onClick={handleCreateFlashcard}
            disabled={flashcardSaving}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-[#FDFCF9]/70 transition-all hover:bg-[#FDFCF9]/10 hover:text-[#FDFCF9] active:scale-[0.97] disabled:opacity-40"
          >
            {flashcardSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Flashcard
          </button>

          <div className="h-4 w-px bg-[#FDFCF9]/10" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium text-[#FDFCF9]/70 transition-all hover:bg-[#FDFCF9]/10 hover:text-[#FDFCF9] active:scale-[0.97]"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>

      {/* Folder modal */}
      {sessionId && (
        <FolderSelectorModal
          open={folderModalOpen}
          onClose={() => setFolderModalOpen(false)}
          sessionId={sessionId}
        />
      )}
    </motion.div>
  );
}
