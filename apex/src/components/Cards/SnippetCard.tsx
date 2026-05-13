import "prismjs/themes/prism-tomorrow.css";

import { Code2, Copy, Pin, Trash2 } from "lucide-react";
import { memo, useMemo } from "react";

import type { Language, Snippet } from "../../types";
import { useStore } from "../../store/useStore";
import { formatTimestamp } from "../../utils/formatDate";
import { highlightCode } from "../../utils/prismSetup";

const LANG_BADGE: Record<Language, string> = {
  javascript: "bg-[#F5C842] text-arcio-text",
  typescript: "bg-[#3178C6] text-white",
  html: "bg-[#FF7F6B] text-arcio-text",
  css: "bg-[#3B82F6] text-white",
  python: "bg-[#4CAF82] text-arcio-text",
  json: "bg-[#F5C842] text-arcio-text",
  bash: "bg-[#888888] text-white",
  sql: "bg-[#E879F9] text-arcio-text",
  rust: "bg-[#DEA584] text-arcio-text",
  go: "bg-[#00ADD8] text-white",
  java: "bg-[#E87431] text-white",
  cpp: "bg-[#00599C] text-white",
  plaintext: "bg-[#888888] text-white",
};

export const SnippetCard = memo(function SnippetCard({
  snippet,
  onOpen,
  onExpand,
  onCopy,
}: {
  snippet: Snippet;
  onOpen: (id: string) => void;
  onExpand: (id: string) => void;
  onCopy: (code: string) => void;
}) {
  const togglePin = useStore((s) => s.togglePin);
  const deleteItem = useStore((s) => s.deleteItem);
  const html = useMemo(() => highlightCode(snippet.code, snippet.language), [snippet.code, snippet.language]);

  return (
    <div
      className="group brutal-border brutal-shadow relative w-full cursor-pointer bg-arcio-surface p-3 font-ui transition-all hover:bg-arcio-accent"
      style={{ borderRadius: "var(--radius)" }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onOpen(snippet.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(snippet.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(snippet.code);
          }}
          className="brutal-border flex h-7 w-7 shrink-0 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
          style={{ borderRadius: "var(--radius)" }}
          aria-label="Copy code"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void togglePin(snippet.id); }}
          className={`brutal-border flex h-7 w-7 items-center justify-center bg-arcio-surface hover:bg-white ${snippet.pinned ? "bg-arcio-accent" : ""}`}
          style={{ borderRadius: "var(--radius)" }}
        >
          <Pin className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void deleteItem(snippet.id); }}
          className="brutal-border flex h-7 w-7 items-center justify-center bg-arcio-surface text-arcio-danger hover:bg-arcio-danger hover:text-white"
          style={{ borderRadius: "var(--radius)" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex border-2 border-arcio-border px-1.5 py-0.5 text-[11px] font-bold uppercase ${LANG_BADGE[snippet.language] || "bg-arcio-surface text-arcio-text"}`}
            style={{ borderRadius: "var(--radius)" }}
          >
            {snippet.language === "plaintext" ? "TXT" : snippet.language}
          </span>
          <span className="truncate text-[13px] font-semibold text-arcio-text">{snippet.filename}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1 group-hover:hidden">
          {snippet.pinned && <Pin className="h-4 w-4 text-arcio-text" aria-label="Pinned" />}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopy(snippet.code);
            }}
            className="brutal-border flex h-8 w-8 shrink-0 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
            style={{ borderRadius: "var(--radius)" }}
            aria-label="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="code-block brutal-border w-full overflow-hidden border-arcio-border text-left"
        style={{ borderRadius: "var(--radius)", maxHeight: "156px" }}
      >
        <pre className="max-h-[156px] overflow-auto p-2 font-code text-[12px] leading-relaxed">
          <code
            className={`language-${snippet.language === "html" ? "markup" : snippet.language}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </pre>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-arcio-muted">
        <span>{formatTimestamp(snippet.updatedAt)}</span>
        <div className="flex items-center gap-2">
          <span className="uppercase">{snippet.language}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand(snippet.id);
            }}
            className="brutal-border flex h-7 w-7 items-center justify-center bg-arcio-surface text-arcio-text hover:bg-arcio-accent"
            style={{ borderRadius: "var(--radius)" }}
            aria-label="Expand code"
          >
            <Code2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
