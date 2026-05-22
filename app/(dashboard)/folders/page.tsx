import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FoldersList } from "@/components/dashboard/folders-list";

export default async function FoldersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const folders = await prisma.folder.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: { select: { items: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Folders
        </h1>
        <p className="mt-1 text-text-secondary">
          Organize your study materials into collections.
        </p>
      </div>

      <FoldersList folders={folders} />
    </div>
  );
}
