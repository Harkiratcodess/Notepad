import { useStore } from "../../store/useStore";
import type { TabView } from "../../types";

const TABS: { id: TabView; label: string }[] = [
  { id: "all", label: "All Items" },
  { id: "notes", label: "Notes" },
  { id: "snippets", label: "Snippets" },
];

export function TabBar() {
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);

  return (
    <nav className="flex h-12 shrink-0 items-center justify-center gap-2 border-b-2 border-arcio-border bg-arcio-bg px-4">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`brutal-border min-w-[120px] px-6 py-1.5 font-ui text-[13px] font-bold transition-all ${
              active 
                ? "bg-arcio-accent text-arcio-text shadow-[3px_3px_0px_var(--border)] -translate-x-[1px] -translate-y-[1px]" 
                : "bg-arcio-surface text-arcio-text hover:bg-arcio-accent"
            }`}
            style={{ borderRadius: "var(--radius)" }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
