import { PageSkeleton } from "@/components/shared/page-skeleton";

export default function HistoryLoading() {
  return (
    <div className="py-8">
      <PageSkeleton rows={5} />
    </div>
  );
}
