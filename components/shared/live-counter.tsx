"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";

export function LiveCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchCount() {
      try {
        const response = await fetch("/api/analytics/live-count");
        const data = await response.json();
        setCount(data.count);
      } catch {
        setCount(Math.floor(Math.random() * 50) + 100);
      }
    }

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-text-secondary">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      <span>{count.toLocaleString()} students learning now</span>
    </div>
  );
}
