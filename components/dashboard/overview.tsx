"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, FolderKanban, Target, Brain, ArrowRight } from "lucide-react";

interface OverviewProps {
  userName: string;
  recentSessions: Array<{
    id: string;
    questionText: string;
    createdAt: Date;
    subject: { name: string };
    board: { name: string };
    aiResponse?: { directAnswer: string } | null;
  }>;
  metrics: {
    accuracyScore: number;
    consistencyScore: number;
    streakDays: number;
  };
  folders: Array<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>;
}

export function DashboardOverview({
  userName,
  recentSessions,
  metrics,
  folders,
}: OverviewProps) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-serif text-2xl font-semibold text-primary">
          Welcome back, {userName}
        </h1>
        <p className="mt-1 text-text-secondary">Continue your preparation</p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Accuracy
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-primary">
                    {metrics.accuracyScore}%
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                  <Target className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Consistency
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-primary">
                    {metrics.consistencyScore}%
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    Day Streak
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-primary">
                    {metrics.streakDays}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Sparkles className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-text-muted">
                    No study sessions yet
                  </p>
                  <Link href="/dashboard/ask">
                    <Button variant="primary" size="sm" className="mt-4 gap-2">
                      <Sparkles className="h-4 w-4" />
                      Ask your first question
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/dashboard/session/${session.id}`}
                      className="block rounded-lg border border-border p-3 transition-colors hover:bg-bg-muted"
                    >
                      <p className="line-clamp-1 text-sm font-medium text-foreground">
                        {session.questionText}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {session.board.name}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {session.subject.name}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/dashboard/ask">
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Ask a Question
                    </p>
                    <p className="text-xs text-text-muted">
                      Get AI-powered answers
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </div>
              </Link>
              <Link href="/dashboard/flashcards">
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Review Flashcards
                    </p>
                    <p className="text-xs text-text-muted">
                      Reinforce key concepts
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </div>
              </Link>
              <Link href="/dashboard/folders">
                <div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      Browse Folders
                    </p>
                    <p className="text-xs text-text-muted">
                      Organize your study materials
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-text-muted" />
                </div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {folders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Recent Folders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {folders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folders/${folder.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-bg-muted"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${folder.color}15` }}
                    >
                      <FolderKanban
                        className="h-4 w-4"
                        style={{ color: folder.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {folder.name}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
