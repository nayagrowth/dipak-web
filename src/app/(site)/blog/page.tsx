import type { Metadata } from "next";
import Link from "next/link";
import { contentProvider, formatContentDate } from "@/lib/content";
import { PageHero, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog & Field Notes by Dipak Vishwakarma — Founder of Authority Closers",
  description:
    "Tactical field notes, buyer psychology observations, and sales leadership insights from Dipak Vishwakarma, Founder of Authority Closers & High-Ticket Sales Expert.",
};

export default async function BlogPage() {
  const posts = await contentProvider.getBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="Blog & Field Notes"
        index="02"
        headline="Continuous field notes & insights"
        body={[
          "Short-form commentary, tactical sales breakdowns, objection frameworks, and regular perspectives from the front lines of high-value dealmaking.",
        ]}
      />

      <section className={editorial.section}>
        <div className={editorial.container}>
          {posts.length === 0 ? (
            <p className={editorial.sectionNote}>
              Fresh field notes and commentary are on the way. Check back soon.
            </p>
          ) : (
            <ul className={styles.blogGrid}>
              {posts.map((post, index) => (
                <Reveal as="li" key={post.slug} index={index}>
                  <Link href={`/blog/${post.slug}`} className={styles.blogCard}>
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

                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>

                    <span className={styles.readMore}>
                      Read Post <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
