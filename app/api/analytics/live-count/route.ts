import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let record = await prisma.liveUserCount.findUnique({
      where: { id: "default" },
    });

    if (!record) {
      record = await prisma.liveUserCount.create({
        data: { id: "default", count: 0 },
      });
    }

    const count = Math.max(record.count, 0);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Live count error:", error);
    return NextResponse.json({ count: 0 });
  }
}
