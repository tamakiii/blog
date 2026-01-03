import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import {
  parseArticlePath,
  buildArticleEntry,
  buildTagIndex,
  type ArticleIndex,
  type ArticleIndexEntry,
} from "../src/script/generate-index";

const ARTICLE_DIR = "./article";
const OUTPUT_DIR = "./docs";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.json");

interface ArticleFrontmatterJson {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

async function generateIndex(): Promise<ArticleIndex> {
  const articles: ArticleIndexEntry[] = [];

  // Find all markdown files
  const files = await glob("**/*.md", { cwd: ARTICLE_DIR });

  for (const file of files) {
    const parsed = parseArticlePath(file);
    if (!parsed) {
      console.warn(`Skipping ${file}: unexpected path structure`);
      continue;
    }

    const filePath = path.join(ARTICLE_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    const entry = buildArticleEntry(parsed, data);
    articles.push(entry);

    // Generate individual JSON file for frontmatter
    const jsonPath = file.replace(/\.md$/, ".json");
    const jsonOutputPath = path.join(OUTPUT_DIR, jsonPath);
    const jsonData: ArticleFrontmatterJson = {
      title: data.title || "",
      date: data.date || "",
      tags: data.tags,
      description: data.description,
    };

    // Ensure directory exists
    fs.mkdirSync(path.dirname(jsonOutputPath), { recursive: true });
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
  }

  const tags = buildTagIndex(articles);

  return { articles, tags };
}

async function main() {
  console.log("Generating article index...");

  const index = await generateIndex();

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write index file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log(`Generated index with ${index.articles.length} articles`);
  console.log(`Generated ${index.articles.length} frontmatter JSON files`);
  console.log(`Tags: ${Object.keys(index.tags).join(", ") || "(none)"}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

// Only run main when executed directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
