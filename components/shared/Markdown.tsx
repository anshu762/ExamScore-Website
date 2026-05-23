import katex from "katex";
import "katex/dist/katex.min.css";
import type { ReactNode } from "react";

function renderMath(expr: string, display: boolean): string {
  try {
    return katex.renderToString(
      expr
        .replace(/\\\(/g, "")
        .replace(/\\\)/g, "")
        .replace(/\\\[/g, "")
        .replace(/\\\]/g, ""),
      {
        displayMode: display,
        throwOnError: false,
        trust: true,
        macros: {
          "\\R": "\\mathbb{R}",
          "\\N": "\\mathbb{N}",
          "\\Z": "\\mathbb{Z}",
        },
      }
    );
  } catch {
    return expr;
  }
}

const MATH_PATTERN = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

function splitByMath(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = MATH_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const expr = match[1] ?? match[2];
    const display = !!match[1];
    const html = renderMath(expr.trim(), display);
    parts.push(
      <span
        key={parts.length}
        className={
          display
            ? "my-3 block overflow-x-auto text-center"
            : "inline-block align-middle"
        }
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function parseLine(line: string): ReactNode[] {
  const mathSplit = splitByMath(line);
  if (mathSplit.some((p) => typeof p !== "string")) {
    const result: ReactNode[] = [];
    for (const part of mathSplit) {
      if (typeof part === "string") {
        result.push(...parseInline(part));
      } else {
        result.push(part);
      }
    }
    return result;
  }
  return parseInline(line);
}

function parseInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const imageMatch = remaining.match(/^!\[([^\]]*)\]\([^)]+\)/);
    if (imageMatch) {
      const alt = imageMatch[1] || "diagram";
      parts.push(
        <span
          key={parts.length}
          className="inline-block rounded bg-amber-50 px-2 py-0.5 text-xs italic text-amber-700"
        >
          [{alt}]
        </span>
      );
      remaining = remaining.slice(imageMatch[0].length);
      continue;
    }

    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push(
        <strong key={parts.length} className="font-semibold text-[#0A1A14]">
          {parseInline(boldMatch[1])}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      const inner = italicMatch[1];
      if (inner.trim().length > 0 && !inner.startsWith(" ")) {
        parts.push(
          <em key={parts.length} className="italic text-[#3D4F47]">
            {parseInline(inner)}
          </em>
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }
    }

    const codeMatch = remaining.match(/^`(.+?)`/);
    if (codeMatch) {
      parts.push(
        <code
          key={parts.length}
          className="rounded bg-[#0F3226]/5 px-1.5 py-0.5 text-sm font-mono text-[#0A1A14]"
        >
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return parts;
}

function detectAndWrapMath(raw: string): string {
  const lines = raw.split("\n");
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    const hasUnicodeMath =
      /[\u00B2\u00B3\u00B9\u2070-\u209F\u2080-\u2089\u222B\u2211\u220F\u2202\u03B1-\u03C9\u03C0\u03B5\u03B8]/.test(
        trimmed
      );

    const hasOperatorExpr =
      /^[A-Za-z]\s*[=<>≈≠≤≥]\s*/.test(trimmed) &&
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("#");

    const hasMathStructure =
      trimmed.includes("∫") ||
      trimmed.includes("∑") ||
      trimmed.includes("∏") ||
      (trimmed.includes("/") &&
        /[A-Za-z0-9)]\s*\/\s*[A-Za-z0-9(]/.test(trimmed)) ||
      /\\[a-zA-Z]+/.test(trimmed);

    if (
      !trimmed.startsWith("$$") &&
      !trimmed.endsWith("$$") &&
      (hasUnicodeMath || hasOperatorExpr || hasMathStructure) &&
      trimmed.length < 200
    ) {
      const latex = trimmed
        .replace(/\u00B2/g, "^2")
        .replace(/\u00B3/g, "^3")
        .replace(/\u2070/g, "^0")
        .replace(/\u00B9/g, "^1")
        .replace(/[\u2080-\u2089]/g, (ch) =>
          String.fromCharCode(8320 - 8320 + ch.charCodeAt(0) - 8320)
        )
        .replace(/∫/g, "\\int")
        .replace(/∑/g, "\\sum")
        .replace(/∏/g, "\\prod")
        .replace(/ε/g, "\\varepsilon")
        .replace(/α/g, "\\alpha")
        .replace(/β/g, "\\beta")
        .replace(/θ/g, "\\theta")
        .replace(/π/g, "\\pi")
        .replace(/λ/g, "\\lambda")
        .replace(/μ/g, "\\mu")
        .replace(/σ/g, "\\sigma")
        .replace(/ω/g, "\\omega")
        .replace(/δ/g, "\\delta")
        .replace(/∂/g, "\\partial")
        .replace(/\u2192/g, "\\to");

      result.push(`$$${latex}$$`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

export function Markdown({ content }: { content: string }) {
  const processed = detectAndWrapMath(content);
  const lines = processed.split("\n");
  const elements: ReactNode[] = [];
  let orderedItems: ReactNode[] = [];

  function flushOrderedList() {
    if (orderedItems.length > 0) {
      elements.push(
        <ol
          key={elements.length}
          className="mb-4 space-y-2 pl-6 last:mb-0 [&>li]:pl-2"
        >
          {orderedItems.map((item, i) => (
            <li
              key={i}
              className="list-decimal text-sm leading-relaxed text-[#3D4F47] marker:text-[#0F3226]/50 marker:font-semibold"
            >
              {item}
            </li>
          ))}
        </ol>
      );
      orderedItems = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushOrderedList();
      continue;
    }

    if (/^!\[.*\]\(.+\)/.test(trimmed)) {
      flushOrderedList();
      const alt = trimmed.match(/^!\[([^\]]*)\]/)?.[1] || "diagram";
      elements.push(
        <div
          key={elements.length}
          className="mb-4 rounded-xl border border-dashed border-amber-200 bg-amber-50/30 px-4 py-3 text-center text-sm italic text-amber-700"
        >
          [{alt}]
        </div>
      );
      continue;
    }

    if (/^\[\w+\.(png|jpg|jpeg|gif|svg)\]/.test(trimmed.toLowerCase())) {
      continue;
    }

    if (
      /^(error|cannot|unable to|failed to)/i.test(trimmed) &&
      trimmed.length < 100
    ) {
      continue;
    }

    const h3Match = trimmed.match(/^### (.+)/);
    if (h3Match) {
      flushOrderedList();
      elements.push(
        <h3
          key={elements.length}
          className="mb-3 mt-6 font-serif text-lg font-semibold text-[#0A1A14]"
        >
          {parseLine(h3Match[1])}
        </h3>
      );
      continue;
    }

    const h2Match = trimmed.match(/^## (.+)/);
    if (h2Match) {
      flushOrderedList();
      elements.push(
        <h2
          key={elements.length}
          className="mb-3 mt-7 font-serif text-xl font-bold text-[#0A1A14]"
        >
          {parseLine(h2Match[1])}
        </h2>
      );
      continue;
    }

    const h1Match = trimmed.match(/^# (.+)/);
    if (h1Match) {
      flushOrderedList();
      elements.push(
        <h1
          key={elements.length}
          className="mb-4 mt-8 font-serif text-2xl font-bold text-[#0A1A14] first:mt-0"
        >
          {parseLine(h1Match[1])}
        </h1>
      );
      continue;
    }

    const h4Match = trimmed.match(/^#### (.+)/);
    if (h4Match) {
      flushOrderedList();
      elements.push(
        <h4
          key={elements.length}
          className="mb-2 mt-4 text-sm font-semibold uppercase tracking-wider text-[#0F3226]/60"
        >
          {parseLine(h4Match[1])}
        </h4>
      );
      continue;
    }

    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (orderedMatch) {
      orderedItems.push(parseLine(orderedMatch[2]));
      continue;
    }

    const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (ulMatch) {
      flushOrderedList();
      const items = ulMatch[1].split(";");
      elements.push(
        <ul
          key={elements.length}
          className="mb-4 space-y-1.5 pl-6 last:mb-0"
        >
          {items.map((item, j) => (
            <li
              key={j}
              className="list-disc text-sm leading-relaxed text-[#3D4F47] marker:text-[#0F3226]/40"
            >
              {parseLine(item.trim())}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    const quoteMatch = trimmed.match(/^>\s+(.+)/);
    if (quoteMatch) {
      flushOrderedList();
      elements.push(
        <blockquote
          key={elements.length}
          className="mb-4 border-l-2 border-[#0F3226]/20 pl-4 italic text-[#6B7A72]"
        >
          {parseLine(quoteMatch[1])}
        </blockquote>
      );
      continue;
    }

    const hrMatch = trimmed.match(/^(-{3,}|\*{3,})$/);
    if (hrMatch) {
      flushOrderedList();
      elements.push(
        <hr key={elements.length} className="my-6 border-[#D6D0C4]/30" />
      );
      continue;
    }

    const mathBlock = trimmed.match(/^\$\$([\s\S]+?)\$\$$/);
    if (mathBlock) {
      flushOrderedList();
      const html = renderMath(mathBlock[1].trim(), true);
      elements.push(
        <div
          key={elements.length}
          className="my-4 overflow-x-auto rounded-lg bg-[#0F3226]/[0.03] p-4 text-center"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
      continue;
    }

    const indentMatch = line.match(/^    /);
    if (indentMatch) {
      flushOrderedList();
      elements.push(
        <div
          key={elements.length}
          className="mb-4 overflow-x-auto rounded-lg bg-[#0F3226]/[0.03] px-4 py-3 font-mono text-sm leading-relaxed text-[#3D4F47]"
        >
          {parseLine(trimmed)}
        </div>
      );
      continue;
    }

    flushOrderedList();
    elements.push(
      <p
        key={elements.length}
        className="mb-4 leading-relaxed text-[#3D4F47] last:mb-0"
      >
        {parseLine(trimmed)}
      </p>
    );
  }

  flushOrderedList();

  return <div className="[&>*:last-child]:mb-0">{elements}</div>;
}
