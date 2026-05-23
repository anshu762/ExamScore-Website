import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AnswerDisplay } from "@/components/shared/AnswerDisplay";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function HistorySessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const { sessionId } = await params;

  const qs = await prisma.questionSession.findUnique({
    where: { id: sessionId },
    include: {
      aiResponse: true,
      board: { select: { name: true, code: true } },
      subject: { select: { name: true } },
      level: { select: { name: true } },
    },
  });

  if (!qs || qs.userId !== session.user.id) {
    redirect("/history");
  }

  return (
    <div className="space-y-6">
      <Link
        href="/history"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to History
      </Link>

      <div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            {qs.board.name}
          </span>
          <span>{qs.subject.name}</span>
          <span>· {qs.level.name}</span>
          <span>· {new Date(qs.createdAt).toLocaleDateString()}</span>
        </div>
        <h1 className="mt-2 font-serif text-xl font-semibold leading-snug text-foreground">
          {qs.questionText}
        </h1>
      </div>

      <hr className="border-border/40" />

      {qs.aiResponse ? (
        <AnswerDisplay
          directAnswer={qs.aiResponse.directAnswer}
          structureGuide={qs.aiResponse.structureGuide as any}
          commonMistakes={qs.aiResponse.commonMistakes as any}
          visuals={qs.aiResponse.visuals as any}
          sessionId={qs.id}
        />
      ) : (
        <p className="py-8 text-center text-sm text-text-secondary">
          No AI response available for this session.
        </p>
      )}
    </div>
  );
}
