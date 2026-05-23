import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AnswerDisplay } from "@/components/shared/AnswerDisplay";
import type { Visual } from "@/lib/ai/types";
import { BookOpen, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const questionSession = await prisma.questionSession.findUnique({
    where: { id },
    include: {
      board: true,
      level: true,
      subject: true,
      aiResponse: true,
    },
  });

  if (!questionSession || questionSession.userId !== session.user.id) {
    notFound();
  }

  // Safely parse the stored JSON fields from Prisma
  const raw = questionSession.aiResponse as unknown as {
    directAnswer: string;
    structureGuide: {
      introduction: string;
      body: string;
      evaluation?: string | null;
      conclusion: string;
      formattingNotes: string;
      paragraphFlow: string;
    };
    commonMistakes: string[] | unknown;
    visuals: Visual[] | unknown;
  } | null;

  const aiResponse = raw
    ? {
        directAnswer: raw.directAnswer ?? "",
        structureGuide: {
          introduction: raw.structureGuide?.introduction ?? "",
          body: raw.structureGuide?.body ?? "",
          evaluation: raw.structureGuide?.evaluation ?? null,
          conclusion: raw.structureGuide?.conclusion ?? "",
          formattingNotes: raw.structureGuide?.formattingNotes ?? "",
          paragraphFlow: raw.structureGuide?.paragraphFlow ?? "",
        },
        commonMistakes: Array.isArray(raw.commonMistakes)
          ? (raw.commonMistakes as string[])
          : [],
        visuals: Array.isArray(raw.visuals) ? (raw.visuals as Visual[]) : [],
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* ── Back link ───────────────────────────────────────────────── */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7A72] transition-colors hover:text-[#0F3226]"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </Link>

      {/* ── Session header ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#D6D0C4]/50 bg-[#FDFCF9] shadow-sm">
        {/* Top strip */}
        <div className="flex items-center gap-3 border-b border-[#D6D0C4]/30 px-6 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0F3226]/5 ring-1 ring-[#0F3226]/10">
            <BookOpen className="h-4 w-4 text-[#0F3226]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0F3226]/40">
              Study Session
            </p>
            <p className="flex items-center gap-1.5 text-xs text-[#6B7A72]">
              <Calendar className="h-3 w-3" />
              {formatDate(questionSession.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              {questionSession.board.name}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {questionSession.level.name}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-[#6B7A72]">
              {questionSession.subject.name}
            </Badge>
          </div>
        </div>

        {/* Question text */}
        <div className="px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0F3226]/40 mb-2">
            Your Question
          </p>
          <p className="font-serif text-base leading-relaxed text-[#0A1A14]">
            {questionSession.questionText}
          </p>
        </div>
      </div>

      {/* ── AI Answer — reuse the same premium AnswerDisplay ─────────── */}
      {aiResponse ? (
        <AnswerDisplay
          directAnswer={aiResponse.directAnswer}
          structureGuide={aiResponse.structureGuide}
          commonMistakes={aiResponse.commonMistakes}
          visuals={aiResponse.visuals}
          sessionId={questionSession.id}
        />
      ) : (
        <div className="rounded-2xl border border-[#D6D0C4]/50 bg-[#FDFCF9] px-6 py-10 text-center shadow-sm">
          <p className="text-sm font-medium text-[#0A1A14]">No answer recorded</p>
          <p className="mt-1 text-xs text-[#6B7A72]">
            This session does not have an AI response stored.
          </p>
        </div>
      )}
    </div>
  );
}
