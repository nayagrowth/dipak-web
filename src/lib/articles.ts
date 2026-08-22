import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Unified article store.
 *
 * All content lives in `src/content/articles/` — what was previously the
 * "blog" collection has been merged here. The /blog route 301-redirects to
 * /articles so old indexed URLs preserve SEO equity.
 *
 * Publishing: drop a `.md` file into `src/content/articles/`, commit, push.
 */

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

export const ARTICLE_CATEGORIES = [
  "Sales",
  "Buyer Psychology",
  "Communication",
  "Personal Branding",
  "AI",
  "Entrepreneurship",
  "Startups",
  "Public Speaking",
  "High-Ticket Sales",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date string, e.g. "2026-08-18". */
  date: string;
  readTime: string;
  series?: string;
  featured?: boolean;
  draft?: boolean;
  coverImage?: string;
  /** Tags (previously blog-only). Kept for compatibility. */
  tags?: string[];
}

export interface Article extends ArticleMeta {
  html: string;
}

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} MIN READ`;
}

function parseTags(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw === "string") return raw.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function readArticleFile(dir: string, fileName: string): Article | null {
  const slug = fileName.replace(/\.md$/, "");
  const filePath = path.join(dir, fileName);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  if (!data.title) return null;

  // Support both 'date' and 'publishedAt' frontmatter keys
  const dateStr = String(data.date || data.publishedAt || "");
  if (!dateStr) return null;

  // Support both 'category' (articles) and 'topic' (old blog) frontmatter
  const category = String(data.category || data.topic || "Sales");

  return {
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt ?? ""),
    category,
    date: dateStr,
    readTime: String(data.readTime ?? estimateReadTime(content)),
    series: data.series ? String(data.series) : undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    tags: parseTags(data.tags),
    html: marked.parse(content, { async: false }),
  };
}

/** All published articles, newest first. Drafts excluded. */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readArticleFile(ARTICLES_DIR, file))
    .filter((a): a is Article => a !== null && !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase().replace(/[\s_]+/g, "-");

  // Try clean slug first, then raw slug
  for (const s of [cleanSlug, slug]) {
    const file = path.join(ARTICLES_DIR, `${s}.md`);
    if (fs.existsSync(file)) {
      const article = readArticleFile(ARTICLES_DIR, `${s}.md`);
      return article && !article.draft ? article : null;
    }
  }
  return null;
}

export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export function getActiveCategories(articles: Article[]): string[] {
  const present = new Set(articles.map((a) => a.category));
  return ARTICLE_CATEGORIES.filter((c) => present.has(c));
}

export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
