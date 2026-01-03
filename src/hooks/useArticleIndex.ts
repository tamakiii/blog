import { useState, useEffect } from "react";
import type { ArticleIndex } from "../types/article";

export function useArticleIndex() {
  const [index, setIndex] = useState<ArticleIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("/index.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load article index");
        }
        return res.json();
      })
      .then((data: ArticleIndex) => {
        setIndex(data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { index, loading, error };
}
