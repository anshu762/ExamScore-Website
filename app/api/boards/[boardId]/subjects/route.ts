import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const url = new URL(request.url);
    const levelId = url.searchParams.get("levelId");

    const where: Record<string, unknown> = { boardId, isActive: true };
    if (levelId) {
      where.levelId = levelId;
    }

    const subjects = await prisma.subject.findMany({
      where,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
