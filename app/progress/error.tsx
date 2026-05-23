"use client";

import { PageError } from "@/components/shared/page-error";

export default function ProgressError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} message="Failed to load progress data" />;
}
