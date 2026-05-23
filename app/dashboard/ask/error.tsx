"use client";

import { PageError } from "@/components/shared/page-error";

export default function DashboardAskError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PageError error={error} reset={reset} message="Failed to load question page" />;
}
