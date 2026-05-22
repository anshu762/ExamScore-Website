"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import {
  Sparkles,
  FolderKanban,
  Brain,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/ask", label: "Ask Question", icon: Sparkles },
  { href: "/folders", label: "My Folders", icon: FolderKanban },
  { href: "/flashcards", label: "Flashcards", icon: Brain },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F5F2EA]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#0F3226] text-[#FDFCF9] shadow-lg transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={closeSidebar}>
            <img src="/logo.jpg" alt="ExamScore" className="h-7 w-auto" />
            <span className="font-serif text-base font-semibold tracking-tight text-[#FDFCF9]">
              ExamScore
            </span>
          </Link>
          <button
            onClick={closeSidebar}
            className="rounded-md p-1 text-[#FDFCF9]/50 hover:bg-[#FDFCF9]/10 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 h-px bg-[#FDFCF9]/10" />

        <nav className="flex-1 space-y-0.5 px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                  isActive
                    ? "bg-[#FDFCF9]/10 font-medium text-[#FDFCF9]"
                    : "text-[#FDFCF9]/60 hover:bg-[#FDFCF9]/5 hover:text-[#FDFCF9]/90"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-[#FDFCF9]/10" />

        <div className="px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDFCF9]/10 text-xs font-semibold text-[#FDFCF9]/80">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm text-[#FDFCF9]/90">{session?.user?.name ?? "User"}</p>
              <p className="truncate text-xs text-[#FDFCF9]/40">{session?.user?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#FDFCF9]/40 transition-colors hover:bg-[#FDFCF9]/5 hover:text-[#FDFCF9]/70"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
            <ChevronRight className="ml-auto h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#D6D0C4]/40 bg-[#FDFCF9]/90 px-4 backdrop-blur-md md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0F3226] transition-colors hover:bg-[#0F3226]/5"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="ExamScore" className="h-5 w-auto" />
            <span className="font-serif text-sm font-semibold text-[#0A1A14]">ExamScore</span>
          </div>
          <div className="ml-auto">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F3226]/10 text-[10px] font-semibold text-[#0F3226]">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-5xl px-5 py-8 md:px-10 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
