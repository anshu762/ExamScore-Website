import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashUserPassword } from "@/lib/auth/password";
import { signUpApiSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpApiSchema.safeParse(body);

    if (!parsed.success) {
      const issues =
        "issues" in parsed.error
          ? parsed.error.issues
          : (parsed.error as any).errors ?? [];
      return NextResponse.json(
        { error: issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashUserPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await prisma.gamificationMetric.create({
      data: { userId: user.id },
    });

    await prisma.onboardingQuiz.create({
      data: { userId: user.id },
    });

    // Fire-and-forget: increment live counter — do NOT block response
    prisma.liveUserCount
      .upsert({
        where: { id: "1" },
        update: { count: { increment: 1 } },
        create: { id: "1", count: 1 },
      })
      .catch(() => {});

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
