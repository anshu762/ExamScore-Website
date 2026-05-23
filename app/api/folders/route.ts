import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";

const createFolderSchema = z.object({
  name: z.string().min(1).max(60),
  color: z.string().default("#0F3226"),
  icon: z.string().default("folder"),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return NextResponse.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = createFolderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        userId: session.user.id,
        name: parsed.data.name,
        color: parsed.data.color,
        icon: parsed.data.icon,
      },
      include: { _count: { select: { items: true } } },
    });

    await trackEvent(session.user.id, "folder_created", { folderId: folder.id });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error("Failed to create folder:", error);
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
