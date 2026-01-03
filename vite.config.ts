import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

interface ArticleFrontmatter {
  title: string;
  date: string;
  tags: string[];
  description: string;
}

interface ArticleEntry {
  path: string;
  locale: string;
  year: string;
  date: string;
  slug: string;
  frontmatter: ArticleFrontmatter;
}

function generateArticleIndex() {
  const articleDir = path.join(process.cwd(), "article");
  const files = glob.sync("**/*.md", { cwd: articleDir });

  const articles: ArticleEntry[] = [];
  const tags: Record<string, string[]> = {};

  for (const file of files) {
    const filePath = path.join(articleDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    const parts = file.split("/");
    if (parts.length !== 4) continue;

    const [locale, year, date, filename] = parts;
    const slug = filename.replace(".md", "");
    const articlePath = `/${locale}/${year}/${date}/${slug}`;

    const entry = {
      path: articlePath,
      locale,
      year,
      date,
      slug,
      frontmatter: {
        title: data.title || slug,
        date: data.date || "",
        tags: data.tags || [],
        description: data.description || "",
      },
    };

    articles.push(entry);

    for (const tag of entry.frontmatter.tags) {
      if (!tags[tag]) tags[tag] = [];
      tags[tag].push(articlePath);
    }
  }

  return { articles, tags };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-articles",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Serve article index.json dynamically in dev mode
          if (req.url === "/index.json") {
            const index = generateArticleIndex();
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(index, null, 2));
            return;
          }

          // Serve frontmatter JSON files dynamically in dev mode
          if (req.url?.endsWith(".json") && req.url !== "/index.json") {
            const jsonPath = req.url.replace(/^\//, "");
            const mdPath = jsonPath.replace(/\.json$/, ".md");
            const articleRoot = path.join(process.cwd(), "article");
            const resolvedPath = path.resolve(articleRoot, mdPath);

            // Prevent path traversal attacks
            if (!resolvedPath.startsWith(articleRoot + path.sep)) {
              res.statusCode = 400;
              res.end("Invalid article path");
              return;
            }

            if (fs.existsSync(resolvedPath)) {
              const raw = fs.readFileSync(resolvedPath, "utf-8");
              const { data } = matter(raw);
              const frontmatterJson = {
                title: data.title || "",
                date: data.date || "",
                tags: data.tags,
                description: data.description,
              };
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(frontmatterJson, null, 2));
              return;
            }
          }

          // Serve markdown files from ./article/* in dev mode
          if (req.url?.endsWith(".md")) {
            const articlePath = req.url.replace(/^\//, "");
            const articleRoot = path.join(process.cwd(), "article");
            const resolvedPath = path.resolve(articleRoot, articlePath);

            // Prevent path traversal attacks
            if (!resolvedPath.startsWith(articleRoot + path.sep)) {
              res.statusCode = 400;
              res.end("Invalid article path");
              return;
            }

            if (fs.existsSync(resolvedPath)) {
              const content = fs.readFileSync(resolvedPath, "utf-8");
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              res.end(content);
              return;
            }
          }
          next();
        });
      },
    },
  ],
  base: "/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
