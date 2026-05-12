import { Pin } from "lucide-react";

import type { Note } from "../../types";
import { formatTimestamp } from "../../utils/formatDate";
import { Badge } from "../UI/Badge";

export function NoteCard({ note, onOpen }: { note: Note; onOpen: (id: string) => void }) {
  const recent = Date.now() - note.updatedAt < 60 * 60 * 1000;
  const preview = note.content.replace(/\r\n/g, "\n").trim();

  return (
    <button
      type="button"
      onClick={() => onOpen(note.id)}
      className="brutal-border brutal-shadow w-full bg-arcio-surface p-3 text-left font-ui hover:bg-arcio-accent"
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge variant="neutral">Note</Badge>
        {note.pinned ? <Pin className="h-4 w-4 shrink-0 text-arcio-text" aria-label="Pinned" /> : <span className="h-4 w-4" />}
      </div>
      <div className="mb-1 text-[15px] font-bold leading-snug text-arcio-text">{note.title || "Untitled note"}</div>
      <p className="line-clamp-3 whitespace-pre-wrap text-[13px] leading-snug text-arcio-text">{preview || "Empty note"}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-arcio-muted">
        <span>{formatTimestamp(note.updatedAt)}</span>
        <span className="flex h-2 w-2 items-center justify-center">
          {recent ? <span className="inline-block h-2 w-2 rounded-full bg-arcio-danger" aria-label="Recently edited" /> : null}
        </span>
      </div>
    </button>
  );
}
