"use client";

import React, { useState } from "react";
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
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  return (
    <section
      id="topics"
      className={`${styles.topicsSection} ${className || ""}`}
      aria-labelledby="topics-heading"
      data-story-act5="true"
    >
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

        {/* Editorial Ledger + Dominant Single Media Viewport */}
        <div className={styles.editorialSpread} data-story-act5-ledger="true">
          {/* Left Column: Semantic Ledger List */}
          <div className={styles.ledgerColumn}>
            {content.topics.map((item, idx) => {
              const isActive = idx === activeTopicIndex;
              return (
                <Link
                  key={item.id}
                  href={item.href || "/blog"}
                  className={`${styles.ledgerRow} ${isActive ? styles.activeLedgerRow : ""}`}
                  onMouseEnter={() => setActiveTopicIndex(idx)}
                  onFocus={() => setActiveTopicIndex(idx)}
                  data-story-act5-item="true"
                >
                  <div className={styles.ledgerRowMeta}>
                    <span className={styles.itemNumber}>{item.number}</span>
                    <span className={styles.itemTag}>{item.tag}</span>
                  </div>

                  <div className={styles.ledgerRowBody}>
                    <div className={styles.itemTitleRow}>
                      <h3 className={styles.itemTitle}>{item.title}</h3>
                      <span className={styles.itemArrow} aria-hidden="true">
                        →
                      </span>
                    </div>
                    <p className={styles.itemDescription}>{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Right Column: Dominant Editorial Photograph Viewport */}
          <div className={styles.viewportColumn} aria-hidden="true">
            <div className={styles.stickyMediaFrame}>
              {content.topics.map((item, idx) => (
                <div
                  key={item.id}
                  className={`${styles.mediaPlate} ${idx === activeTopicIndex ? styles.mediaPlateVisible : ""}`}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className={styles.mediaImage}
                      quality={85}
                    />
                  ) : null}
                  <div className={styles.mediaVignette} />
                  <div className={styles.plateCaptionBlock}>
                    <span className={styles.plateNumber}>[{item.number}]</span>
                    <span className={styles.plateTitle}>{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
