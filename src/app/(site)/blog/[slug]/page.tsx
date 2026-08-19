import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contentProvider, formatContentDate } from "@/lib/content";
import { authorityClosersCta } from "@/features/site-chrome";
import { ProseBody } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "../blog.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await contentProvider.getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await contentProvider.getBlogPostBySlug(slug);

  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} — Dipak Vishwakarma Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await contentProvider.getBlogPostBySlug(slug);

  if (!post) notFound();

  const allPosts = await contentProvider.getBlogPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  return (
    <article className={styles.post}>
      <header className={styles.postHeader}>
        <div className={editorial.containerNarrow}>
          <Link href="/blog" className={styles.backLink}>
            <span aria-hidden="true">←</span> All Field Notes &amp; Blog
          </Link>

          {post.tags.length > 0 ? (
            <div className={styles.tagRow}>
              {post.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className={styles.metaRow}>
            <time dateTime={post.publishedAt}>
              {formatContentDate(post.publishedAt)}
            </time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className={styles.postTitle}>{post.title}</h1>

          {post.excerpt ? (
            <p className={styles.postStandfirst}>{post.excerpt}</p>
          ) : null}
        </div>
      </header>

      <div className={editorial.containerNarrow}>
        <ProseBody
          className={styles.prose}
          html={post.html}
        />

        <aside className={editorial.ctaRow} style={{ marginTop: "4rem" }}>
          <a
            className={editorial.ctaPrimary}
            href={authorityClosersCta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-ac-event={authorityClosersCta.event}
            data-ac-surface="blog-footer"
          >
            {authorityClosersCta.label}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className={`${editorial.section} ${editorial.sectionSunken}`} style={{ marginTop: "5rem" }}>
          <div className={editorial.container}>
            <h2 className={editorial.sectionHeadline}>More Field Notes</h2>
            <ul className={styles.blogGrid} style={{ marginTop: "2rem" }}>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`} className={styles.blogCard}>
                    <div className={styles.metaRow}>
                      <time dateTime={item.publishedAt}>
                        {formatContentDate(item.publishedAt)}
                      </time>
                      <span>·</span>
                      <span>{item.readTime}</span>
                    </div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>{item.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
