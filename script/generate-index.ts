import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { glob } from "glob";

interface ArticleFrontmatter {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
}

interface ArticleIndexEntry {
  path: string;
  locale: string;
  year: string;
  date: string;
  slug: string;
  frontmatter: ArticleFrontmatter;
}

interface ArticleIndex {
  articles: ArticleIndexEntry[];
  tags: Record<string, string[]>;
}

const ARTICLE_DIR = "./article";
const OUTPUT_DIR = "./docs";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "index.json");

async function generateIndex(): Promise<ArticleIndex> {
  const articles: ArticleIndexEntry[] = [];
  const tags: Record<string, string[]> = {};

  // Find all markdown files
  const files = await glob("**/*.md", { cwd: ARTICLE_DIR });

  for (const file of files) {
    const filePath = path.join(ARTICLE_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(raw);

    // Parse path: {locale}/{year}/{date}/{slug}.md
    const parts = file.split("/");
    if (parts.length !== 4) {
      console.warn(`Skipping ${file}: unexpected path structure`);
      continue;
    }

    const [locale, year, date, filename] = parts;
    const slug = filename.replace(".md", "");

    const articlePath = `/${locale}/${year}/${date}/${slug}`;

    const frontmatter: ArticleFrontmatter = {
      title: data.title || slug,
      date: data.date || `${year}-${date}`,
      tags: data.tags || [],
      description: data.description || "",
    };

    const entry: ArticleIndexEntry = {
      path: articlePath,
      locale,
      year,
      date,
      slug,
      frontmatter,
    };

    articles.push(entry);

    // Build tag index
    for (const tag of frontmatter.tags || []) {
      if (!tags[tag]) {
        tags[tag] = [];
      }
      tags[tag].push(articlePath);
    }
  }

  return { articles, tags };
}

async function main() {
  console.log("Generating article index...");

  const index = await generateIndex();

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Write index file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));

  console.log(`Generated index with ${index.articles.length} articles`);
  console.log(`Tags: ${Object.keys(index.tags).join(", ") || "(none)"}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
