import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const record = await prisma.liveUserCount.findUnique({
      where: { id: "1" },
    });

    const count = record?.count ?? 127493;

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 127493 });
  }
}
