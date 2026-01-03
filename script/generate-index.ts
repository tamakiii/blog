import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

export interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

export interface ParsedArticlePath {
  locale: string;
  year: string;
  date: string;
  slug: string;
}

export interface ArticleIndexEntry {
  path: string;
  locale: string;
  year: string;
  date: string;
  slug: string;
  frontmatter: ArticleFrontmatter;
}

export interface ArticleIndex {
  articles: ArticleIndexEntry[];
  tags: Record<string, string[]>;
}

/**
 * Parse article file path into components.
 * Expected format: {locale}/{year}/{date}/{slug}.md
 */
export function parseArticlePath(file: string): ParsedArticlePath | null {
  const parts = file.split("/");
  if (parts.length !== 4) {
    return null;
  }

  const [locale, year, date, filename] = parts;
  const slug = filename.replace(".md", "");

  return { locale, year, date, slug };
}

/**
 * Build an article index entry from parsed path and frontmatter data.
 */
export function buildArticleEntry(
  parsed: ParsedArticlePath,
  data: Record<string, unknown>
): ArticleIndexEntry {
  const { locale, year, date, slug } = parsed;
  const articlePath = `/${locale}/${year}/${date}/${slug}`;

  const frontmatter: ArticleFrontmatter = {
    title: (data.title as string) || slug,
    date: (data.date as string) || `${year}-${date}`,
    tags: (data.tags as string[]) || [],
    description: (data.description as string) || "",
  };

  return {
    path: articlePath,
    locale,
    year,
    date,
    slug,
    frontmatter,
  };
}

/**
 * Build tag index from articles.
 */
export function buildTagIndex(
  articles: ArticleIndexEntry[]
): Record<string, string[]> {
  const tags: Record<string, string[]> = {};

  for (const article of articles) {
    for (const tag of article.frontmatter.tags || []) {
      if (!tags[tag]) {
        tags[tag] = [];
      }
      tags[tag].push(article.path);
    }
  }

  return tags;
}

const ARTICLE_DIR = "./article";
const OUTPUT_DIR = "./docs";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.json");

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
  console.log(`Tags: ${Object.keys(index.tags).join(", ") || "(none)"}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

// Only run main when executed directly, not when imported for tests
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
