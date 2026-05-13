import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { NoteCard } from "../components/Cards/NoteCard";
import { SnippetCard } from "../components/Cards/SnippetCard";
import { NoteEditor } from "../components/Editor/NoteEditor";
import { SnippetEditor } from "../components/Editor/SnippetEditor";
import { StatusBar } from "../components/Layout/StatusBar";
import { TabBar } from "../components/Layout/TabBar";
import { MenuBar } from "../components/Layout/MenuBar";
import { SnippetExpandModal } from "../components/UI/SnippetExpandModal";
import { Toast } from "../components/UI/Toast";
import { useFilteredItems } from "../hooks/useSearch";
import { useStore } from "../store/useStore";
import type { Snippet } from "../types";

export function Popup() {
  const loadItems = useStore((s) => s.loadItems);
  const theme = useStore((s) => s.theme);
  const items = useStore((s) => s.items);
  const activeItemId = useStore((s) => s.activeItemId);
  const setActiveItem = useStore((s) => s.setActiveItem);
  const createNote = useStore((s) => s.createNote);
  const createSnippet = useStore((s) => s.createSnippet);

  const filtered = useFilteredItems();
  const [searchOpen, setSearchOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [expandId, setExpandId] = useState<string | null>(null);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  }, [theme]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const active = items.find((i) => i.id === activeItemId) ?? null;
  const expandSnippet: Snippet | null = expandId
    ? items.find((i): i is Snippet => i.id === expandId && i.type === "snippet") ?? null
    : null;

  const inEditor = !!active && (active.type === "note" || active.type === "snippet");

  return (
    <div className="relative h-full w-full overflow-hidden border-2 border-arcio-border bg-arcio-bg font-ui shadow-none">
      <div className="notepad-bg flex h-full flex-col">
        <div className="flex w-full flex-col h-full">
          <MenuBar
            onToggleSearch={() => setSearchOpen((v) => !v)}
          />
          <TabBar />

          <main className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-14">
              {filtered.length === 0 ? (
                <div className="border-2 border-dashed border-arcio-border p-8 text-center text-[14px] text-arcio-muted bg-arcio-surface">
                  Nothing here yet. Tap + to create a note or snippet.
                </div>
              ) : (
                filtered.map((item) =>
                  item.type === "note" ? (
                    <NoteCard key={item.id} note={item} onOpen={(id) => setActiveItem(id)} />
                  ) : (
                    <SnippetCard
                      key={item.id}
                      snippet={item}
                      onOpen={(id) => setActiveItem(id)}
                      onExpand={(id) => setExpandId(id)}
                      onCopy={async (code) => {
                        try {
                          await navigator.clipboard.writeText(code);
                        } catch {
                          /* ignore */
                        }
                        setToast("Copied!");
                      }}
                    />
                  ),
                )
              )}
            </div>
          </main>

          <StatusBar visibleCount={filtered.length} inEditor={inEditor} />

          <button
            type="button"
            onClick={() => setFabOpen(true)}
            className="brutal-border brutal-shadow absolute bottom-12 right-6 z-20 flex h-14 w-14 items-center justify-center bg-arcio-accent text-arcio-text hover:opacity-95"
            style={{ borderRadius: "var(--radius)" }}
            aria-label="Create"
          >
            <Plus className="h-7 w-7 stroke-[3]" />
          </button>
        </div>
      </div>

      {fabOpen ? (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/30 p-3 font-ui">
          <div
            className="brutal-border brutal-shadow w-full max-w-sm border-arcio-border bg-arcio-surface p-3"
            style={{ borderRadius: "8px" }}
          >
            <div className="mb-2 text-[15px] font-bold text-arcio-text">Create</div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="brutal-border bg-arcio-accent py-2 text-[13px] font-semibold text-arcio-text hover:opacity-90"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => {
                  setFabOpen(false);
                  void createNote();
                }}
              >
                New note
              </button>
              <button
                type="button"
                className="brutal-border bg-arcio-surface py-2 text-[13px] font-semibold text-arcio-text hover:bg-arcio-accent"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => {
                  setFabOpen(false);
                  void createSnippet();
                }}
              >
                New snippet
              </button>
              <button
                type="button"
                className="brutal-border py-2 text-[12px] text-arcio-muted hover:bg-arcio-accent hover:text-arcio-text"
                style={{ borderRadius: "var(--radius)" }}
                onClick={() => setFabOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {active?.type === "note" ? <NoteEditor note={active} onClose={() => setActiveItem(null)} /> : null}
      {active?.type === "snippet" ? (
        <SnippetEditor
          snippet={active}
          onClose={() => setActiveItem(null)}
          onCopied={() => setToast("Copied!")}
        />
      ) : null}

      {expandSnippet ? <SnippetExpandModal snippet={expandSnippet} onClose={() => setExpandId(null)} /> : null}

      {toast ? <Toast message={toast} onDone={() => setToast(null)} /> : null}
    </div>
  );
}
