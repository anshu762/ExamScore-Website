"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto mb-4 flex items-center justify-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">ExamScore</span>
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to continue your studies</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
