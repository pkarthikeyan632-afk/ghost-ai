import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const developmentCspPlugin: Plugin = {
  name: "local-development-csp",
  apply: "serve",
  transformIndexHtml(html) {
    const developmentPolicy =
      "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self' ws://127.0.0.1:5173; object-src 'none'; base-uri 'none'; form-action 'none'";

    return html.replace(
      /(<meta\s+http-equiv="Content-Security-Policy"\s+content=")[^"]*("\s*\/?>)/i,
      `$1${developmentPolicy}$2`,
    );
  },
};

export default defineConfig({
  plugins: [developmentCspPlugin, tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: "./",
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  test: {
    environment: "node",
  },
});