"use client";

import { motion } from "framer-motion";
import { MessageSquare, Brain, FolderOpen, BarChart3 } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Ask Your Question",
    description:
      "Type any exam-related question and select your board, level, and subject. Our AI understands the context of your curriculum instantly.",
    icon: MessageSquare,
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    step: 2,
    title: "Receive Structured Answer",
    description:
      "Get a comprehensive response with direct answer, structure guide, and common mistakes to avoid — all tailored to your specific examination board.",
    icon: Brain,
    color: "from-accent/10 to-accent/5",
    iconColor: "text-accent-dark",
    bgColor: "bg-accent/10",
  },
  {
    step: 3,
    title: "Save & Organize",
    description:
      "Save responses to folders, create notes, and build your personalized study library. Your knowledge base grows with every session.",
    icon: FolderOpen,
    color: "from-primary/10 to-primary/5",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    step: 4,
    title: "Track Progress",
    description:
      "Monitor your improvement with detailed analytics and adaptive study recommendations. See your accuracy and consistency grow over time.",
    icon: BarChart3,
    color: "from-accent/10 to-accent/5",
    iconColor: "text-accent-dark",
    bgColor: "bg-accent/10",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Workflow
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-primary sm:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            A simple, focused workflow designed for effective studying.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-border via-border to-transparent md:block" />

          <div className="space-y-16 md:space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-start gap-6 md:flex-row md:pl-20"
                >
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                    <Icon className={`h-7 w-7 ${step.iconColor}`} />
                  </div>

                  <div className="relative flex-1 pt-2">
                    <div className="absolute -left-11 top-7 hidden h-3 w-3 rounded-full border-2 border-border bg-bg md:block" />

                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-[10px] font-bold text-accent-dark">
                        {step.step}
                      </span>
                      Step {step.step}
                    </span>

                    <h3 className="mt-3 font-serif text-2xl font-semibold text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-3 max-w-lg text-base leading-relaxed text-text-secondary">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
