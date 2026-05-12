import { useMemo } from "react";

import { useStore } from "../store/useStore";
import type { Item } from "../types";

function fuzzyMatch(query: string, haystack: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  const h = haystack.toLowerCase();
  let i = 0;
  for (const ch of q) {
    const idx = h.indexOf(ch, i);
    if (idx === -1) return false;
    i = idx + 1;
  }
  return true;
}

export function useSearch(items: Item[], query: string): Item[] {
  const trimmedQuery = useMemo(() => query.trim(), [query]);

  return useMemo(() => {
    if (!trimmedQuery) return items;
    return items.filter((item) => {
      let blob = "";
      if (item.type === "note") {
        blob = item.title + " " + item.content;
      } else {
        blob = item.filename + " " + item.code + " " + item.language;
      }
      return fuzzyMatch(trimmedQuery, blob);
    });
  }, [items, trimmedQuery]);
}

export function useFilteredItems(): Item[] {
  const items = useStore((s) => s.items);
  const activeTab = useStore((s) => s.activeTab);
  const searchQuery = useStore((s) => s.searchQuery);

  const tabbed = useMemo(() => {
    if (activeTab === "all") return items;
    if (activeTab === "notes") return items.filter((i) => i.type === "note");
    if (activeTab === "snippets") return items.filter((i) => i.type === "snippet");
    if (activeTab === "pinned") return items.filter((i) => i.pinned);
    return items;
  }, [items, activeTab]);

  return useSearch(tabbed, searchQuery);
}
