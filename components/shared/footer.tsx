import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-primary-dark">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/10">
                <BookOpen className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-semibold text-primary-foreground/90">
                ExamScore
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/50 max-w-xs">
              Premium AI-powered exam preparation platform for serious students worldwide.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "/#features" },
                { label: "How It Works", href: "/#how-it-works" },
                { label: "Boards", href: "/#boards" },
              ],
            },
            {
              title: "Support",
              links: [
                { label: "FAQ", href: "/#faq" },
                { label: "Contact", href: "/contact" },
                { label: "Documentation", href: "/docs" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground/40">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/60 transition-colors duration-200 hover:text-primary-foreground/90"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/40">
          &copy; {currentYear} ExamScore. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
