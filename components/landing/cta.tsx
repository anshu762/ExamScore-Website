"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary via-primary-dark to-primary px-8 py-20 text-center shadow-2xl sm:px-16 sm:py-24"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-light/10 blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/5 blur-[100px]" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium text-primary-foreground/80"
            >
              <Shield className="h-3.5 w-3.5" />
              No credit card required
            </motion.div>

            <h2 className="font-serif text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl">
              Ready to Excel in Your Exams?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/70">
              Join thousands of students using ExamScore to achieve their
              academic goals. Start your journey today — free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  variant="accent"
                  size="lg"
                  className="gap-2 px-8 py-6 text-base font-semibold shadow-lg shadow-black/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/20 px-8 py-6 text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10 hover:border-primary-foreground/30"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
