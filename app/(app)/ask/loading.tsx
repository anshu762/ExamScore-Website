import { AskLoadingSkeleton } from "@/components/shared/page-skeleton";

export default function AskLoading() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="h-5 w-16 rounded bg-border/60 animate-pulse mb-1" />
      <div className="h-8 w-48 rounded bg-border/60 animate-pulse mb-8" />
      <AskLoadingSkeleton />
    </div>
  );
}
