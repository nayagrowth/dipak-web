import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { ArticleItem, ContentProvider } from "./content.types";

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} MIN READ`;
}

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function parseArticleFile(filePath: string): ArticleItem | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) return null;

  // Support both 'date' and 'publishedAt' frontmatter keys (blog migration compat)
  const dateStr = String(data.date || data.publishedAt || "");
  if (!dateStr) return null;

  // Support both 'category' (articles) and 'topic' (old blog) frontmatter
  const category = String(data.category || data.topic || "Sales");
  const slug = path.basename(filePath, ".md");
  const html = marked.parse(content, { async: false }) as string;

  return {
    id: slug,
    slug,
    kind: "article",
    title: String(data.title),
    excerpt: String(data.excerpt || ""),
    category,
    series: data.series ? String(data.series) : undefined,
    publishedAt: dateStr,
    readTime: String(data.readTime || estimateReadTime(content)),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    tags: parseTags(data.tags),
    html,
  };
}

/**
 * File-System ContentProvider.
 *
 * All content (former articles + former blog) lives in src/content/articles/.
 * Drop a .md file there, commit, push — it's live after the next deploy.
 */
export class FileSystemContentProvider implements ContentProvider {
  getArticles(): ArticleItem[] {
    if (!fs.existsSync(ARTICLES_DIR)) return [];

    return fs
      .readdirSync(ARTICLES_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => parseArticleFile(path.join(ARTICLES_DIR, file)))
      .filter((a): a is ArticleItem => a !== null && !a.draft)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  getArticleBySlug(slug: string): ArticleItem | null {
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase().replace(/[\s_]+/g, "-");

    for (const s of [cleanSlug, slug]) {
      const filePath = path.join(ARTICLES_DIR, `${s}.md`);
      if (fs.existsSync(filePath)) {
        const item = parseArticleFile(filePath);
        return item && !item.draft ? item : null;
      }
    }
    return null;
  }

  getArticleSlugs(): string[] {
    return this.getArticles().map((a) => a.slug);
  }
}
