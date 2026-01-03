import type { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { isPathWithinRoot, extractFrontmatter } from "../lib/article";
import {
  parseArticlePath,
  buildArticleEntry,
  buildTagIndex,
  type ArticleIndex,
} from "../lib/generate-index";

function generateArticleIndex(): ArticleIndex {
  const articleDir = path.join(process.cwd(), "article");
  const files = glob.sync("**/*.md", { cwd: articleDir });

  const articles = files
    .map((file) => {
      const parsed = parseArticlePath(file);
      if (!parsed) return null;

      const raw = fs.readFileSync(path.join(articleDir, file), "utf-8");
      const frontmatter = extractFrontmatter(raw);
      return buildArticleEntry(parsed, frontmatter);
    })
    .filter((entry) => entry !== null);

  return { articles, tags: buildTagIndex(articles) };
}

export function serveArticlesPlugin(): Plugin {
  return {
    name: "serve-articles",
    configureServer(server) {
      const articleRoot = path.join(process.cwd(), "article");

      server.middlewares.use((req, res, next) => {
        if (req.url === "/index.json") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(generateArticleIndex(), null, 2));
          return;
        }

        if (req.url?.endsWith(".json") && req.url !== "/index.json") {
          const mdPath = req.url.replace(/^\//, "").replace(/\.json$/, ".md");
          const resolvedPath = path.resolve(articleRoot, mdPath);

          if (!isPathWithinRoot(resolvedPath, articleRoot)) {
            res.statusCode = 400;
            res.end("Invalid article path");
            return;
          }

          if (fs.existsSync(resolvedPath)) {
            const raw = fs.readFileSync(resolvedPath, "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(extractFrontmatter(raw), null, 2));
            return;
          }
        }

        if (req.url?.endsWith(".md")) {
          const articlePath = req.url.replace(/^\//, "");
          const resolvedPath = path.resolve(articleRoot, articlePath);

          if (!isPathWithinRoot(resolvedPath, articleRoot)) {
            res.statusCode = 400;
            res.end("Invalid article path");
            return;
          }

          if (fs.existsSync(resolvedPath)) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(fs.readFileSync(resolvedPath, "utf-8"));
            return;
          }
        }

        next();
      });
    },
  };
}
