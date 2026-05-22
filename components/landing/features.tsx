"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, BookOpen, BarChart3, FolderKanban, Sparkles, Target } from "lucide-react";

const features = [
  {
    title: "AI-Powered Answers",
    description:
      "Get structured, board-specific responses to any academic question. Our AI understands your curriculum and delivers precise, exam-ready content.",
    icon: Brain,
  },
  {
    title: "Board-Specific Guidance",
    description:
      "Every answer is tailored to your specific board's syllabus, marking scheme, and examination style. IB, AP, Cambridge, CBSE, and ICSE supported.",
    icon: BookOpen,
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your accuracy, consistency, and study streaks with sophisticated analytics. Understand your strengths and areas for improvement.",
    icon: BarChart3,
  },
  {
    title: "Smart Organization",
    description:
      "Organize your study materials into customizable folders. Save AI responses, create notes, and build your personal knowledge base.",
    icon: FolderKanban,
  },
  {
    title: "Adaptive Flashcards",
    description:
      "AI-generated and manual flashcards to reinforce key concepts. Spaced repetition principles built into the learning flow.",
    icon: Sparkles,
  },
  {
    title: "Strategic Insights",
    description:
      "Receive personalized study recommendations based on your learning patterns and performance data. Study smarter, not harder.",
    icon: Target,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.02] via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Features
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-primary sm:text-5xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            A comprehensive suite of tools designed for serious students who
            demand the best preparation.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="group h-full border-border/80 bg-card transition-all duration-300 hover:border-accent/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <CardContent className="p-8">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
