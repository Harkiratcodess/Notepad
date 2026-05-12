import { useMemo } from "react";

import { useStore } from "../store/useStore";
import type { Item } from "../types";

function fuzzyMatch(query: string, haystack: string): boolean {
  if (!query.trim()) return true;
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

function itemSearchBlob(item: Item): string {
  if (item.type === "note") {
    return `${item.title}\n${item.content}`;
  }
  return `${item.filename}\n${item.code}\n${item.language}`;
}

export function useSearch(items: Item[], query: string): Item[] {
  return useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((item) => fuzzyMatch(query, itemSearchBlob(item)));
  }, [items, query]);
}

export function useFilteredItems(): Item[] {
  const items = useStore((s) => s.items);
  const activeTab = useStore((s) => s.activeTab);
  const searchQuery = useStore((s) => s.searchQuery);

  const tabbed = useMemo(() => {
    if (activeTab === "notes") return items.filter((i) => i.type === "note");
    if (activeTab === "snippets") return items.filter((i) => i.type === "snippet");
    return items;
  }, [items, activeTab]);

  return useSearch(tabbed, searchQuery);
}
