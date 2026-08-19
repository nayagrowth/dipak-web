import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { TopicsContent } from "./topics.types";
import { topicsContent } from "./topics.content";
import styles from "./dipak-topics-act.module.css";

interface DipakTopicsActProps {
  content?: TopicsContent;
  className?: string;
}

export function DipakTopicsAct({
  content = topicsContent,
  className,
}: DipakTopicsActProps) {
  return (
    <section
      id="topics"
      className={`${styles.topicsSection} ${className || ""}`}
      aria-labelledby="topics-heading"
      data-story-act5="true"
    >
      <div className={styles.atmosphereLayer} aria-hidden="true" />
      <div className={styles.ensoEcho} aria-hidden="true" />

      <div className={styles.topicsContainer}>
        {/* Header Row */}
        <header className={styles.headerRow}>
          <div className={styles.titleBlock}>
            <div className={styles.sectionIndex} data-story-act5-index="true">
              <span>{content.sectionNumber}</span>
              <span aria-hidden="true">/</span>
              <span>{content.sectionTitle}</span>
            </div>

            <h2 id="topics-heading" className={styles.headline}>
              <span>{content.headlineWord1}</span>{" "}
              <span>
                {content.headlineWord2}
                <span className={styles.goldPeriod}>.</span>
              </span>
            </h2>
          </div>

          <div className={styles.headerMeta}>
            <span className={styles.metaLabel}>{content.metaLabel}</span>
            <p className={styles.supportingNote} data-story-act5-note="true">
              {content.supportingNote}
            </p>
          </div>
        </header>

        {/* Expansive Editorial Topic Masterclass Grid */}
        <div
          className={styles.galleryGrid}
          aria-label="Core topic domains"
          data-story-act5-ledger="true"
        >
          {content.topics.map((item) => (
            <Link
              key={item.id}
              href={item.href || "/blog"}
              className={styles.topicCard}
              data-story-act5-item="true"
            >
              <div className={styles.cardVisualFrame}>
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.cardImage}
                    loading="lazy"
                  />
                ) : null}
                <div className={styles.imageOverlay} />
                <span className={styles.cardIndex}>[{item.number}]</span>
                <span className={styles.cardTag}>{item.tag}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardTitleRow}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <span className={styles.cardArrow} aria-hidden="true">
                    ↗
                  </span>
                </div>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
