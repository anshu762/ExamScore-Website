import { PageSkeleton } from "@/components/shared/page-skeleton";

export default function FolderDetailLoading() {
  return (
    <div className="py-8">
      <PageSkeleton rows={3} />
    </div>
  );
}
