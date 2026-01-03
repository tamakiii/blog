import path from "path";
import matter from "gray-matter";
import type { ArticleFrontmatter } from "../script/generate-index";

/**
 * Check if a resolved path is within the allowed root directory.
 * Used to prevent path traversal attacks.
 */
export function isPathWithinRoot(resolvedPath: string, root: string): boolean {
  return resolvedPath.startsWith(root + path.sep);
}

/**
 * Extract frontmatter from raw markdown content using gray-matter.
 */
export function extractFrontmatter(raw: string): ArticleFrontmatter {
  const { data } = matter(raw);
  return {
    title: (data.title as string) || "",
    date: (data.date as string) || "",
    tags: data.tags as string[] | undefined,
    description: data.description as string | undefined,
  };
}
