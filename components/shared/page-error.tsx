"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export function PageError({
  error,
  reset,
  message,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-error/5 ring-1 ring-error/10">
        <AlertTriangle className="h-5 w-5 text-error" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">
        {message ?? "Something went wrong"}
      </p>
      <p className="mt-1 text-xs text-text-muted">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  );
}
