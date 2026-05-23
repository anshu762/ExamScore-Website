import { MetricSkeleton, PageSkeleton } from "@/components/shared/page-skeleton";

export default function ProgressLoading() {
  return (
    <div className="space-y-8 py-8">
      <MetricSkeleton />
      <PageSkeleton rows={2} />
    </div>
  );
}
