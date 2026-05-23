import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const boardCode = searchParams.get("boardCode");
    const subjectId = searchParams.get("subjectId");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const cursor = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

    const where: any = { userId: session.user.id };
    if (boardCode) where.board = { code: boardCode };
    if (subjectId) where.subjectId = subjectId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const sessions = await prisma.questionSession.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        board: { select: { name: true, code: true } },
        subject: { select: { name: true } },
        level: { select: { name: true } },
      },
    });

    const hasMore = sessions.length > limit;
    if (hasMore) sessions.pop();

    return NextResponse.json({
      sessions,
      nextCursor: hasMore ? sessions[sessions.length - 1].id : null,
    });
  } catch (error) {
    console.error("Questions list error:", error);
    return NextResponse.json({ error: "Failed to load questions" }, { status: 500 });
  }
}
