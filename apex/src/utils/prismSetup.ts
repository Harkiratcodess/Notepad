import Prism from "prismjs";

// Import core languages and dependencies
import "prismjs/components/prism-clike";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-c";
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

/**
 * Highlights code using PrismJS.
 * Safeguarded against missing grammars or Prism internal errors.
 */
export function highlightCode(code: string, language: Language): string {
  if (!code) return "";
  
  const grammarName = MAP[language];
  if (!grammarName) {
    return escapeHtml(code);
  }

  const grammar = Prism.languages[grammarName];
  if (!grammar) {
    console.warn(`Prism grammar not found for: ${grammarName}`);
    return escapeHtml(code);
  }

  try {
    return Prism.highlight(code, grammar, grammarName);
  } catch (err) {
    console.error("Prism highlight error:", err);
    return escapeHtml(code);
  }
}

export function prismGrammarName(language: Language): string | null {
  return MAP[language];
}
