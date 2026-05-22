"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  LayoutDashboard,
  FolderKanban,
  Brain,
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ask", label: "Ask AI", icon: Sparkles },
  { href: "/dashboard/boards", label: "Boards", icon: BookOpen },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: Brain },
  { href: "/dashboard/folders", label: "Folders", icon: FolderKanban },
  { href: "/dashboard/progress", label: "Progress", icon: BarChart3 },
];

const bottomNav = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border bg-sidebar transition-transform md:static md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">ExamScore</span>
          </Link>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-text-secondary hover:text-foreground md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Separator />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {mainNav.map((item) => {
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-border"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div className="space-y-1 px-3 py-4">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-border"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-border"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
