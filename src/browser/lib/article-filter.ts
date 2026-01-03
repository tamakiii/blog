import type { ArticleIndexEntry, ArticleIndex } from "../../shared/types/article";

/**
 * Filter articles by locale.
 */
export function filterByLocale(
  articles: ArticleIndexEntry[],
  locale: string | undefined
): ArticleIndexEntry[] {
  if (!locale) {
    return articles;
  }
  return articles.filter((a) => a.locale === locale);
}

/**
 * Filter articles by tag.
 */
export function filterByTag(
  articles: ArticleIndexEntry[],
  tags: Record<string, string[]>,
  tag: string | undefined
): ArticleIndexEntry[] {
  if (!tag) {
    return articles;
  }
  const articlePaths = tags[tag] || [];
  return articles.filter((a) => articlePaths.includes(a.path));
}

/**
 * Sort articles by date descending (newest first).
 */
export function sortByDateDesc(
  articles: ArticleIndexEntry[]
): ArticleIndexEntry[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  );
}

/**
 * Filter and sort articles based on locale and tag.
 */
export function filterAndSortArticles(
  index: ArticleIndex,
  locale: string | undefined,
  tag: string | undefined
): ArticleIndexEntry[] {
  let articles = index.articles;
  articles = filterByLocale(articles, locale);
  articles = filterByTag(articles, index.tags, tag);
  articles = sortByDateDesc(articles);
  return articles;
}
