"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/40 bg-card/90 px-4 backdrop-blur-md md:hidden">
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-secondary"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="ExamScore" className="h-6 w-6 rounded object-cover" />
            <span className="text-sm font-semibold text-foreground">ExamScore</span>
          </div>
        </header>
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-5 py-6 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
