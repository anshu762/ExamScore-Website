import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashUserPassword } from "@/lib/auth/password";
import { signUpSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      const issues = "issues" in parsed.error ? parsed.error.issues : (parsed.error as any).errors ?? [];
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

    const passwordHash = hashUserPassword(password);

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

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
