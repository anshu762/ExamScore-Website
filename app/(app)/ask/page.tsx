"use client";

import { AskQuestion } from "@/components/dashboard/ask-question";

export default function AskPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-[#0A1A14]">Ask a Question</h1>
        <p className="mt-1 text-sm text-[#3D4F47]">
          Get an AI-powered, board-specific answer aligned with your curriculum.
        </p>
      </div>
      <AskQuestion />
    </div>
  );
}
