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
} from "lucide-react";
import { toast } from "sonner";
import type { Visual } from "@/lib/ai/types";
import { Markdown } from "./Markdown";

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

export function AnswerDisplay({
  directAnswer,
  structureGuide,
  commonMistakes,
  visuals,
  sessionId,
}: AnswerDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabId>("answer");

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "answer", label: "Direct Answer", icon: BookOpen },
    { id: "guide", label: "Structure Guide", icon: PenLine },
    { id: "mistakes", label: "Common Mistakes", icon: AlertTriangle },
  ];

  const hasVisuals = visuals.some((v) => v.type !== "none");

  function handleCopy() {
    const text = [directAnswer, structureGuide.introduction, structureGuide.body]
      .filter(Boolean)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Answer copied to clipboard");
  }

  function handleSaveToFolder() {
    toast.success("Saved to folder (stub)");
  }

  function handleCreateFlashcard() {
    toast.success("Flashcard created (stub)");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-lg bg-[#0F3226]/5 p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#FDFCF9] text-[#0F3226] shadow-sm"
                  : "text-[#6B7A72] hover:text-[#0F3226]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "answer" && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-xl border-l-4 border-[#0F3226] bg-[#FDFCF9] p-6 shadow-sm">
              <h3 className="mb-4 font-serif text-lg font-semibold text-[#0A1A14]">
                This is what examiners want to see
              </h3>
              <div className="prose prose-sm max-w-none font-serif text-[#3D4F47]">
                <Markdown content={directAnswer} />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "guide" && (
          <motion.div
            key="guide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {[
              { title: "Introduction", content: structureGuide.introduction },
              { title: "Body", content: structureGuide.body },
              { title: "Evaluation", content: structureGuide.evaluation },
              { title: "Conclusion", content: structureGuide.conclusion },
              {
                title: "Formatting Notes",
                content: structureGuide.formattingNotes,
              },
              {
                title: "Paragraph Flow",
                content: structureGuide.paragraphFlow,
              },
            ]
              .filter((s) => s.content)
              .map((section) => (
                <div
                  key={section.title}
                  className="rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] p-5 shadow-sm"
                >
                  <h4 className="mb-2 font-serif text-sm font-semibold text-[#0F3226]">
                    {section.title}
                  </h4>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#3D4F47]">
                    <Markdown content={section.content ?? ""} />
                  </p>
                </div>
              ))}
          </motion.div>
        )}

        {activeTab === "mistakes" && (
          <motion.div
            key="mistakes"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-xl border border-red-200 bg-[#FDFCF9] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <h3 className="font-serif text-lg font-semibold text-[#0A1A14]">
                  Avoid These
                </h3>
              </div>
              <ul className="space-y-2.5">
                {commonMistakes.map((mistake, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[#3D4F47]"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-[10px] font-bold text-red-500">
                      !
                    </span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasVisuals && (
        <div className="space-y-2">
          {visuals
            .filter((v) => v.type !== "none")
            .map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] p-5 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0F3226]/5">
                    {v.type === "graph" ? (
                      <BarChart3 className="h-3.5 w-3.5 text-[#0F3226]" />
                    ) : v.type === "diagram" ? (
                      <PenLine className="h-3.5 w-3.5 text-[#0F3226]" />
                    ) : (
                      <Lightbulb className="h-3.5 w-3.5 text-[#0F3226]" />
                    )}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">
                    {v.type}
                  </span>
                </div>
                <p className="mb-2 text-sm text-[#3D4F47]">{v.description}</p>
                <p className="text-xs italic text-[#6B7A72]">Hint: {v.hint}</p>
              </div>
            ))}
        </div>
      )}

      <div className="sticky bottom-0 -mx-1 rounded-t-xl border border-[#D6D0C4]/30 bg-[#FDFCF9]/95 px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleSaveToFolder}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#6B7A72] transition-all hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Save
          </button>
          <div className="h-4 w-px bg-[#D6D0C4]/40" />
          <button
            onClick={handleCreateFlashcard}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#6B7A72] transition-all hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
          >
            <Check className="h-3.5 w-3.5" />
            Flashcard
          </button>
          <div className="h-4 w-px bg-[#D6D0C4]/40" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#6B7A72] transition-all hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
