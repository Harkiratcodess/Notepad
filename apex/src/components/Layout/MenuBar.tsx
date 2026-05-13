import { Moon, Search, Sun, FileCode, FileText, Trash2, Copy, RefreshCw } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "../../store/useStore";

type Props = {
  onToggleSearch: () => void;
};

interface MenuAction {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  disabled?: boolean;
  shortcut?: string;
}

interface MenuItem {
  label: string;
  actions: MenuAction[];
}

export function MenuBar({ onToggleSearch }: Props) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const activeTab = useStore((s) => s.activeTab);
  const setActiveTab = useStore((s) => s.setActiveTab);
  const createNote = useStore((s) => s.createNote);
  const createSnippet = useStore((s) => s.createSnippet);
  const loadItems = useStore((s) => s.loadItems);
  const deleteItem = useStore((s) => s.deleteItem);
  const activeItemId = useStore((s) => s.activeItemId);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      
      const key = e.key.toLowerCase();
      if (key === "n") {
        e.preventDefault();
        void createNote();
      } else if (key === "s") {
        e.preventDefault();
        void createSnippet();
      } else if (key === "r") {
        e.preventDefault();
        void loadItems();
      }
    };
    
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [createNote, createSnippet, loadItems]);

  const menuItems: MenuItem[] = [
    {
      label: "File",
      actions: [
        { label: "New Note", icon: <FileText className="h-3.5 w-3.5" />, onClick: () => { void createNote(); }, shortcut: "Alt+N" },
        { label: "New Snippet", icon: <FileCode className="h-3.5 w-3.5" />, onClick: () => { void createSnippet(); }, shortcut: "Alt+S" },
      ],
    },
    {
      label: "Edit",
      actions: [
        { 
          label: "Delete Active", 
          icon: <Trash2 className="h-3.5 w-3.5" />, 
          onClick: () => { if (activeItemId) void deleteItem(activeItemId); },
          disabled: !activeItemId 
        },
        { label: "Refresh All", icon: <RefreshCw className="h-3.5 w-3.5" />, onClick: () => { void loadItems(); }, shortcut: "Alt+R" },
      ],
    },
    {
      label: "View",
      actions: [
        { label: "Toggle Theme", icon: theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />, onClick: () => setTheme(theme === "dark" ? "light" : "dark") },
      ],
    },
    { label: "Help", actions: [] },
  ];

  return (
    <div className="flex h-16 shrink-0 items-center border-b-2 border-arcio-border bg-arcio-surface px-4 font-ui">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 pr-6 border-r-2 border-arcio-border/10">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          <span className="text-[22px] font-black tracking-tighter text-arcio-text leading-none">Apexnote</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-5" ref={menuRef}>
          {menuItems.map((menu) => (
            <div key={menu.label} className="relative">
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                className={`text-[13px] font-medium transition-colors ${activeMenu === menu.label ? "text-arcio-accent" : "text-arcio-text hover:text-arcio-accent"}`}
              >
                {menu.label}
              </button>
              
              {activeMenu === menu.label && menu.actions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-48 brutal-border bg-arcio-surface shadow-[4px_4px_0px_var(--border)] z-50 py-1">
                  {menu.actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      disabled={action.disabled}
                      onClick={() => {
                        action.onClick();
                        setActiveMenu(null);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-[12px] font-medium transition-colors ${action.disabled ? "opacity-30 cursor-not-allowed" : "text-arcio-text hover:bg-arcio-accent"}`}
                    >
                      <div className="flex items-center gap-3">
                        {action.icon}
                        <span>{action.label}</span>
                      </div>
                      {action.shortcut && (
                        <span className="text-[10px] text-arcio-muted ml-4 font-mono">{action.shortcut}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="h-4 w-[2px] bg-arcio-border/20 mx-2 hidden sm:block" />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("snippets")}
            className={`text-[13px] font-bold ${activeTab === "snippets" ? "text-arcio-accent underline underline-offset-4 decoration-2" : "text-arcio-text/60 hover:text-arcio-text"}`}
          >
            Snippet
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`text-[13px] font-bold ${activeTab === "all" ? "text-arcio-accent underline underline-offset-4 decoration-2" : "text-arcio-text/60 hover:text-arcio-text"}`}
          >
            All Items
          </button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative group">
          <button
            type="button"
            onClick={onToggleSearch}
            className="flex items-center gap-2 px-3 py-1 brutal-border bg-arcio-bg hover:bg-arcio-accent transition-all"
            style={{ borderRadius: "var(--radius)" }}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[11px] text-arcio-muted hidden lg:inline">Search...</span>
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent shadow-[2px_2px_0px_var(--border)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          style={{ borderRadius: "var(--radius)" }}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
