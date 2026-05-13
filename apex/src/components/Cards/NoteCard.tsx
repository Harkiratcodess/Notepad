import { memo } from "react";
import { Pin, Trash2 } from "lucide-react";

import type { Note } from "../../types";
import { useStore } from "../../store/useStore";
import { formatTimestamp } from "../../utils/formatDate";
import { Badge } from "../UI/Badge";
import { Markdown } from "../UI/Markdown";

export const NoteCard = memo(function NoteCard({ note, onOpen }: { note: Note; onOpen: (id: string) => void }) {
  const togglePin = useStore((s) => s.togglePin);
  const deleteItem = useStore((s) => s.deleteItem);
  const recent = Date.now() - note.updatedAt < 60 * 60 * 1000;
  const preview = note.content.replace(/\r\n/g, "\n").trim();

  return (
    <button
      type="button"
      onClick={() => onOpen(note.id)}
      className="group brutal-border brutal-shadow relative w-full bg-arcio-surface p-3 text-left font-ui hover:bg-arcio-accent transition-all"
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void togglePin(note.id); }}
          className={`brutal-border flex h-7 w-7 items-center justify-center bg-arcio-surface hover:bg-white ${note.pinned ? "bg-arcio-accent" : ""}`}
          style={{ borderRadius: "var(--radius)" }}
        >
          <Pin className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); void deleteItem(note.id); }}
          className="brutal-border flex h-7 w-7 items-center justify-center bg-arcio-surface text-arcio-danger hover:bg-arcio-danger hover:text-white"
          style={{ borderRadius: "var(--radius)" }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge variant="neutral">Note</Badge>
        {note.pinned && <Pin className="h-4 w-4 shrink-0 text-arcio-text group-hover:hidden" aria-label="Pinned" />}
      </div>
      <div className="mb-1 text-[15px] font-bold leading-snug text-arcio-text">{note.title || "Untitled note"}</div>
      <div className="line-clamp-4 overflow-hidden text-[13px] leading-snug text-arcio-text pointer-events-none">
        <Markdown content={preview || "Empty note"} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-arcio-muted">
        <span>{formatTimestamp(note.updatedAt)}</span>
        <span className="flex h-2 w-2 items-center justify-center">
          {recent ? <span className="inline-block h-2 w-2 rounded-full bg-arcio-danger" aria-label="Recently edited" /> : null}
        </span>
      </div>
    </button>
  );
});
