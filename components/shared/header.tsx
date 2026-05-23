"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, FolderKanban, Brain } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How It Works" },
];

const appLinks = [
  { href: "/ask", label: "Ask Question", icon: Sparkles },
  { href: "/folders", label: "Folders", icon: FolderKanban },
  { href: "/flashcards", label: "Flashcards", icon: Brain },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-bg/90 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-colors duration-300 group-hover:bg-primary-light">
            <BookOpen className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight text-foreground">
            ExamScore
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative text-sm transition-colors duration-200",
                pathname === link.href
                  ? "text-foreground font-medium"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          {session && (
            <span className="h-4 w-px bg-border/60" />
          )}
          {session && appLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-1.5 text-sm transition-colors duration-200",
                pathname.startsWith(link.href)
                  ? "text-foreground font-medium"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
              {pathname.startsWith(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-sm">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="text-sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm" className="text-sm shadow-sm shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
