import React from "react";
import { missionContent } from "./mission.content";
import type { MissionContent } from "./mission.types";
import styles from "./dipak-mission-act.module.css";

interface DipakMissionActProps {
  content?: MissionContent;
  className?: string;
}

export function DipakMissionAct({
  content = missionContent,
  className,
}: DipakMissionActProps) {
  return (
    <section
      id="mission"
      className={`${styles.missionSection} ${className || ""}`}
      aria-labelledby="mission-heading"
      data-story-act4="true"
    >
      <div className={styles.atmosphereLayer} aria-hidden="true" />
      
      {/* Cinematic Window Silhouette Background Layer */}
      <div className={styles.videoBackgroundContainer} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/02_screenshot_2026-07-29_at_4.45.57_pm__1_.png"
          alt=""
          className={styles.backgroundPhoto}
        />
        <div className={styles.videoGradientWash} />
      </div>

      <div className={styles.manifestoContainer}>
        {/* Kicker Block */}
        <div className={styles.kickerBlock}>
          <div className={styles.sectionIndex} data-story-act4-index="true">
            <span>{content.sectionNumber}</span>
            <span aria-hidden="true">/</span>
            <span>{content.sectionTitle}</span>
          </div>
          <span className={styles.kickerMeta} data-story-act4-kicker="true">
            {content.kicker}
          </span>
        </div>

        {/* Monumental Quote Sculpture */}
        <blockquote className={styles.quoteSculpture}>
          <h2 id="mission-heading" className={styles.quoteHeadline}>
            <span className={styles.headlineMask}>
              <span className={styles.headlineLine} data-story-act4-line="0">
                &ldquo;{content.monumentalQuote.prefix}
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={`${styles.headlineLine} ${styles.goldEmphasis}`}
                data-story-act4-line="1"
              >
                {content.monumentalQuote.emphasis}
                {content.monumentalQuote.suffix}&rdquo;
              </span>
            </span>
          </h2>
        </blockquote>

        {/* Central Gold Laser Axis with Center Accent */}
        <div className={styles.laserContainer} data-story-act4-rule="true">
          <div className={styles.laserLine} aria-hidden="true" />
          <div className={styles.laserDiamond} aria-hidden="true" />
          <div className={styles.laserLine} aria-hidden="true" />
        </div>

        {/* Two Pure Editorial Tenets */}
        <ul
          className={styles.tenetsRow}
          aria-label="Core Operating Tenets"
          data-story-act4-tenets="true"
        >
          {content.pillars.map((pillar) => (
            <li key={pillar.index} className={styles.tenetItem}>
              <span className={styles.tenetDot} aria-hidden="true" />
              <span>{pillar.statement}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
