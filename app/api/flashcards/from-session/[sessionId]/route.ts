import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    const qs = await prisma.questionSession.findUnique({
      where: { id: sessionId },
      include: { aiResponse: true },
    });

    if (!qs || qs.userId !== session.user.id) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (!qs.aiResponse) {
      return NextResponse.json({ error: "No AI response for this session" }, { status: 400 });
    }

    const backText = qs.aiResponse.directAnswer.length > 500
      ? qs.aiResponse.directAnswer.slice(0, 500) + "..."
      : qs.aiResponse.directAnswer;

    const existing = await prisma.flashcard.findFirst({
      where: {
        userId: session.user.id,
        front: qs.questionText,
        source: "AI_GENERATED",
      },
    });
    if (existing) {
      return NextResponse.json(existing);
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        userId: session.user.id,
        front: qs.questionText,
        back: backText,
        boardId: qs.boardId,
        subjectId: qs.subjectId,
        source: "AI_GENERATED",
      },
    });

    await trackEvent(session.user.id, "flashcard_created", { source: "AI_GENERATED" });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error("Failed to create flashcard from session:", error);
    return NextResponse.json({ error: "Failed to create flashcard" }, { status: 500 });
  }
}
