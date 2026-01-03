import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { serveArticlesPlugin } from "./src/node/vite/serve-articles";

export default defineConfig({
  plugins: [react(), serveArticlesPlugin()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared"),
      "@browser": path.resolve(__dirname, "src/browser"),
      "@node": path.resolve(__dirname, "src/node"),
    },
  },
  base: "/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
