import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ boardCode: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { boardCode } = await params;

    const board = await prisma.board.findUnique({
      where: { code: boardCode.toUpperCase() as any },
      select: { id: true },
    });

    if (!board) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    const levels = await prisma.academicLevel.findMany({
      where: { boardId: board.id },
      orderBy: { order: "asc" },
      select: { id: true, name: true, order: true },
    });

    return NextResponse.json(levels);
  } catch (error) {
    console.error("Failed to fetch levels:", error);
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 }
    );
  }
}
