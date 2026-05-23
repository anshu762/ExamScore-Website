import { NextResponse } from "next/server";
import { auth } from "./auth";
import { prisma } from "./prisma";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Unauthorized");
  }
  return session;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export function apiError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export function sanitizeInput(input: string, maxLength = 2000): string {
  return input
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLength);
}

const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 20;

export async function checkRateLimit(userId: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW);
  const count = await prisma.questionSession.count({
    where: {
      userId,
      createdAt: { gte: windowStart },
    },
  });
  return count < RATE_LIMIT_MAX;
}
