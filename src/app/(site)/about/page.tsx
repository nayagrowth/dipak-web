import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { aboutContent } from "@/features/dipak-about/about.content";
import { authorityClosersCta } from "@/features/site-chrome";
import { PageHero, SectionHeader, Reveal, BackgroundMedia } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
  description:
    "Dipak Vishwakarma is an entrepreneur, sales educator, and Founder of Authority Closers. The work and philosophy behind The Certainty Builder™.",
};

const { hero, story, journey, philosophy, principles, missionVision, faq, cta } =
  aboutContent;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        index="01"
        headline={hero.headline}
        body={[...hero.body]}
        aside={
          <div className={styles.heroPortraitFrame}>
            <Image
              className={styles.heroPortrait}
              src="/media/01_dsc06974.webp"
              alt="Dipak Vishwakarma"
              width={1200}
              height={900}
              sizes="(max-width: 900px) 60vw, 30vw"
              quality={90}
              priority
            />
            <span className={styles.portraitRule} aria-hidden="true" />
          </div>
        }
      />

      {/* --- My Story --- */}
      <section className={editorial.section} aria-labelledby="story-heading">
        <div className={editorial.container}>
          <SectionHeader
            index={story.index}
            label={story.label}
            headline={story.headline}
            headingId="story-heading"
          />

          <div className={styles.storyBody}>
            {story.paragraphs.map((paragraph, index) => (
              <Reveal key={paragraph.slice(0, 32)} index={index}>
                <p className={index === 0 ? styles.storyLead : undefined}>
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- Journey timeline --- */}
      <section
        className={`${editorial.section} ${editorial.sectionSunken}`}
        aria-labelledby="journey-heading"
      >
        <div className={editorial.container}>
          <SectionHeader
            index={journey.index}
            label={journey.label}
            headline={journey.headline}
            headingId="journey-heading"
          />

          <ol className={styles.timeline}>
            {journey.stages.map((stage, index) => (
              <Reveal as="li" key={stage.index} index={index} className={styles.timelineItem}>
                <span className={styles.timelineIndex}>{stage.index}</span>
                <span className={styles.timelineNode} aria-hidden="true" />
                <div className={styles.timelineContent}>
                  <h3 className={styles.timelineTitle}>{stage.title}</h3>
                  <p className={styles.timelineBody}>{stage.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* --- Philosophy (dark, cinematic) --- */}
      <section
        className={`${editorial.section} ${editorial.sectionDark} ${styles.philosophySection}`}
        aria-labelledby="philosophy-heading"
      >
        <BackgroundMedia
          poster="/media/02_screenshot_2026-07-29_at_4.45.57_pm__1_.png"
          overlay="strong"
          className={styles.philosophyBg}
        />

        <div className={editorial.container}>
          <SectionHeader
            index={philosophy.index}
            label={philosophy.label}
            headline={philosophy.headline}
            inverted
            headingId="philosophy-heading"
          />

          <ul className={styles.philosophyList}>
            {philosophy.entries.map((entry, index) => (
              <Reveal
                as="li"
                key={entry.statement}
                index={index}
                className={styles.philosophyItem}
              >
                <h3 className={styles.philosophyStatement}>{entry.statement}</h3>
                <p className={styles.philosophyElaboration}>{entry.elaboration}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Principles --- */}
      <section className={editorial.section} aria-labelledby="principles-heading">
        <div className={editorial.container}>
          <SectionHeader
            index={principles.index}
            label={principles.label}
            headline={principles.headline}
            headingId="principles-heading"
          />

          <ol className={styles.principleGrid}>
            {principles.items.map((item, index) => (
              <Reveal
                as="li"
                key={item}
                index={index}
                className={styles.principleItem}
              >
                <span className={styles.principleIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.principleText}>{item}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* --- Mission & Vision --- */}
      <section
        className={`${editorial.section} ${editorial.sectionSunken}`}
        aria-labelledby="mission-vision-heading"
      >
        <div className={editorial.container}>
          <SectionHeader
            index={missionVision.index}
            label={missionVision.label}
            headline="Where this is going"
            headingId="mission-vision-heading"
          />

          <div className={styles.dualPanel}>
            <Reveal className={styles.panel}>
              <span className={styles.panelLabel}>Mission</span>
              <h3 className={styles.panelHeadline}>
                {missionVision.mission.headline}
              </h3>
              <p className={styles.panelBody}>{missionVision.mission.body}</p>
            </Reveal>

            <Reveal className={styles.panel} index={1}>
              <span className={styles.panelLabel}>Vision</span>
              <h3 className={styles.panelHeadline}>
                {missionVision.vision.headline}
              </h3>
              <p className={styles.panelBody}>{missionVision.vision.body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className={editorial.section} aria-labelledby="faq-heading">
        <div className={editorial.container}>
          <SectionHeader
            index={faq.index}
            label={faq.label}
            headline={faq.headline}
            headingId="faq-heading"
          />

          <div className={styles.faqList}>
            {faq.entries.map((entry, index) => (
              <Reveal key={entry.question} index={index}>
                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>{entry.question}</span>
                    <span className={styles.faqMarker} aria-hidden="true" />
                  </summary>
                  <p className={styles.faqAnswer}>{entry.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className={`${editorial.section} ${editorial.sectionDark}`}>
        <div className={editorial.container}>
          <div className={styles.ctaBlock}>
            <p className={styles.ctaLead}>{cta.primary.text}</p>
            <p className={styles.ctaLead}>{cta.secondary.text}</p>

            <div className={editorial.ctaRow}>
              <Link className={editorial.ctaPrimary} href={cta.primary.href}>
                {cta.primary.label}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                className={editorial.ctaSecondary}
                href={authorityClosersCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-ac-event={authorityClosersCta.event}
                data-ac-surface="about-cta"
              >
                {cta.secondary.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
