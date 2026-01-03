import { useState, useEffect } from "react";
import { parseFrontmatter, toMarkdownPath } from "../lib/frontmatter";
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

    const mdPath = toMarkdownPath(articlePath);

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
