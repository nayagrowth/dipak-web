import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles, formatArticleDate } from "@/lib/articles";
import { PageHero, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./articles.module.css";

export const metadata: Metadata = {
  title: "Articles by Dipak Vishwakarma — Sales & Buyer Psychology",
  description:
    "Ideas on sales, buyer psychology, communication, personal branding, AI, entrepreneurship, startups and public speaking.",
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
              alt="Deep work and article drafting"
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
              I am building a growing library of practical ideas, frameworks and
              field notes. Start with the latest thinking below.
            </p>
          ) : (
            <>
              {/* Lead article — the most recent post gets the large slot. */}
              <Reveal>
                <Link href={`/articles/${lead.slug}`} className={styles.leadCard}>
                  <div className={styles.leadMeta}>
                    {lead.series ? (
                      <span className={styles.series}>{lead.series}</span>
                    ) : null}
                    <span className={styles.metaLine}>
                      {lead.category} · {lead.readTime}
                    </span>
                  </div>

                  <h2 className={styles.leadTitle}>{lead.title}</h2>
                  <p className={styles.leadExcerpt}>{lead.excerpt}</p>

                  <span className={styles.readCue}>
                    Read Article <span aria-hidden="true">→</span>
                  </span>
                </Link>
              </Reveal>

              <ul className={styles.articleLedger}>
                {rest.map((article, index) => (
                  <Reveal as="li" key={article.slug} index={index}>
                    <Link
                      href={`/articles/${article.slug}`}
                      className={styles.ledgerCard}
                    >
                      <span className={styles.ledgerIndex}>
                        {String(index + 2).padStart(2, "0")}
                      </span>

                      <div className={styles.ledgerMain}>
                        <span className={styles.metaLine}>
                          {article.category}
                          {article.series ? ` // ${article.series}` : ""}
                        </span>
                        <h3 className={styles.ledgerTitle}>{article.title}</h3>
                        <p className={styles.ledgerExcerpt}>{article.excerpt}</p>
                      </div>

                      <div className={styles.ledgerAside}>
                        <span className={styles.metaLine}>
                          {formatArticleDate(article.date)}
                        </span>
                        <span className={styles.metaLine}>{article.readTime}</span>
                        <span className={styles.ledgerArrow} aria-hidden="true">
                          →
                        </span>
                      </div>
                    </Link>
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
