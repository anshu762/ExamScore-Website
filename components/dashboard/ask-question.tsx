"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { BoardSelector } from "@/components/dashboard/board-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface AIResponseData {
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
}

export function AskQuestion() {
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIResponseData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSelect = useCallback(
    (boardId: string, levelId: string, subjectId: string) => {
      setSelectedBoard(boardId);
      setSelectedLevel(levelId);
      setSelectedSubject(subjectId);
      setResponse(null);
      setError("");
    },
    []
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !selectedBoard || !selectedLevel || !selectedSubject) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText: question,
          boardId: selectedBoard,
          levelId: selectedLevel,
          subjectId: selectedSubject,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to get answer");
      }

      const data = await res.json();
      setResponse(data.aiResponse);
      setSessionId(data.sessionId);
      toast.success("Answer generated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <BoardSelector onSelect={handleSelect} />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your exam question here..."
                rows={4}
                className="flex w-full rounded-lg border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:opacity-50 resize-none"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full gap-2"
              disabled={loading || !question.trim()}
            >
              {loading ? (
                "Generating answer..."
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get Answer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading && (
        <Card className="border-border">
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-border border-error/30">
          <CardContent className="flex items-start gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-error">Error</p>
              <p className="text-sm text-text-secondary">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {response && (
        <div className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <CardTitle className="text-lg">Direct Answer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {response.directAnswer}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Structure Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {response.structureGuide.introduction && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Introduction
                  </h4>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {response.structureGuide.introduction}
                  </p>
                </div>
              )}
              {response.structureGuide.body && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Body
                  </h4>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {response.structureGuide.body}
                  </p>
                </div>
              )}
              {response.structureGuide.evaluation && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Evaluation
                  </h4>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {response.structureGuide.evaluation}
                  </p>
                </div>
              )}
              {response.structureGuide.conclusion && (
                <div>
                  <h4 className="text-sm font-semibold text-accent mb-1">
                    Conclusion
                  </h4>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">
                    {response.structureGuide.conclusion}
                  </p>
                </div>
              )}
              <Separator />
              {response.structureGuide.formattingNotes && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Formatting Notes
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {response.structureGuide.formattingNotes}
                  </p>
                </div>
              )}
              {response.structureGuide.paragraphFlow && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Paragraph Flow
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {response.structureGuide.paragraphFlow}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {response.commonMistakes.length > 0 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-lg">
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {response.commonMistakes.map((mistake, i) => (
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

          {sessionId && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/dashboard/session/${sessionId}`
                  );
                  toast.success("Link copied to clipboard");
                }}
              >
                Copy session link
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
