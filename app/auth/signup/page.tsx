"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Sparkles, BookOpen } from "lucide-react";
import { signUpSchema } from "@/lib/validators/auth";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden bg-[#0F3226] p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[700px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(ellipse, rgba(253,252,249,0.07) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FDFCF9' fill-opacity='0.025'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-lg object-cover shadow-sm ring-1 ring-[#FDFCF9]/10" />
            <span className="font-serif text-base font-semibold tracking-tight text-[#FDFCF9]">ExamScore</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/[0.08] px-3.5 py-1 text-xs font-medium tracking-wide text-[#C9A84C]">
            <Sparkles className="h-3 w-3" />
            AI-Powered Exam Prep
          </div>
          <blockquote className="space-y-2">
            <p className="font-serif text-lg leading-relaxed text-[#FDFCF9]/80">
              &ldquo;The structured answers and progress tracking helped me improve my grades significantly. Game changer!&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A84C]/20 text-xs font-semibold text-[#C9A84C]">R</div>
              <div>
                <p className="text-sm font-medium text-[#FDFCF9]/90">Rahul M.</p>
                <p className="text-xs text-[#FDFCF9]/40">IB DP · 42/45 Predicted</p>
              </div>
            </div>
          </blockquote>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-xs text-[#FDFCF9]/30">
          <BookOpen className="h-3.5 w-3.5" />
          <span>IB · AP · Cambridge · CBSE · ICSE</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[#F5F2EA] px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 text-center lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo.jpg" alt="" className="h-7 w-7 rounded-lg object-cover" />
              <span className="font-serif text-base font-semibold tracking-tight text-[#0A1A14]">ExamScore</span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[#0A1A14]">Create your account</h1>
            <p className="mt-1.5 text-sm text-[#6B7A72]">Start your exam preparation journey.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#0F3226]/60">Full Name</label>
              <div className="group relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A72]/40 transition-colors group-focus-within:text-[#0F3226]" />
                <input name="name" placeholder="John Smith" required className="w-full rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] py-2.5 pl-10 pr-4 text-sm text-[#0A1A14] outline-none transition-all placeholder:text-[#6B7A72]/40 focus:border-[#0F3226] focus:ring-2 focus:ring-[#0F3226]/10" />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#0F3226]/60">Email</label>
              <div className="group relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A72]/40 transition-colors group-focus-within:text-[#0F3226]" />
                <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" className="w-full rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] py-2.5 pl-10 pr-4 text-sm text-[#0A1A14] outline-none transition-all placeholder:text-[#6B7A72]/40 focus:border-[#0F3226] focus:ring-2 focus:ring-[#0F3226]/10" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#0F3226]/60">Password</label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A72]/40 transition-colors group-focus-within:text-[#0F3226]" />
                <input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" required autoComplete="new-password" className="w-full rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] py-2.5 pl-10 pr-10 text-sm text-[#0A1A14] outline-none transition-all placeholder:text-[#6B7A72]/40 focus:border-[#0F3226] focus:ring-2 focus:ring-[#0F3226]/10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A72]/40 transition-colors hover:text-[#0F3226]/60" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#0F3226]/60">Confirm Password</label>
              <div className="group relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7A72]/40 transition-colors group-focus-within:text-[#0F3226]" />
                <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Re-enter your password" required autoComplete="new-password" className="w-full rounded-xl border border-[#D6D0C4]/50 bg-[#FDFCF9] py-2.5 pl-10 pr-10 text-sm text-[#0A1A14] outline-none transition-all placeholder:text-[#6B7A72]/40 focus:border-[#0F3226] focus:ring-2 focus:ring-[#0F3226]/10" />
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7A72]/40 transition-colors hover:text-[#0F3226]/60" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>
            {errors.form && (
              <div className="flex items-start gap-2.5 rounded-lg border border-red-200/60 bg-red-50/50 px-4 py-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">!</span>
                <p className="text-sm text-red-600">{errors.form}</p>
              </div>
            )}
            <button type="submit" disabled={loading} className="group relative w-full overflow-hidden rounded-xl bg-[#0F3226] py-2.5 text-sm font-semibold text-[#FDFCF9] shadow-sm transition-all hover:bg-[#1A4A36] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FDFCF9]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#FDFCF9]/60" style={{ animationDelay: "300ms" }} />
                    </span>
                    Creating account...
                  </span>
                ) : (
                  <>Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>
                )}
              </span>
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6B7A72]">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-[#0F3226] underline underline-offset-2 transition-colors hover:text-[#1A4A36]">Log in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
