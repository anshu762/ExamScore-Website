"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Brain,
  FolderKanban,
  BarChart3,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/ask", label: "Ask AI", icon: Sparkles },
  { href: "/dashboard/boards", label: "Boards", icon: BookOpen },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: Brain },
  { href: "/dashboard/folders", label: "Folders", icon: FolderKanban },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border/60 bg-card shadow-sm transition-transform md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex h-16 items-center justify-between px-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary shadow-sm">
              <span className="text-sm font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">ExamScore</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-text-muted hover:bg-secondary md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-4 my-3 h-px bg-border/60" />

        <nav className="flex-1 space-y-0.5 px-3 pb-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-150",
                  isActive
                    ? "bg-primary/5 font-medium text-primary"
                    : "text-text-secondary hover:bg-secondary hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-accent" />
                )}
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-text-muted group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 my-3 h-px bg-border/60" />

        <div className="px-3 pb-5">
          <div className="flex items-center gap-3 rounded-md px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shadow-sm">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">
                {session?.user?.name ?? "User"}
              </p>
              <p className="truncate text-xs text-text-muted">
                {session?.user?.email ?? ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:bg-secondary hover:text-error"
          >
            <LogOut className="h-4 w-4" />
            Sign out
            <ChevronRight className="ml-auto h-3.5 w-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
}
