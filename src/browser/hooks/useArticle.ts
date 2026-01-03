import { useState, useEffect } from "react";
import type { Article, ArticleFrontmatter } from "@shared/article";

function toFilePath(articlePath: string, extension: string): string {
  const cleanPath = articlePath.replace(/^\//, "").replace(/\/$/, "");
  return `/${cleanPath}.${extension}`;
}

function stripFrontmatter(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
}

export function useArticle(articlePath: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!articlePath) {
      setLoading(false);
      return;
    }

    const jsonPath = toFilePath(articlePath, "json");
    const mdPath = toFilePath(articlePath, "md");

    setLoading(true);
    setError(null);

    Promise.all([
      fetch(jsonPath).then((res) => {
        if (!res.ok) throw new Error(`Frontmatter not found: ${jsonPath}`);
        return res.json() as Promise<ArticleFrontmatter>;
      }),
      fetch(mdPath).then((res) => {
        if (!res.ok) throw new Error(`Article not found: ${mdPath}`);
        return res.text();
      }),
    ])
      .then(([frontmatter, rawContent]) => {
        const content = stripFrontmatter(rawContent);
        setArticle({ frontmatter, content });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [articlePath]);

  return { article, loading, error };
}
