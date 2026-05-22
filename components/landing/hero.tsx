"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LiveCounter } from "@/components/shared/live-counter";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.02] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <LiveCounter />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent-dark"
        >
          <GraduationCap className="h-3.5 w-3.5" />
          Premium AI Exam Preparation Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Master Your Exams
          <br />
          <span className="bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-transparent">
            With Precision
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl"
        >
          An AI-powered platform designed for serious students. Get
          board-specific answers, structured study guides, and strategic
          insights to excel in IB, AP, Cambridge, CBSE, and ICSE examinations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/auth/signup">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 px-8 py-6 text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#features">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 py-6 text-base border-2"
            >
              <Sparkles className="h-4 w-4" />
              Explore Features
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Supported Examination Boards
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            {["IB", "AP", "Cambridge", "CBSE", "ICSE"].map((name, i) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                className="text-sm font-semibold tracking-wide text-text-secondary/80 hover:text-primary transition-colors"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
