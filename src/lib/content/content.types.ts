/**
 * Unified, CMS-Agnostic Content Types
 *
 * All content — what was previously "Articles" and "Blogs" — is now a single
 * unified "Article" type. The /blog route permanently redirects to /articles.
 *
 * When a headless CMS is introduced, write a CmsContentProvider that
 * implements ContentProvider. No UI components will need to change.
 */

export type ContentKind = "article";

export interface BaseContentItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string: "2026-08-20" */
  publishedAt: string;
  readTime: string;
  html: string;
  coverImage?: string;
  author?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  draft?: boolean;
}

/**
 * Unified article — covers all long-form and shorter-form writing.
 */
export interface ArticleItem extends BaseContentItem {
  kind: "article";
  category: string;
  series?: string;
  featured?: boolean;
  tags?: string[];
}

/**
 * Canonical Content Adapter Interface
 * Any CMS (Local Filesystem, Strapi, Sanity, Authority Closers API) must
 * implement this contract.
 */
export interface ContentProvider {
  getArticles(): Promise<ArticleItem[]> | ArticleItem[];
  getArticleBySlug(slug: string): Promise<ArticleItem | null> | (ArticleItem | null);
  getArticleSlugs(): Promise<string[]> | string[];
}
