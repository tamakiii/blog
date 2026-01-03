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
