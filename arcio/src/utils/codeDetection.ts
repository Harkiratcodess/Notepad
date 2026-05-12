/** Heuristic: 3+ non-empty lines and common code tokens. */
export function looksLikeCodeBlock(text: string): boolean {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 3) return false;
  const patterns = [/{/, /}/, /=>/, /\bdef \b/, /\bfunction\b/, /\bimport\b/, /<html/i, /\bSELECT\b/i];
  return patterns.some((re) => re.test(text));
}

export const TASK_LINE = /^(\s*)(-\s*\[)([ xX])(\]\s*)(.*)$/;
