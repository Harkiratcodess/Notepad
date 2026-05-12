export type ItemType = "note" | "snippet";

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "html"
  | "css"
  | "json"
  | "bash"
  | "sql"
  | "rust"
  | "go"
  | "java"
  | "cpp"
  | "plaintext";

export interface Note {
  id: string;
  type: "note";
  title: string;
  content: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Snippet {
  id: string;
  type: "snippet";
  filename: string;
  language: Language;
  code: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type Item = Note | Snippet;

export type TabView = "all" | "notes" | "snippets";

export interface AppState {
  items: Item[];
  activeTab: TabView;
  searchQuery: string;
  theme: "light" | "dark";
  activeItemId: string | null;
}
