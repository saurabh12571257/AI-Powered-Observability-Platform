import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          strong: ({ children }) => <strong className="font-semibold text-current">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="mb-3 list-disc space-y-2 pl-5 last:mb-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-3 list-decimal space-y-2 pl-5 last:mb-0">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          code: ({ children }) => (
            <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.95em]">{children}</code>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-300 underline decoration-indigo-400/50 underline-offset-2"
            >
              {children}
            </a>
          ),
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
