"use client";
// Math rendering: react-markdown + remark-math + rehype-katex
// "use client" is required — rehype-katex uses browser APIs for KaTeX rendering

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";

const components: Components = {
  // ── Headings ───────────────────────────────────────────────────────────
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 font-serif text-xl font-bold text-[#0A1A14] first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2.5 mt-5 font-serif text-lg font-semibold text-[#0A1A14] first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 font-serif text-base font-semibold text-[#0F3226] first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-3 text-sm font-semibold uppercase tracking-wider text-[#0F3226]/60">
      {children}
    </h4>
  ),

  // ── Paragraph ──────────────────────────────────────────────────────────
  p: ({ children }) => (
    <p className="mb-3 text-sm leading-relaxed text-[#3D4F47] last:mb-0">
      {children}
    </p>
  ),

  // ── Lists ──────────────────────────────────────────────────────────────
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children, ...props }) => {
    const ordered = (props as { ordered?: boolean }).ordered;
    return (
      <li
        className={`text-sm leading-relaxed text-[#3D4F47] ${
          ordered ? "list-decimal marker:text-[#0F3226]/50 marker:font-semibold" : "list-disc marker:text-[#0F3226]/40"
        }`}
      >
        {children}
      </li>
    );
  },

  // ── Blockquote ─────────────────────────────────────────────────────────
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-[#0F3226]/25 pl-4 italic text-[#6B7A72]">
      {children}
    </blockquote>
  ),

  // ── Code ───────────────────────────────────────────────────────────────
  code: ({ children, className, ...props }) => {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-lg bg-[#0F3226]/[0.04] px-4 py-3 font-mono text-sm leading-relaxed text-[#3D4F47]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-[#0F3226]/[0.06] px-1.5 py-0.5 font-mono text-[13px] text-[#0A1A14]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-xl border border-[#D6D0C4]/40 bg-[#0F3226]/[0.03] p-0 last:mb-0">
      {children}
    </pre>
  ),

  // ── Inline elements ────────────────────────────────────────────────────
  strong: ({ children }) => (
    <strong className="font-semibold text-[#0A1A14]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#3D4F47]">{children}</em>
  ),

  // ── Horizontal Rule ────────────────────────────────────────────────────
  hr: () => <hr className="my-4 border-[#D6D0C4]/40" />,

  // ── Tables ─────────────────────────────────────────────────────────────
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto rounded-xl border border-[#D6D0C4]/50 last:mb-0">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#0F3226]/[0.04] text-[#0A1A14]">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-[#D6D0C4]/30">{children}</tbody>
  ),
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#0F3226]/70">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-sm text-[#3D4F47]">{children}</td>
  ),

  // ── Images — suppressed (AI is instructed not to emit images) ──────────
  img: ({ alt }) => (
    <span className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs italic text-amber-700">
      [{alt ?? "diagram"}]
    </span>
  ),

  // ── Links ──────────────────────────────────────────────────────────────
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[#0F3226] underline underline-offset-2 hover:text-[#1A4A36]"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
