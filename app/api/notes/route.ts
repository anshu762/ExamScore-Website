import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  linkedSessionId: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        linkedSessionId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        title: parsed.data.title,
        content: parsed.data.content,
        linkedSessionId: parsed.data.linkedSessionId ?? null,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
