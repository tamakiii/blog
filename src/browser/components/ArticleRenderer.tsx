import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useArticle } from "../hooks/useArticle";
import TagLink from "./TagLink";

export default function ArticleRenderer() {
  const location = useLocation();
  const { article, loading, error } = useArticle(location.pathname);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error || !article) {
    return <div className="error">Article not found</div>;
  }

  return (
    <article className="article">
      <header className="article-header">
        <h1>{article.frontmatter.title}</h1>
        <time dateTime={article.frontmatter.date}>
          {article.frontmatter.date}
        </time>
        {article.frontmatter.tags && article.frontmatter.tags.length > 0 && (
          <div className="tags">
            {article.frontmatter.tags.map((tag) => (
              <TagLink key={tag} tag={tag} />
            ))}
          </div>
        )}
      </header>
      <div className="article-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
