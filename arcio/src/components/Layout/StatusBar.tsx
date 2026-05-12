import { useStore } from "../../store/useStore";
import { countWords } from "../../utils/formatDate";

type Props = {
  visibleCount: number;
  inEditor: boolean;
};

export function StatusBar({ visibleCount, inEditor }: Props) {
  const items = useStore((s) => s.items);
  const activeItemId = useStore((s) => s.activeItemId);

  const active = items.find((i) => i.id === activeItemId);
  const charCount =
    active?.type === "note"
      ? active.title.length + active.content.length
      : active?.type === "snippet"
        ? active.code.length + active.filename.length
        : 0;
  const wordCount = active?.type === "note" ? countWords(active.content) : 0;

  const rightLabel = active?.type === "snippet" ? active.language.toUpperCase() : "Plain Text";

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between border-t-2 border-arcio-border bg-arcio-surface px-2 font-ui text-[11px] text-arcio-muted">
      <span>
        {visibleCount} items
        {active && inEditor ? (
          <>
            {" "}
            · {charCount.toLocaleString()} chars
            {active.type === "note" ? (
              <>
                {" "}
                · {wordCount} words
              </>
            ) : null}
          </>
        ) : null}
      </span>
      <span className="flex gap-2">
        <span>UTF-8</span>
        <span>{rightLabel}</span>
      </span>
    </footer>
  );
}
