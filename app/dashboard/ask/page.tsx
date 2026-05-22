import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AskQuestion } from "@/components/dashboard/ask-question";

export default async function AskPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const boards = await prisma.board.findMany({
    orderBy: { name: "asc" },
    select: { id: true, code: true, name: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Ask a Question
        </h1>
        <p className="mt-1 text-text-secondary">
          Get a structured, board-specific answer from our AI.
        </p>
      </div>

      <AskQuestion boards={boards} />
    </div>
  );
}
