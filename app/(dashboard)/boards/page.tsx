import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BoardView {
  id: string;
  code: string;
  name: string;
  description: string;
  academicLevels: { id: string; name: string; order: number }[];
  subjects: { id: string; name: string; code: string }[];
}

export default async function BoardsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const boards = await prisma.board.findMany({
    orderBy: { name: "asc" },
    include: {
      academicLevels: { orderBy: { order: "asc" } },
      subjects: {
        where: { isActive: true },
        orderBy: { name: "asc" },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Boards & Subjects
        </h1>
        <p className="mt-1 text-text-secondary">
          Explore all supported examination boards and their subjects.
        </p>
      </div>

      <div className="grid gap-6">
        {boards.map((board: BoardView) => (
          <Card key={board.id} className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{board.name}</CardTitle>
                  <CardDescription>{board.description}</CardDescription>
                </div>
                <Badge variant="accent" className="text-xs">
                  {board.code}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Academic Levels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {board.academicLevels.map((level) => (
                    <Badge key={level.id} variant="secondary">
                      {level.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-medium text-text-muted uppercase tracking-wider">
                  Subjects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {board.subjects.map((subject) => (
                    <Badge key={subject.id} variant="outline">
                      {subject.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
