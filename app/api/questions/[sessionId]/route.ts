import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await params;

    const qs = await prisma.questionSession.findUnique({
      where: { id: sessionId },
      include: {
        aiResponse: true,
        board: { select: { name: true, code: true } },
        subject: { select: { name: true } },
        level: { select: { name: true } },
      },
    });

    if (!qs || qs.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(qs);
  } catch (error) {
    console.error("Question session fetch error:", error);
    return NextResponse.json({ error: "Failed to load question" }, { status: 500 });
  }
}
