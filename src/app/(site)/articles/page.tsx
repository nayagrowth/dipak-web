import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles, formatArticleDate } from "@/lib/articles";
import { PageHero, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./articles.module.css";

export const metadata: Metadata = {
  title: "Articles by Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
  description:
    "Explore strategic articles by Dipak Vishwakarma, Founder of Authority Closers, covering sales psychology, communication, high-ticket deal structure, and AI in sales.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const [lead, ...rest] = articles;

  return (
    <>
      <PageHero
        eyebrow="Articles"
        index="01"
        headline="Ideas worth thinking about"
        body={[
          "Ideas on sales, buyer psychology, communication, personal branding, AI, entrepreneurship, startups and public speaking.",
        ]}
        aside={
          <div className={styles.heroMediaFrame}>
            <Image
              src="/media/03_dsc06998.webp"
              alt="Dipak Vishwakarma deep-work and writing"
              width={1000}
              height={750}
              sizes="(max-width: 900px) 70vw, 24rem"
              quality={90}
              className={styles.heroMediaImage}
            />
          </div>
        }
      />

      <section className={editorial.section}>
        <div className={editorial.container}>
          {articles.length === 0 ? (
            <p className={styles.emptyState}>
              Building a growing library of practical ideas, frameworks and
              field notes. Start with the latest thinking below.
            </p>
          ) : (
            <>
              {/* Lead article — large feature slot. Card is NOT a link; only
                  the title and read-cue are interactive so clicking text/excerpt
                  doesn't accidentally navigate. */}
              <Reveal>
                <div className={styles.leadCard}>
                  <div className={styles.leadMeta}>
                    {lead.series ? (
                      <span className={styles.series}>{lead.series}</span>
                    ) : null}
                    <span className={styles.metaLine}>
                      {lead.category} · {lead.readTime}
                    </span>
                  </div>

                  <h2 className={styles.leadTitle}>
                    <Link href={`/articles/${lead.slug}`} className={styles.titleLink}>
                      {lead.title}
                    </Link>
                  </h2>
                  <p className={styles.leadExcerpt}>{lead.excerpt}</p>

                  <Link href={`/articles/${lead.slug}`} className={styles.readCue}>
                    Read Article <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>

              <ul className={styles.articleLedger}>
                {rest.map((article, index) => (
                  <Reveal as="li" key={article.slug} index={index}>
                    {/* Card is a div — only title and date/arrow area link */}
                    <div className={styles.ledgerCard}>
                      <span className={styles.ledgerIndex}>
                        {String(index + 2).padStart(2, "0")}
                      </span>

                      <div className={styles.ledgerMain}>
                        <span className={styles.metaLine}>
                          {article.category}
                          {article.series ? ` // ${article.series}` : ""}
                        </span>
                        <h3 className={styles.ledgerTitle}>
                          <Link href={`/articles/${article.slug}`} className={styles.titleLink}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className={styles.ledgerExcerpt}>{article.excerpt}</p>
                      </div>

                      <div className={styles.ledgerAside}>
                        <span className={styles.metaLine}>
                          {formatArticleDate(article.date)}
                        </span>
                        <span className={styles.metaLine}>{article.readTime}</span>
                        <Link
                          href={`/articles/${article.slug}`}
                          className={styles.ledgerArrowLink}
                          aria-label={`Read ${article.title}`}
                        >
                          <span className={styles.ledgerArrow} aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
