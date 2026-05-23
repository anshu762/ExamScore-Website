import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const addItemSchema = z.object({
  type: z.enum(["QUESTION", "FLASHCARD", "NOTE"]),
  referenceId: z.string().min(1),
});

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const items = await prisma.folderItem.findMany({
      where: { folderId: id },
      orderBy: { id: "desc" },
    });

    const populated = await Promise.all(
      items.map(async (item) => {
        let data: Record<string, unknown> | null = null;
        if (item.type === "QUESTION") {
          const qs = await prisma.questionSession.findUnique({
            where: { id: item.referenceId },
            select: {
              id: true,
              questionText: true,
              createdAt: true,
              subject: { select: { name: true } },
              board: { select: { name: true } },
              level: { select: { name: true } },
              aiResponse: {
                select: {
                  id: true,
                  directAnswer: true,
                  structureGuide: true,
                  commonMistakes: true,
                  visuals: true,
                  createdAt: true,
                },
              },
            },
          });
          data = qs;
        } else if (item.type === "NOTE") {
          const note = await prisma.note.findUnique({
            where: { id: item.referenceId },
            select: { id: true, title: true, content: true, createdAt: true },
          });
          data = note;
        } else if (item.type === "FLASHCARD") {
          const fc = await prisma.flashcard.findUnique({
            where: { id: item.referenceId },
            select: { id: true, front: true, back: true, createdAt: true },
          });
          data = fc;
        }
        return { ...item, details: data };
      })
    );

    return NextResponse.json(populated);
  } catch (error) {
    console.error("Failed to fetch folder items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = addItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const existing = await prisma.folderItem.findUnique({
      where: { folderId_type_referenceId: { folderId: id, type: parsed.data.type, referenceId: parsed.data.referenceId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Item already exists in folder" }, { status: 409 });
    }

    const item = await prisma.folderItem.create({
      data: {
        folderId: id,
        type: parsed.data.type,
        referenceId: parsed.data.referenceId,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to add item to folder:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
