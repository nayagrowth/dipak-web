import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * File-backed article store.
 *
 * Publishing workflow, by design: drop a `.md` file into
 * `src/content/articles/`, commit, push. CI builds and the post is live.
 * No database, no CMS, no admin UI to maintain.
 *
 * Portability: this module only depends on `fs` + the content directory, so
 * it moves into the Authority Closers monorepo unchanged. If a real CMS is
 * introduced later, swap the body of these four functions and every consumer
 * (listing page, detail page, homepage "Latest Thinking") keeps working.
 */

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");

/** Categories from the copy master (ARTICLES > Categories). */
export const ARTICLE_CATEGORIES = [
  "Sales",
  "Buyer Psychology",
  "Communication",
  "Personal Branding",
  "AI",
  "Entrepreneurship",
  "Startups",
  "Public Speaking",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface ArticleMeta {
  slug: string;
  title: string;
  /** Short editorial standfirst shown on cards and at the top of the post. */
  excerpt: string;
  category: string;
  /** ISO date string, e.g. "2026-08-18". */
  date: string;
  readTime: string;
  /** Optional signature-content label, e.g. "Buyer Psychology Files™". */
  series?: string;
  /** Marks the post for the homepage / index feature slot. */
  featured?: boolean;
  /** Hides the post from all listings and from the sitemap. */
  draft?: boolean;
  coverImage?: string;
}

export interface Article extends ArticleMeta {
  /** Rendered HTML for the post body. */
  html: string;
}

function readArticleFile(fileName: string): Article | null {
  const slug = fileName.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  // A post missing a title or date is a malformed draft, not a publishable
  // article — skip it rather than rendering an "undefined" card in the index.
  if (!data.title || !data.date) return null;

  return {
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt ?? ""),
    category: String(data.category ?? "Sales"),
    date: String(data.date),
    readTime: String(data.readTime ?? estimateReadTime(content)),
    series: data.series ? String(data.series) : undefined,
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    html: marked.parse(content, { async: false }),
  };
}

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} MIN READ`;
}

/** All published articles, newest first. Drafts are excluded. */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map(readArticleFile)
    .filter((article): article is Article => article !== null && !article.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase().replace(/[\s_]+/g, "-");
  let file = path.join(ARTICLES_DIR, `${cleanSlug}.md`);
  let resolvedSlug = cleanSlug;
  if (!fs.existsSync(file)) {
    file = path.join(ARTICLES_DIR, `${slug}.md`);
    resolvedSlug = slug;
  }
  if (!fs.existsSync(file)) return null;

  const article = readArticleFile(`${resolvedSlug}.md`);
  return article && !article.draft ? article : null;
}

/** Slugs for `generateStaticParams` so every post is statically rendered. */
export function getAllArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}

/** Categories that actually have published posts, in copy-master order. */
export function getActiveCategories(articles: Article[]): string[] {
  const present = new Set(articles.map((article) => article.category));
  return ARTICLE_CATEGORIES.filter((category) => present.has(category));
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
