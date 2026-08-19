import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type {
  ArticleItem,
  BlogPostItem,
  ContentProvider,
} from "./content.types";

const ARTICLES_DIR = path.join(process.cwd(), "src", "content", "articles");
const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

function estimateReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} MIN READ`;
}

function parseMarkdownFile<T extends Record<string, unknown> = Record<string, unknown>>(
  filePath: string,
): { data: T; content: string; html: string } | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const html = marked.parse(content, { async: false }) as string;
  return { data: data as T, content, html };
}

/**
 * File-System implementation of ContentProvider.
 * Dropping markdown files in `src/content/articles` or `src/content/blog`
 * powers the site today. When a headless CMS is added, write a `CmsContentProvider`
 * that implements `ContentProvider`.
 */
export class FileSystemContentProvider implements ContentProvider {
  /* ---------------- Articles ---------------- */

  getArticles(): ArticleItem[] {
    if (!fs.existsSync(ARTICLES_DIR)) return [];

    return fs
      .readdirSync(ARTICLES_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const parsed = parseMarkdownFile<Record<string, unknown>>(
          path.join(ARTICLES_DIR, fileName),
        );
        if (!parsed || !parsed.data.title || (!parsed.data.date && !parsed.data.publishedAt)) {
          return null;
        }

        const dateStr = String(parsed.data.date || parsed.data.publishedAt || "");
        const item: ArticleItem = {
          id: slug,
          slug,
          kind: "article",
          title: String(parsed.data.title),
          excerpt: String(parsed.data.excerpt || ""),
          category: String(parsed.data.category || "Sales"),
          series: parsed.data.series ? String(parsed.data.series) : undefined,
          publishedAt: dateStr,
          readTime: String(parsed.data.readTime || estimateReadTime(parsed.content)),
          featured: Boolean(parsed.data.featured),
          draft: Boolean(parsed.data.draft),
          coverImage: parsed.data.coverImage ? String(parsed.data.coverImage) : undefined,
          html: parsed.html,
        };
        return item;
      })
      .filter((a): a is ArticleItem => a !== null && !a.draft)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  getArticleBySlug(slug: string): ArticleItem | null {
    const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;

    const parsed = parseMarkdownFile<Record<string, unknown>>(filePath);
    if (!parsed || !parsed.data.title) return null;

    const dateStr = String(parsed.data.date || parsed.data.publishedAt || "");
    const item: ArticleItem = {
      id: slug,
      slug,
      kind: "article",
      title: String(parsed.data.title),
      excerpt: String(parsed.data.excerpt || ""),
      category: String(parsed.data.category || "Sales"),
      series: parsed.data.series ? String(parsed.data.series) : undefined,
      publishedAt: dateStr,
      readTime: String(parsed.data.readTime || estimateReadTime(parsed.content)),
      featured: Boolean(parsed.data.featured),
      draft: Boolean(parsed.data.draft),
      coverImage: parsed.data.coverImage ? String(parsed.data.coverImage) : undefined,
      html: parsed.html,
    };

    return !item.draft ? item : null;
  }

  getArticleSlugs(): string[] {
    return this.getArticles().map((a) => a.slug);
  }

  /* ---------------- Blog ---------------- */

  getBlogPosts(): BlogPostItem[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    return fs
      .readdirSync(BLOG_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const parsed = parseMarkdownFile<Record<string, unknown>>(
          path.join(BLOG_DIR, fileName),
        );
        if (!parsed || !parsed.data.title || (!parsed.data.date && !parsed.data.publishedAt)) {
          return null;
        }

        const dateStr = String(parsed.data.date || parsed.data.publishedAt || "");
        const rawTags = parsed.data.tags;
        const tags = Array.isArray(rawTags)
          ? rawTags.map(String)
          : typeof rawTags === "string"
            ? rawTags.split(",").map((s) => s.trim())
            : [];

        const item: BlogPostItem = {
          id: slug,
          slug,
          kind: "blog",
          title: String(parsed.data.title),
          excerpt: String(parsed.data.excerpt || ""),
          tags,
          topic: parsed.data.topic ? String(parsed.data.topic) : undefined,
          publishedAt: dateStr,
          readTime: String(parsed.data.readTime || estimateReadTime(parsed.content)),
          draft: Boolean(parsed.data.draft),
          coverImage: parsed.data.coverImage ? String(parsed.data.coverImage) : undefined,
          html: parsed.html,
        };
        return item;
      })
      .filter((b): b is BlogPostItem => b !== null && !b.draft)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  getBlogPostBySlug(slug: string): BlogPostItem | null {
    const cleanSlug = decodeURIComponent(slug).trim().toLowerCase().replace(/[\s_]+/g, "-");
    let filePath = path.join(BLOG_DIR, `${cleanSlug}.md`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(BLOG_DIR, `${slug}.md`);
    }
    if (!fs.existsSync(filePath)) return null;

    const parsed = parseMarkdownFile<Record<string, unknown>>(filePath);
    if (!parsed || !parsed.data.title) return null;

    const dateStr = String(parsed.data.date || parsed.data.publishedAt || "");
    const rawTags = parsed.data.tags;
    const tags = Array.isArray(rawTags)
      ? rawTags.map(String)
      : typeof rawTags === "string"
        ? rawTags.split(",").map((s) => s.trim())
        : [];

    const item: BlogPostItem = {
      id: slug,
      slug,
      kind: "blog",
      title: String(parsed.data.title),
      excerpt: String(parsed.data.excerpt || ""),
      tags,
      topic: parsed.data.topic ? String(parsed.data.topic) : undefined,
      publishedAt: dateStr,
      readTime: String(parsed.data.readTime || estimateReadTime(parsed.content)),
      draft: Boolean(parsed.data.draft),
      coverImage: parsed.data.coverImage ? String(parsed.data.coverImage) : undefined,
      html: parsed.html,
    };

    return !item.draft ? item : null;
  }

  getBlogPostSlugs(): string[] {
    return this.getBlogPosts().map((b) => b.slug);
  }
}
