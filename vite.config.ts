import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { serveArticlesPlugin } from "./src/vite/serve-articles";

export default defineConfig({
  plugins: [react(), serveArticlesPlugin()],
  base: "/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
