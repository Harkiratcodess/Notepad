import { ArrowLeft, Pin, Trash2, Eye, Edit3 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useStore } from "../../store/useStore";
import type { Note } from "../../types";
import { looksLikeCodeBlock, TASK_LINE } from "../../utils/codeDetection";
import { Badge } from "../UI/Badge";
import { Markdown } from "../UI/Markdown";

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function NoteEditor({ note, onClose }: { note: Note; onClose: () => void }) {
  const updateItem = useStore((s) => s.updateItem);
  const deleteItem = useStore((s) => s.deleteItem);
  const convertNoteToSnippet = useStore((s) => s.convertNoteToSnippet);
  const togglePin = useStore((s) => s.togglePin);

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const noteIdRef = useRef(note.id);

  useEffect(() => {
    if (noteIdRef.current !== note.id) {
      noteIdRef.current = note.id;
      setHintDismissed(false);
    }
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const persist = useMemo(
    () =>
      debounce((nextTitle: string, nextContent: string) => {
        void updateItem(note.id, { title: nextTitle, content: nextContent });
      }, 500),
    [note.id, updateItem],
  );

  useEffect(() => {
    persist(title, content);
  }, [title, content, persist]);

  const showSnippetHint = useMemo(() => {
    if (hintDismissed) return false;
    return looksLikeCodeBlock(content);
  }, [content, hintDismissed]);

  const lines = useMemo(() => content.split(/\r?\n/), [content]);

  const taskItems = useMemo(() => {
    return lines
      .map((line, i) => {
        const m = line.match(TASK_LINE);
        if (!m) return null;
        return {
          index: i,
          checked: m[3].toLowerCase() === "x",
          label: m[5],
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [lines]);

  const toggleTask = useCallback(
    (lineIndex: number) => {
      const nextLines = [...lines];
      const line = nextLines[lineIndex];
      if (!line) return;
      const m = line.match(TASK_LINE);
      if (!m) return;
      const checked = m[3].toLowerCase() === "x";
      const nextMark = checked ? " " : "x";
      nextLines[lineIndex] = `${m[1]}${m[2]}${nextMark}${m[4]}${m[5]}`;
      setContent(nextLines.join("\n"));
    },
    [lines],
  );

  return (
    <div className="notepad-bg absolute inset-0 z-30 flex flex-col border-l-2 border-arcio-border bg-arcio-bg">
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
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`brutal-border flex h-8 px-2 items-center gap-1 bg-arcio-surface hover:bg-arcio-accent ${isPreview ? "bg-arcio-accent" : ""}`}
          style={{ borderRadius: "var(--radius)" }}
        >
          {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-[11px] font-bold">{isPreview ? "Edit" : "Preview"}</span>
        </button>
        <button
          type="button"
          onClick={() => void togglePin(note.id)}
          className={`brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent ${
            note.pinned ? "bg-arcio-accent" : ""
          }`}
          style={{ borderRadius: "var(--radius)" }}
          aria-label={note.pinned ? "Unpin" : "Pin"}
        >
          <Pin className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            void deleteItem(note.id);
            onClose();
          }}
          className="brutal-border flex h-8 items-center gap-1 bg-arcio-surface px-2 text-arcio-danger hover:bg-arcio-danger hover:text-white"
          style={{ borderRadius: "var(--radius)" }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 w-full border-none bg-transparent font-ui text-[18px] font-bold text-arcio-text outline-none"
          placeholder="Title"
        />

        {showSnippetHint ? (
          <div className="mb-3 border-2 border-dashed border-arcio-border bg-arcio-surface p-2 font-ui text-[12px] text-arcio-text">
            <div className="mb-2 text-arcio-muted">Looks like code — save as snippet?</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="brutal-border bg-arcio-accent px-2 py-1 text-[12px] font-semibold hover:opacity-90"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => {
                  const name = window.prompt("Snippet filename", "snippet.txt");
                  if (!name) return;
                  void convertNoteToSnippet(note.id, name);
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="brutal-border bg-arcio-surface px-2 py-1 text-[12px] font-semibold hover:bg-arcio-accent"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => {
                  setHintDismissed(true);
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : null}

        {isPreview ? (
          <div className="min-h-[220px] w-full brutal-border bg-arcio-surface p-4 overflow-y-auto" style={{ borderRadius: "var(--radius)" }}>
            <Markdown content={content || "*Empty note*"} />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[220px] w-full resize-none border-2 border-arcio-border bg-arcio-surface p-2 font-code text-[13px] leading-relaxed text-arcio-text outline-none"
            style={{ borderRadius: "var(--radius)" }}
            spellCheck={false}
          />
        )}

        {taskItems.length > 0 ? (
          <div className="mt-3 border-2 border-arcio-border bg-arcio-surface p-2" style={{ borderRadius: "var(--radius)" }}>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="lang">Checklist</Badge>
            </div>
            <ul className="space-y-1">
              {taskItems.map((item) => {
                return (
                  <li key={item.index} className="flex items-start gap-2 font-ui text-[13px]">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleTask(item.index)}
                      className="mt-1 h-4 w-4 accent-[#4CAF82]"
                    />
                    <span className={item.checked ? "text-arcio-muted line-through" : "text-arcio-text"}>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
