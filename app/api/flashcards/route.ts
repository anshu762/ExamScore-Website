import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";

const createFlashcardSchema = z.object({
  front: z.string().min(1).max(1000),
  back: z.string().min(1).max(10000),
  boardId: z.string().min(1),
  subjectId: z.string().min(1),
  source: z.enum(["AI_GENERATED", "MANUAL"]).default("MANUAL"),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flashcards = await prisma.flashcard.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        board: { select: { name: true, code: true } },
        subject: { select: { name: true } },
      },
    });

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Failed to fetch flashcards:", error);
    return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createFlashcardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const flashcard = await prisma.flashcard.create({
      data: {
        userId: session.user.id,
        front: parsed.data.front,
        back: parsed.data.back,
        boardId: parsed.data.boardId,
        subjectId: parsed.data.subjectId,
        source: parsed.data.source,
      },
    });

    await trackEvent(session.user.id, "flashcard_created", { source: parsed.data.source });

    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error("Failed to create flashcard:", error);
    return NextResponse.json({ error: "Failed to create flashcard" }, { status: 500 });
  }
}
