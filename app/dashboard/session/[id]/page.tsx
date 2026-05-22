import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const { id } = await params;

  const questionSession = await prisma.questionSession.findUnique({
    where: { id },
    include: {
      board: true,
      level: true,
      subject: true,
      aiResponse: true,
    },
  });

  if (!questionSession || questionSession.userId !== session.user.id) {
    notFound();
  }

  const aiResponse = questionSession.aiResponse
    ? (questionSession.aiResponse as unknown as {
        directAnswer: string;
        structureGuide: {
          introduction: string;
          body: string;
          evaluation?: string;
          conclusion?: string;
          formattingNotes: string;
          paragraphFlow: string;
        };
        commonMistakes: string[];
        visuals: string[];
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{questionSession.board.name}</Badge>
          <Badge variant="secondary">{questionSession.level.name}</Badge>
          <Badge variant="outline">{questionSession.subject.name}</Badge>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Session Details
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          {formatDate(questionSession.createdAt)}
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">
            {questionSession.questionText}
          </p>
        </CardContent>
      </Card>

      {aiResponse && (
        <>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Direct Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {aiResponse.directAnswer}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Structure Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiResponse.structureGuide.introduction && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Introduction
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.introduction}
                  </p>
                </div>
              )}
              {aiResponse.structureGuide.body && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Body
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.body}
                  </p>
                </div>
              )}
              {aiResponse.structureGuide.evaluation && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Evaluation
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.evaluation}
                  </p>
                </div>
              )}
              {aiResponse.structureGuide.conclusion && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Conclusion
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.conclusion}
                  </p>
                </div>
              )}
              <Separator />
              {aiResponse.structureGuide.formattingNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Formatting Notes
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.formattingNotes}
                  </p>
                </div>
              )}
              {aiResponse.structureGuide.paragraphFlow && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Paragraph Flow
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {aiResponse.structureGuide.paragraphFlow}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {aiResponse.commonMistakes.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {aiResponse.commonMistakes.map((mistake, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error/10 text-[10px] text-error shrink-0">
                        !
                      </span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
