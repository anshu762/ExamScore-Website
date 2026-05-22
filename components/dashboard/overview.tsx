"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, FolderKanban, Target, Brain, ArrowRight, Clock, Zap } from "lucide-react";

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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function DashboardOverview({
  userName,
  recentSessions,
  metrics,
  folders,
}: OverviewProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-muted">
          Dashboard
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold tracking-tight text-foreground">
          Welcome back, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{userName}</span>
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Here is your study snapshot for today.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
                  Accuracy
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold text-foreground">{metrics.accuracyScore}</span>
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 ring-1 ring-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700"
                style={{ width: `${metrics.accuracyScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
                  Consistency
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold text-foreground">{metrics.consistencyScore}</span>
                  <span className="text-sm text-text-muted">%</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/5 ring-1 ring-accent/10">
                <Zap className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-all duration-700"
                style={{ width: `${metrics.consistencyScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-text-muted">
                  Day Streak
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold text-foreground">{metrics.streakDays}</span>
                  <span className="text-sm text-text-muted">days</span>
                </div>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/5 ring-1 ring-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              {metrics.streakDays > 0 ? "Active" : "Start today"}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-7">
        <motion.div variants={item} className="lg:col-span-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium text-foreground">Recent Sessions</CardTitle>
              {recentSessions.length > 0 && (
                <Link
                  href="/dashboard/ask"
                  className="text-xs font-medium text-text-muted transition-colors hover:text-primary"
                >
                  View all
                </Link>
              )}
            </CardHeader>
            <CardContent>
              {recentSessions.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 ring-1 ring-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">No study sessions yet</p>
                  <p className="mt-1 text-xs text-text-muted">Ask your first question to get started.</p>
                  <Link href="/dashboard/ask">
                    <Button size="sm" className="mt-5 gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Ask a question
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Link
                      key={session.id}
                      href={`/dashboard/session/${session.id}`}
                      className="group flex items-center gap-4 rounded-lg border border-border/40 p-3.5 transition-all duration-150 hover:border-border hover:bg-secondary/50"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
                        <Brain className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                          {session.questionText}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium">
                            {session.board.name}
                          </Badge>
                          <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium text-text-muted">
                            {session.subject.name}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/dashboard/ask"
                className="group flex items-center gap-4 rounded-lg border border-border/40 p-3.5 transition-all duration-150 hover:border-border hover:bg-secondary/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Ask a Question</p>
                  <p className="text-xs text-text-muted">Get AI-powered answers</p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/dashboard/flashcards"
                className="group flex items-center gap-4 rounded-lg border border-border/40 p-3.5 transition-all duration-150 hover:border-border hover:bg-secondary/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/5 ring-1 ring-accent/10 transition-colors group-hover:bg-accent/10">
                  <Brain className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Review Flashcards</p>
                  <p className="text-xs text-text-muted">Reinforce key concepts</p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
              </Link>
              <Link
                href="/dashboard/folders"
                className="group flex items-center gap-4 rounded-lg border border-border/40 p-3.5 transition-all duration-150 hover:border-border hover:bg-secondary/50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10">
                  <FolderKanban className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Browse Folders</p>
                  <p className="text-xs text-text-muted">Organize study materials</p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {folders.length > 0 && (
        <motion.div variants={item}>
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-medium text-foreground">Recent Folders</CardTitle>
              <Link
                href="/dashboard/folders"
                className="text-xs font-medium text-text-muted transition-colors hover:text-primary"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {folders.map((folder) => (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folders/${folder.id}`}
                    className="group flex items-center gap-3 rounded-lg border border-border/40 p-3.5 transition-all duration-150 hover:border-border hover:bg-secondary/50"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors group-hover:brightness-110"
                      style={{ backgroundColor: `${folder.color}15` }}
                    >
                      <FolderKanban
                        className="h-4 w-4"
                        style={{ color: folder.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary">
                      {folder.name}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
