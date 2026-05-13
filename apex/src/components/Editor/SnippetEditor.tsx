import "prismjs/themes/prism-tomorrow.css";

import { ArrowLeft, Copy, Pin, Trash2, Save, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useStore } from "../../store/useStore";
import type { Language, Snippet } from "../../types";
import { highlightCode } from "../../utils/prismSetup";

const LANGUAGES: Language[] = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "bash",
  "sql",
  "rust",
  "go",
  "java",
  "cpp",
  "plaintext",
];

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function SnippetEditor({
  snippet,
  onClose,
  onCopied,
}: {
  snippet: Snippet;
  onClose: () => void;
  onCopied: () => void;
}) {
  const updateItem = useStore((s) => s.updateItem);
  const deleteItem = useStore((s) => s.deleteItem);
  const togglePin = useStore((s) => s.togglePin);

  const [filename, setFilename] = useState(snippet.filename);
  const [language, setLanguage] = useState<Language>(snippet.language);
  const [code, setCode] = useState(snippet.code);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFilename(snippet.filename);
    setLanguage(snippet.language);
    setCode(snippet.code);
  }, [snippet.id, snippet.filename, snippet.language, snippet.code]);

  const persist = useMemo(
    () =>
      debounce((fn: string, lang: Language, c: string) => {
        void updateItem(snippet.id, { filename: fn, language: lang, code: c });
      }, 500),
    [snippet.id, updateItem],
  );

  useEffect(() => {
    persist(filename, language, code);
  }, [filename, language, code, persist]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await updateItem(snippet.id, { filename, language, code });
    setIsSaving(false);
    onClose();
  }, [snippet.id, filename, language, code, updateItem, onClose]);

  const previewHtml = useMemo(() => highlightCode(code, language), [code, language]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      onCopied();
    } catch {
      onCopied();
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col border-l-2 border-arcio-border bg-arcio-bg">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b-2 border-arcio-border bg-arcio-surface px-2">
        <button
          type="button"
          onClick={onClose}
          className="brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
          style={{ borderRadius: "var(--radius)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          className="brutal-border ml-2 flex h-8 items-center gap-1 bg-arcio-accent px-2 text-[12px] font-semibold text-arcio-text hover:opacity-90"
          style={{ borderRadius: "var(--radius)" }}
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
        <button
          type="button"
          onClick={() => void handleSave()}
          className="brutal-border ml-2 flex h-8 items-center gap-1 bg-arcio-accent px-2 text-[11px] font-bold text-arcio-text hover:opacity-90 transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          style={{ borderRadius: "var(--radius)" }}
        >
          {isSaving ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {isSaving ? "Saved" : "Save"}
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => void togglePin(snippet.id)}
          className={`brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent ${
            snippet.pinned ? "bg-arcio-accent" : ""
          }`}
          style={{ borderRadius: "var(--radius)" }}
          aria-label={snippet.pinned ? "Unpin" : "Pin"}
        >
          <Pin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            void deleteItem(snippet.id);
            onClose();
          }}
          className="brutal-border flex h-8 items-center gap-1 bg-arcio-surface px-2 text-arcio-danger hover:bg-arcio-danger hover:text-white"
          style={{ borderRadius: "var(--radius)" }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        <input
          autoFocus
          onFocus={(e) => e.target.select()}
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="w-full border-none bg-transparent font-ui text-[18px] font-bold text-arcio-text outline-none focus:placeholder-transparent"
          placeholder="filename.ext"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="lang" className="font-ui text-[11px] uppercase text-arcio-muted">
            Language
          </label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="brutal-border flex-1 bg-arcio-surface px-2 py-1 font-ui text-[13px] text-arcio-text"
            style={{ borderRadius: "var(--radius)" }}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-block min-h-[160px] w-full resize-none border-2 border-arcio-border p-2 font-code text-[13px] leading-relaxed text-[#f0f0f0] outline-none"
          style={{ borderRadius: "var(--radius)" }}
          spellCheck={false}
        />

        <div>
          <div className="mb-1 font-ui text-[11px] uppercase text-arcio-muted">Preview</div>
          <div className="code-block brutal-border border-arcio-border" style={{ borderRadius: "var(--radius)" }}>
            <pre className="max-h-40 overflow-auto p-2 font-code text-[12px] leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
