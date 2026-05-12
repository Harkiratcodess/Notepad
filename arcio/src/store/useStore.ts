import { create } from "zustand";

import type { AppState, Item, Note, Snippet, TabView } from "../types";
import { detectLanguage } from "../utils/detectLanguage";
import * as storage from "../utils/storage";

interface Store extends AppState {
  setActiveTab: (tab: TabView) => void;
  setSearchQuery: (q: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  setActiveItem: (id: string | null) => void;
  loadItems: () => Promise<void>;
  createNote: (title?: string) => Promise<void>;
  createSnippet: (filename?: string) => Promise<void>;
  updateItem: (id: string, changes: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  convertNoteToSnippet: (noteId: string, filename: string) => Promise<void>;
}

const initial: AppState = {
  items: [],
  activeTab: "all",
  searchQuery: "",
  theme: "light",
  activeItemId: null,
};

export const useStore = create<Store>((set, get) => ({
  ...initial,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setTheme: (theme) => {
    set({ theme });
    void storage.saveTheme(theme);
  },
  setActiveItem: (id) => set({ activeItemId: id }),

  loadItems: async () => {
    const [items, theme] = await Promise.all([storage.getItems(), storage.getTheme()]);
    set({ items, theme });
  },

  createNote: async (title) => {
    const now = Date.now();
    const note: Note = {
      id: crypto.randomUUID(),
      type: "note",
      title: title?.trim() || "Untitled note",
      content: "",
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    const next = [note, ...get().items];
    await storage.persistAllItems(next);
    set({ items: next, activeItemId: note.id });
  },

  createSnippet: async (filename) => {
    const now = Date.now();
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      type: "snippet",
      filename: filename?.trim() || "snippet.txt",
      language: "plaintext",
      code: "",
      pinned: false,
      createdAt: now,
      updatedAt: now,
    };
    const next = [snippet, ...get().items];
    await storage.persistAllItems(next);
    set({ items: next, activeItemId: snippet.id });
  },

  updateItem: async (id, changes) => {
    const next = get().items.map((i) => {
      if (i.id !== id) return i;
      return { ...i, ...changes, updatedAt: Date.now() } as Item;
    });
    await storage.persistAllItems(next);
    set({ items: next });
  },

  deleteItem: async (id) => {
    const next = get().items.filter((i) => i.id !== id);
    await storage.persistAllItems(next);
    set((s) => ({
      items: next,
      activeItemId: s.activeItemId === id ? null : s.activeItemId,
    }));
  },

  togglePin: async (id) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    await get().updateItem(id, { pinned: !item.pinned });
  },

  convertNoteToSnippet: async (noteId, filename) => {
    const note = get().items.find((i) => i.id === noteId && i.type === "note") as Note | undefined;
    if (!note) return;
    const language = detectLanguage(note.content);
    const snippet: Snippet = {
      id: crypto.randomUUID(),
      type: "snippet",
      filename: filename.trim() || "snippet.txt",
      language,
      code: note.content,
      pinned: note.pinned,
      createdAt: note.createdAt,
      updatedAt: Date.now(),
    };
    const next = [snippet, ...get().items.filter((i) => i.id !== noteId)];
    await storage.persistAllItems(next);
    set({ items: next, activeItemId: snippet.id });
  },
}));
