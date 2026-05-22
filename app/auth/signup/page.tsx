"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { signUpSchema } from "@/lib/validators/auth";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    };

    const result = signUpSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues =
        "issues" in result.error
          ? result.error.issues
          : (result.error as any).errors ?? [];
      for (const err of issues) {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      if (!response.ok) {
        const err = await response.json();
        setErrors({ form: err.error ?? "Something went wrong" });
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/onboarding/quiz",
      });
    } catch {
      setErrors({ form: "An unexpected error occurred" });
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
          <CardTitle className="font-serif text-2xl text-foreground">Create your account</CardTitle>
          <CardDescription>Start your exam preparation journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Smith"
              required
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              required
              autoComplete="new-password"
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
              error={errors.confirmPassword}
            />
            {errors.form && (
              <p className="text-sm text-destructive" role="alert">
                {errors.form}
              </p>
            )}
            <Button type="submit" className="w-full bg-[#0F3226] text-[#FDFCF9] hover:bg-[#1A4A36]" disabled={loading}>
              {loading ? "Creating account..." : "Get Started"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-[#0F3226] hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
