import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}", "./src/popup/index.html"],
  theme: {
    extend: {
      fontFamily: {
        ui: ["var(--font-ui)", "monospace"],
        code: ["var(--font-code)", "monospace"],
      },
      boxShadow: {
        brutal: "var(--shadow)",
      },
      colors: {
        arcio: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          border: "var(--border)",
          accent: "var(--accent)",
          green: "var(--accent-green)",
          danger: "var(--danger)",
          text: "var(--text)",
          muted: "var(--text-muted)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
