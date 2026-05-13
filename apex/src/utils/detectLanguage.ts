import type { Language } from "../types";

export function detectLanguage(code: string): Language {
  const s = code.trim();
  if (!s) return "plaintext";

  if (/<!DOCTYPE\s+html/i.test(s) || /<html[\s>]/i.test(s)) return "html";
  if (/@import\s+url|@media|@keyframes|\{[^}]*\}\s*$/m.test(s) && /:\s*[^;]+;/.test(s))
    return "css";
  if (/^\s*\{[\s\S]*"[^"]+"\s*:/m.test(s) || /^\s*\[[\s\S]*\]\s*$/m.test(s)) {
    try {
      JSON.parse(s);
      return "json";
    } catch {
      /* continue */
    }
  }
  if (/^\s*#!\/bin\/(ba)?sh\b/m.test(s) || (/\b(curl|grep|awk|export)\b/.test(s) && /\$\{/.test(s)))
    return "bash";
  if (/\bSELECT\b[\s\S]+\bFROM\b/i.test(s) && /\b(WHERE|JOIN|GROUP BY)\b/i.test(s))
    return "sql";
  if (/\bfn\s+main\s*\(\)/.test(s) || /\blet\s+mut\s+/.test(s) || /\bimpl\s+/.test(s))
    return "rust";
  if (/^\s*package\s+\w+/m.test(s) && /\bfunc\s+/.test(s)) return "go";
  if (/\bpublic\s+static\s+void\s+main\s*\(/.test(s) || /\bSystem\.out\.println\b/.test(s))
    return "java";
  if (/#include\s*</.test(s) || /\bstd::\w+/.test(s)) return "cpp";
  if (/^\s*def\s+\w+\s*\(/.test(s) || /:\s*$/m.test(s) && /\bprint\s*\(/.test(s)) return "python";
  if (
    /:\s*(string|number|boolean|void|any)\b/.test(s) ||
    /\binterface\s+\w+/.test(s) ||
    /\btype\s+\w+\s*=/.test(s)
  )
    return "typescript";
  if (
    /\b(const|let|var)\s+\w+/.test(s) ||
    /=>\s*{?/.test(s) ||
    /\bfunction\s+\w*\s*\(/.test(s) ||
    /\bimport\s+.*\bfrom\b/.test(s) ||
    /\bconsole\.(log|error)\b/.test(s)
  )
    return "javascript";

  return "plaintext";
}
