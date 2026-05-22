import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { FlashcardsList } from "@/components/dashboard/flashcards-list";

export default async function FlashcardsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const flashcards = await prisma.flashcard.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      subject: true,
      board: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Flashcards
        </h1>
        <p className="mt-1 text-text-secondary">
          Review and manage your flashcards.
        </p>
      </div>

      <FlashcardsList flashcards={flashcards} />
    </div>
  );
}
