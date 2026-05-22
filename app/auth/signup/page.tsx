"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { signUpSchema } from "@/lib/validators/auth";

export default function SignUpPage() {
  const router = useRouter();
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
    };

    const result = signUpSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      const issues = "issues" in result.error ? result.error.issues : (result.error as any).errors ?? [];
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
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        setErrors({ form: err.error ?? "Something went wrong" });
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Account created. Please sign in.");
        router.push("/auth/signin");
        return;
      }

      toast.success("Welcome to ExamScore!");
      router.push("/dashboard");
      router.refresh();
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
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-primary">ExamScore</span>
          </Link>
          <CardTitle className="text-2xl">Create your account</CardTitle>
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
            {errors.form && (
              <p className="text-sm text-error" role="alert">
                {errors.form}
              </p>
            )}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
