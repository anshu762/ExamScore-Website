"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { questions } from "@/lib/quiz/questions";

export default function OnboardingQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = questions.length;
  const current = questions[step];
  const isLast = step === total - 1;
  const progress = ((step + 1) / total) * 100;

  const handleSelect = useCallback((value: string) => {
    setSelected(value);
  }, []);

  const handleNext = useCallback(() => {
    if (!selected) return;
    setAnswers((prev) => ({ ...prev, [current.id]: selected }));
    setSelected(null);
    if (isLast) {
      handleSubmit({ ...answers, [current.id]: selected });
    } else {
      setStep((s) => s + 1);
    }
  }, [selected, current.id, isLast, answers]);

  async function handleSubmit(final: Record<number, string>) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding-quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: final }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit");
      }
      router.push("/onboarding/result");
    } catch (err: any) {
      alert(err.message ?? "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F3226] px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Question counter + progress bar */}
        <div className="mb-8 text-center">
          <p className="font-serif text-sm font-medium tracking-wider text-[#FDFCF9]/60">
            Question {step + 1} of {total}
          </p>
          <div className="mx-auto mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#FDFCF9]/10">
            <div
              className="h-full rounded-full bg-[#C9A84C] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="rounded-2xl bg-[#FDFCF9] px-8 py-10 shadow-xl">
              <h2 className="font-serif text-xl font-semibold leading-snug text-[#0A1A14]">
                {current.text}
              </h2>

              <div className="mt-7 space-y-2.5">
                {current.options.map((opt) => {
                  const isSelected = selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full rounded-xl border px-5 py-3.5 text-left text-sm transition-all duration-150 ${
                        isSelected
                          ? "border-[#0F3226] bg-[#0F3226] text-[#FDFCF9] shadow-md"
                          : "border-[#D6D0C4]/50 bg-[#FDFCF9] text-[#3D4F47] hover:border-[#0F3226]/30 hover:bg-[#0F3226]/5"
                      }`}
                      disabled={submitting}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!selected || submitting}
                  className="rounded-xl bg-[#0F3226] px-8 py-3 text-sm font-semibold text-[#FDFCF9] transition-all hover:bg-[#1A4A36] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isLast ? (
                    "Submit"
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
