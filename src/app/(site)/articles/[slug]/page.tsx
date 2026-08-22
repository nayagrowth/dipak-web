import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticleSlugs,
  getAllArticles,
  getArticleBySlug,
  formatArticleDate,
} from "@/lib/articles";
import { authorityClosersCta } from "@/features/site-chrome";
import { ProseBody } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "../articles.module.css";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return { title: "Article not found" };

  const canonicalUrl = `https://dipakvishwakarma.com/articles/${article.slug}`;
  const seoTitle = `${article.title} — Dipak Vishwakarma | Founder of Authority Closers`;
  const seoDescription = `${article.excerpt} Read this framework by Dipak Vishwakarma, Founder of Authority Closers and High-Ticket Sales Expert.`;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: article.date,
      authors: ["https://dipakvishwakarma.com"],
      siteName: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
      images: [
        {
          url: article.coverImage || "/social/dipak-og-default-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: `${article.title} — Dipak Vishwakarma`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: [article.coverImage || "/social/dipak-og-default-1200x630.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  // "More thinking" — up to three other posts, newest first.
  const related = getAllArticles()
    .filter((candidate) => candidate.slug !== article.slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Person",
      name: "Dipak Vishwakarma",
      jobTitle: "Founder of Authority Closers | High-Ticket Sales Expert",
      worksFor: {
        "@type": "Organization",
        name: "Authority Closers",
        url: "https://authorityclosers.com",
      },
      url: "https://dipakvishwakarma.com",
      sameAs: [
        "https://www.linkedin.com/in/dipakvishwakarma/",
        "https://twitter.com/dipakvishwa",
        "https://www.youtube.com/@dipakvishwakarma",
      ],
    },
    publisher: {
      "@type": "Person",
      name: "Dipak Vishwakarma",
      jobTitle: "Founder of Authority Closers | High-Ticket Sales Expert",
      url: "https://dipakvishwakarma.com",
    },
    mainEntityOfPage: `https://dipakvishwakarma.com/articles/${article.slug}`,
    image: article.coverImage
      ? `https://dipakvishwakarma.com${article.coverImage}`
      : "https://dipakvishwakarma.com/social/dipak-og-default-1200x630.jpg",
  };

  return (
    <article className={styles.post}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className={styles.postHeader}>
        <div className={editorial.containerNarrow}>
          <Link href="/articles" className={styles.backLink}>
            <span aria-hidden="true">←</span> All Articles
          </Link>

          <div className={styles.postMeta}>
            {article.series ? (
              <span className={styles.series}>{article.series}</span>
            ) : null}
            <span className={styles.metaLine}>
              {article.category} · {article.readTime} ·{" "}
              <time dateTime={article.date}>
                {formatArticleDate(article.date)}
              </time>
            </span>
          </div>

          <h1 className={styles.postTitle}>{article.title}</h1>

          <div className={styles.bylineRow}>
            <span className={styles.bylineName}>By Dipak Vishwakarma</span>
            <span className={styles.bylineSep}>·</span>
            <span className={styles.bylineRole}>Founder of Authority Closers | High-Ticket Sales Expert</span>
          </div>

          {article.excerpt ? (
            <p className={styles.postStandfirst}>{article.excerpt}</p>
          ) : null}

          <div className={styles.postRule} aria-hidden="true" />
        </div>
      </header>

      <div className={editorial.containerNarrow}>
        <ProseBody
          className={styles.prose}
          html={article.html}
        />

        {/* Author Bio Box */}
        <section className={styles.authorBox} aria-label="About the Author">
          <div className={styles.authorBoxMeta}>
            <span className={styles.authorBoxLabel}>ABOUT THE AUTHOR</span>
            <h3 className={styles.authorBoxName}>Dipak Vishwakarma</h3>
            <p className={styles.authorBoxRole}>Founder of Authority Closers | High-Ticket Sales Expert</p>
          </div>
          <p className={styles.authorBoxBio}>
            Dipak Vishwakarma works across sales education, buyer psychology, communication, and high-ticket deal architecture, developing practical frameworks that help founders and sales professionals replace pressure with certainty.
          </p>
          <div className={styles.authorSignatureWrap}>
            <Image
              src="/branding/dipak-signature-full-black.webp"
              alt="Dipak Vishwakarma Signature"
              width={200}
              height={84}
              className={styles.authorSignatureImg}
            />
          </div>
        </section>

        <aside className={styles.postCta}>
          <p className={styles.postCtaText}>
            Want structured sales learning and practice?
          </p>
          <a
            className={editorial.ctaPrimary}
            href={authorityClosersCta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-ac-event={authorityClosersCta.event}
            data-ac-surface="article-footer"
          >
            {authorityClosersCta.label}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className={`${editorial.section} ${editorial.sectionSunken}`}>
          <div className={editorial.container}>
            <h2 className={styles.relatedHeading}>More thinking by Dipak Vishwakarma</h2>
            <ul className={styles.relatedGrid}>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/articles/${item.slug}`} className={styles.relatedCard}>
                    <span className={styles.metaLine}>{item.category}</span>
                    <h3 className={styles.relatedTitle}>{item.title}</h3>
                    <span className={styles.metaLine}>{item.readTime}</span>
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
