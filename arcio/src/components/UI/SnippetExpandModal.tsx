import "prismjs/themes/prism-tomorrow.css";

import { X } from "lucide-react";
import { useMemo } from "react";

import type { Snippet } from "../../types";
import { highlightCode } from "../../utils/prismSetup";

export function SnippetExpandModal({ snippet, onClose }: { snippet: Snippet; onClose: () => void }) {
  const html = useMemo(() => highlightCode(snippet.code, snippet.language), [snippet.code, snippet.language]);

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-arcio-bg/95 p-2 font-ui">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0 truncate text-[13px] font-bold text-arcio-text">{snippet.filename}</div>
        <button
          type="button"
          onClick={onClose}
          className="brutal-border flex h-8 w-8 shrink-0 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
          style={{ borderRadius: "var(--radius)" }}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="code-block brutal-border min-h-0 flex-1 overflow-hidden border-arcio-border" style={{ borderRadius: "var(--radius)" }}>
        <pre className="h-full overflow-auto p-3 font-code text-[12px] leading-relaxed">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </div>
  );
}
