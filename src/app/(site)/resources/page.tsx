import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { leadMagnets } from "@/features/dipak-media/media.content";
import { authorityClosersCta } from "@/features/site-chrome";
import { PageHero, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./resources.module.css";

export const metadata: Metadata = {
  title: "Sales Resources by Dipak Vishwakarma — Founder of Authority Closers",
  description:
    "Practical tools, objection frameworks, and high-ticket guides from Dipak Vishwakarma, Founder of Authority Closers.",
};

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        index="01"
        headline="Practical tools for better conversations"
        body={[
          "Practical tools to help you think, communicate and sell with more certainty.",
        ]}
        aside={
          <div className={styles.heroMediaFrame}>
            <Image
              src="/media/04_dsc07013.webp"
              alt="Notebook and frameworks detail"
              width={1000}
              height={750}
              sizes="(max-width: 900px) 70vw, 24rem"
              quality={90}
              className={styles.heroMediaImage}
            />
          </div>
        }
      />

      <section className={editorial.section} aria-label="Available resources">
        <div className={editorial.container}>
          <ul className={styles.resourceGrid}>
            {leadMagnets.map((magnet, index) => (
              <Reveal
                as="li"
                key={magnet.index}
                index={index}
                className={styles.resourceCard}
              >
                <span className={styles.resourceIndex}>{magnet.index}</span>

                <div className={styles.resourceBody}>
                  <h2 className={styles.resourceTitle}>{magnet.title}</h2>
                  <p className={styles.resourceDescription}>
                    {magnet.description}
                  </p>
                </div>

                {/*
                  Routes to the contact form with the resource pre-selected
                  rather than linking a file. The copy master requires final
                  downloads and their exact promises to be approved before
                  publishing, so no download URL is invented here.
                */}
                <Link
                  className={styles.resourceCta}
                  href={`/contact?topic=${encodeURIComponent(magnet.topic)}`}
                  data-ac-event="public.resources.request_clicked"
                >
                  {magnet.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className={`${editorial.section} ${editorial.sectionDark}`}>
        <div className={editorial.container}>
          <div className={styles.bridgeBlock}>
            <h2 className={styles.bridgeHeadline}>
              Looking for structured sales learning and practice
              <span className={styles.goldPeriod}>?</span>
            </h2>
            <p className={styles.bridgeBody}>
              Authority Closers is where these frameworks become a full learning
              loop: learn the idea, apply it in real conversations, practise
              deliberately, receive useful feedback and improve through
              repetition.
            </p>

            <div className={editorial.ctaRow}>
              <a
                className={editorial.ctaPrimary}
                href={authorityClosersCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-ac-event={authorityClosersCta.event}
                data-ac-surface="resources-bridge"
              >
                {authorityClosersCta.label}
                <span aria-hidden="true">→</span>
              </a>
              <Link className={editorial.ctaSecondary} href="/articles">
                Explore My Thinking
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
