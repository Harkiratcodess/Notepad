import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { useStore } from "../../store/useStore";

export function SearchBar({
  expanded,
  onClose,
}: {
  expanded: boolean;
  onClose: () => void;
}) {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus();
    }
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, onClose]);

  if (!expanded) return null;

  return (
    <div className="flex flex-1 items-center gap-2">
      <Search className="h-4 w-4 shrink-0 text-arcio-muted" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="min-w-0 flex-1 border-2 border-arcio-border bg-arcio-surface px-2 py-1 font-ui text-[13px] text-arcio-text outline-none"
        style={{ borderRadius: "var(--radius)" }}
      />
      <button
        type="button"
        onClick={onClose}
        className="brutal-border brutal-shadow flex h-8 w-8 shrink-0 items-center justify-center bg-arcio-surface text-arcio-text hover:bg-arcio-accent"
        style={{ borderRadius: "var(--radius)" }}
        aria-label="Close search"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
