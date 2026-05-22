import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;

    const levels = await prisma.academicLevel.findMany({
      where: { boardId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        order: true,
      },
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
