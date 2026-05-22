import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OnboardingQuizPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="font-serif text-3xl font-semibold text-[#0F3226]">
        Let&apos;s Get to Know You
      </h1>
      <p className="mt-2 text-text-secondary">
        A quick quiz to personalize your learning experience.
      </p>
    </div>
  );
}
