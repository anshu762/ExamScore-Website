"use client";

import { PageError } from "@/components/shared/page-error";

export default function HistoryError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} message="Failed to load history" />;
}
