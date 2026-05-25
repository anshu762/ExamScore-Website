import { PageSkeleton } from "@/components/shared/page-skeleton";

export default function FlashcardsLoading() {
  return (
    <div className="py-8">
      <PageSkeleton rows={4} />
    </div>
  );
}
