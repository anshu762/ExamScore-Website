"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const boards = [
  {
    name: "International Baccalaureate",
    code: "IB",
    description: "MYP, DP1, DP2",
    students: "5,000+",
    color: "border-l-primary",
  },
  {
    name: "Advanced Placement",
    code: "AP",
    description: "College-level courses",
    students: "4,200+",
    color: "border-l-accent",
  },
  {
    name: "Cambridge International",
    code: "Cambridge",
    description: "IGCSE, AS, A Level",
    students: "6,800+",
    color: "border-l-primary",
  },
  {
    name: "CBSE",
    code: "CBSE",
    description: "Grades 9-12",
    students: "8,500+",
    color: "border-l-accent",
  },
  {
    name: "ICSE",
    code: "ICSE",
    description: "Grades 9-10",
    students: "3,100+",
    color: "border-l-primary",
  },
];

export function BoardsShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-border px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/[0.02] via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Coverage
          </span>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-primary sm:text-5xl">
            All Major Boards Supported
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
            Comprehensive coverage of the world&apos;s leading examination
            boards, with curriculum-specific content and past paper analysis.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {boards.map((board, index) => (
            <motion.div
              key={board.code}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card
                className={`group h-full border-border/80 border-l-[3px] ${board.color} bg-card transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]`}
              >
                <CardContent className="flex flex-col items-start p-6">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {board.code}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
                    {board.name}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {board.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent-dark">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                    {board.students} students
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
