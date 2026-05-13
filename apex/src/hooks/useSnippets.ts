import { useMemo } from "react";

import { useStore } from "../store/useStore";
import type { Snippet } from "../types";

export function useSnippets(): Snippet[] {
  const items = useStore((s) => s.items);
  return useMemo(
    () =>
      items
        .filter((i): i is Snippet => i.type === "snippet")
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.updatedAt - a.updatedAt;
        }),
    [items],
  );
}
