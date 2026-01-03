import { useState, useEffect } from "react";
import { parseFrontmatter } from "../utils/frontmatter";
import type { Article } from "../types/article";

export function useArticle(articlePath: string) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!articlePath) {
      setLoading(false);
      return;
    }

    // Convert path like /en_US/2026/01-03/hello to /articles/en_US/2026/01-03/hello.md
    const cleanPath = articlePath.replace(/^\//, "").replace(/\/$/, "");
    const mdPath = `/articles/${cleanPath}.md`;

    setLoading(true);
    setError(null);

    fetch(mdPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Article not found: ${mdPath}`);
        }
        return res.text();
      })
      .then((raw) => {
        const { frontmatter, content } = parseFrontmatter(raw);
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
