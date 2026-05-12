import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

/** Vite adds crossorigin to module scripts / CSS; that can block loads on chrome-extension:// URLs. */
function stripCrossorigin(): Plugin {
  return {
    name: "arcio-strip-crossorigin",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html) {
        return html.replace(
          /\s+crossorigin(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?/gi,
          "",
        );
      },
    },
  };
}

export default defineConfig({
  // Root-absolute "/..." URLs break Chrome extension popups; use relative asset URLs.
  base: "./",
  plugins: [
    react(),
    stripCrossorigin(),
    webExtension({
      manifest: () => readJsonFile("public/manifest.json"),
      disableAutoLaunch: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "public/icons/*.png",
          dest: "icons",
        },
      ],
    }),
  ],
});
