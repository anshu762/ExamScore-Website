"use client";

import { useState } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-bg/80 backdrop-blur-md px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-1 text-text-secondary hover:text-foreground md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
