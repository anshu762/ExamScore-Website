import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-6 font-serif text-xl font-bold text-[#0A1A14] first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-5 font-serif text-lg font-semibold text-[#0A1A14]">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-4 font-serif text-base font-semibold text-[#0A1A14]">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1 mt-3 text-sm font-semibold uppercase tracking-wider text-[#0F3226]/70">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-[#3D4F47] last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#0A1A14]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#3D4F47]">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 space-y-1.5 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 space-y-1.5 pl-5 last:mb-0">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="list-disc text-sm leading-relaxed text-[#3D4F47] marker:text-[#0F3226]/40">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-[#0F3226]/20 pl-4 italic text-[#6B7A72] last:mb-0">{children}</blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded bg-[#0F3226]/5 px-1.5 py-0.5 text-sm font-mono text-[#0A1A14]">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="mb-3 overflow-x-auto rounded-lg bg-[#0F3226]/5 p-4 text-sm last:mb-0">{children}</pre>
  ),
  hr: () => <hr className="my-4 border-[#D6D0C4]/40" />,
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[#D6D0C4]/40 bg-[#0F3226]/5 px-3 py-2 text-left font-semibold text-[#0A1A14]">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border border-[#D6D0C4]/40 px-3 py-2 text-[#3D4F47]">{children}</td>
  ),
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
