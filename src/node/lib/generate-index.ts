import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";
import type {
  ArticleFrontmatter,
  ParsedArticlePath,
  ArticleIndexEntry,
  ArticleIndex,
} from "@shared/article";

// Re-export types for convenience
export type { ArticleFrontmatter, ParsedArticlePath, ArticleIndexEntry, ArticleIndex };

export interface GenerateIndexOptions {
  articleDir: string;
  outputDir: string;
}

export interface GenerateIndexResult {
  index: ArticleIndex;
  articlesCount: number;
  tags: string[];
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
  data: ArticleFrontmatter | Record<string, unknown>
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

/**
 * Generate article index and individual frontmatter JSON files.
 */
export async function generateIndex(
  options: GenerateIndexOptions
): Promise<GenerateIndexResult> {
  const { articleDir, outputDir } = options;
  const articles: ArticleIndexEntry[] = [];

  const files = await glob("**/*.md", { cwd: articleDir });

  for (const file of files) {
    const parsed = parseArticlePath(file);
    if (!parsed) {
      console.warn(`Skipping ${file}: unexpected path structure`);
      continue;
    }

    const filePath = path.join(articleDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    const entry = buildArticleEntry(parsed, data);
    articles.push(entry);

    // Generate individual JSON file for frontmatter
    const jsonPath = file.replace(/\.md$/, ".json");
    const jsonOutputPath = path.join(outputDir, jsonPath);
    const jsonData: ArticleFrontmatter = {
      title: (data.title as string) || "",
      date: (data.date as string) || "",
      tags: data.tags as string[] | undefined,
      description: data.description as string | undefined,
    };

    fs.mkdirSync(path.dirname(jsonOutputPath), { recursive: true });
    fs.writeFileSync(jsonOutputPath, JSON.stringify(jsonData, null, 2));
  }

  const tags = buildTagIndex(articles);
  const index: ArticleIndex = { articles, tags };

  return {
    index,
    articlesCount: articles.length,
    tags: Object.keys(tags),
  };
}

/**
 * Write the article index to a JSON file.
 */
export function writeIndex(index: ArticleIndex, outputPath: string): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
}
