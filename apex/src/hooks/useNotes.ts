import { useMemo } from "react";

import { useStore } from "../store/useStore";
import type { Item, Note } from "../types";

export function useNotes(): Note[] {
  const items = useStore((s) => s.items);
  return useMemo(
    () =>
      items
        .filter((i): i is Note => i.type === "note")
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.updatedAt - a.updatedAt;
        }),
    [items],
  );
}
