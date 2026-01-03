export interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

export interface Article {
  frontmatter: ArticleFrontmatter;
  content: string;
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
