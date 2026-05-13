import { Moon, Search, Sun } from "lucide-react";

import { useStore } from "../../store/useStore";
import { SearchBar } from "../UI/SearchBar";

type Props = {
  searchOpen: boolean;
  onToggleSearch: () => void;
  onCloseSearch: () => void;
};

export function Topbar({ searchOpen, onToggleSearch, onCloseSearch }: Props) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b-2 border-arcio-border bg-arcio-surface px-2">
      {!searchOpen ? (
        <>
          <div className="flex items-center gap-1.5 min-w-0 shrink">
            <img src="/logo.png" alt="ARCIO" className="h-6 w-6 object-contain" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleSearch}
              className="brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
              style={{ borderRadius: "var(--radius)" }}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="brutal-border flex h-8 w-8 items-center justify-center bg-arcio-surface hover:bg-arcio-accent"
              style={{ borderRadius: "var(--radius)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </>
      ) : (
        <SearchBar expanded onClose={onCloseSearch} />
      )}
    </header>
  );
}
