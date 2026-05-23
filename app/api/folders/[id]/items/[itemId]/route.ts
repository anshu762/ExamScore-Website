import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, itemId } = await params;

    const folder = await prisma.folder.findUnique({ where: { id } });
    if (!folder || folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const item = await prisma.folderItem.findUnique({ where: { id: itemId } });
    if (!item || item.folderId !== id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await prisma.folderItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to remove folder item:", error);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
