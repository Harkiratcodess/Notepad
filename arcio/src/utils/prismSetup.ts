import Prism from "prismjs";

import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-java";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";

import type { Language } from "../types";

const MAP: Record<Language, string | null> = {
  html: "markup",
  css: "css",
  javascript: "javascript",
  typescript: "typescript",
  json: "json",
  bash: "bash",
  sql: "sql",
  rust: "rust",
  go: "go",
  java: "java",
  cpp: "cpp",
  python: "python",
  plaintext: null,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightCode(code: string, language: Language): string {
  const grammar = MAP[language];
  if (!grammar || !Prism.languages[grammar]) {
    return escapeHtml(code);
  }
  return Prism.highlight(code, Prism.languages[grammar]!, grammar);
}

export function prismGrammarName(language: Language): string | null {
  return MAP[language];
}
