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
    <nav className="flex h-10 shrink-0 gap-1 border-b-2 border-arcio-border bg-arcio-bg px-2 py-1">
      {TABS.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`brutal-border flex-1 px-2 py-1 font-ui text-[12px] font-semibold ${
              active ? "bg-arcio-accent text-arcio-text" : "bg-arcio-surface text-arcio-text hover:bg-arcio-accent"
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
