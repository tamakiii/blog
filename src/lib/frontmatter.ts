import type { ArticleFrontmatter } from "../types/article";

/**
 * Browser-compatible frontmatter parser.
 * Parses YAML-like frontmatter from markdown content.
 */
export function parseFrontmatter(content: string): {
  frontmatter: ArticleFrontmatter;
  content: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: { title: "", date: "" },
      content,
    };
  }

  const yamlContent = match[1];
  const markdownContent = match[2];

  // Use a Record to build the frontmatter dynamically
  const data: Record<string, unknown> = {};

  let currentKey = "";
  let inArray = false;
  const arrayValues: string[] = [];

  for (const line of yamlContent.split("\n")) {
    // Check for array item (starts with "  - ")
    if (line.match(/^\s+-\s+/)) {
      const value = line.replace(/^\s+-\s+/, "").trim();
      arrayValues.push(value);
      continue;
    }

    // If we were collecting array values, save them
    if (inArray && currentKey) {
      data[currentKey] = [...arrayValues];
      arrayValues.length = 0;
      inArray = false;
    }

    // Check for key: value pair
    const colonIndex = line.indexOf(":");
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      currentKey = key;

      if (value === "") {
        // This might be an array
        inArray = true;
      } else {
        // Remove quotes if present
        const cleanValue = value.replace(/^["']|["']$/g, "");
        data[key] = cleanValue;
      }
    }
  }

  // Handle trailing array
  if (inArray && currentKey && arrayValues.length > 0) {
    data[currentKey] = [...arrayValues];
  }

  const frontmatter: ArticleFrontmatter = {
    title: (data.title as string) || "",
    date: (data.date as string) || "",
    tags: data.tags as string[] | undefined,
    description: data.description as string | undefined,
  };

  return {
    frontmatter,
    content: markdownContent,
  };
}
