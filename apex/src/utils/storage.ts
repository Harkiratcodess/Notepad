import type { Item } from "../types";

const ITEMS_KEY = "arcio_items";
const THEME_KEY = "arcio_theme";
const IDB_NAME = "arcio_db";
const IDB_STORE = "kv";
const IDB_VERSION = 1;

function hasChromeStorage(): boolean {
  try {
    return (
      typeof chrome !== "undefined" &&
      !!chrome.storage?.local?.get &&
      !!chrome.storage?.local?.set
    );
  } catch {
    return false;
  }
}

function openIdb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet<T>(key: string): Promise<T | undefined> {
  const db = await openIdb();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const r = tx.objectStore(IDB_STORE).get(key);
      r.onsuccess = () => resolve(r.result as T | undefined);
      r.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

async function idbSet(key: string, value: unknown): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getItems(): Promise<Item[]> {
  try {
    if (hasChromeStorage()) {
      const res = await chrome.storage.local.get(ITEMS_KEY);
      const raw = res[ITEMS_KEY];
      if (Array.isArray(raw)) return raw as Item[];
    }
  } catch {
    /* fall through */
  }
  try {
    const fallback = await idbGet<Item[]>(ITEMS_KEY);
    if (Array.isArray(fallback)) return fallback;
  } catch {
    /* ignore */
  }
  return [];
}

export async function saveItem(item: Item): Promise<void> {
  try {
    const items = await getItems();
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.unshift(item);
    await persistAllItems(items);
  } catch {
    /* never throw */
  }
}

export async function deleteItem(id: string): Promise<void> {
  try {
    const items = (await getItems()).filter((i) => i.id !== id);
    await persistAllItems(items);
  } catch {
    /* never throw */
  }
}

export async function getTheme(): Promise<"light" | "dark"> {
  try {
    if (hasChromeStorage()) {
      const res = await chrome.storage.local.get(THEME_KEY);
      const t = res[THEME_KEY];
      if (t === "dark" || t === "light") return t;
    }
  } catch {
    /* fall through */
  }
  try {
    const t = await idbGet<"light" | "dark">(THEME_KEY);
    if (t === "dark" || t === "light") return t;
  } catch {
    /* ignore */
  }
  return "light";
}

export async function saveTheme(theme: "light" | "dark"): Promise<void> {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [THEME_KEY]: theme });
    }
    await idbSet(THEME_KEY, theme);
  } catch {
    /* never throw */
  }
}

export async function persistAllItems(items: Item[]): Promise<void> {
  try {
    if (hasChromeStorage()) {
      await chrome.storage.local.set({ [ITEMS_KEY]: items });
    }
    await idbSet(ITEMS_KEY, items);
  } catch {
    /* never throw */
  }
}
