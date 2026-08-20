import React from "react";
import { identityContent } from "./identity.content";
import type { IdentityContent } from "./identity.types";
import styles from "./dipak-identity-act.module.css";

interface DipakIdentityActProps {
  content?: IdentityContent;
  className?: string;
}

export function DipakIdentityAct({
  content = identityContent,
  className,
}: DipakIdentityActProps) {
  return (
    <section
      id="identity"
      className={`${styles.identitySection} ${className || ""}`}
      aria-labelledby="identity-heading"
      data-story-act2="true"
    >
      {/* 3D Daylight Wash Layer */}
      <div className={styles.shadowGoboContainer} aria-hidden="true" data-story-act2-gobo="true">
        <div className={styles.sunlightBeam} data-story-act2-sunlight="true" />
        <div className={styles.ambientLightWash} data-story-act2-ambient="true" />
      </div>

      <div className={styles.identityContainer}>
        {/* Top Header Row: Section Number + Hairline + Headline */}
        <header className={styles.topRow}>
          <div className={styles.sectionIndexWrapper} data-story-act2-index="true">
            <div className={styles.sectionIndex}>
              <span>{content.sectionNumber}</span>
              <span aria-hidden="true">/</span>
              <span>{content.sectionTitle}</span>
            </div>
            <div className={styles.headerHairlineTrack}>
              <span className={styles.headerHairline} />
            </div>
          </div>

          <h2 id="identity-heading" className={styles.headline} data-story-act2-3dheadline="true">
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-act2-headline="true"
              >
                <span className={styles.highlightSmudge} data-story-act2-highlight="true">
                  {content.headlinePart1}
                </span>
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-act2-headline="true"
              >
                <span className={styles.highlightSmudge} data-story-act2-highlight="true">
                  {content.headlineWord2}
                  <span className={styles.tm}>™</span>
                </span>
                <span className={styles.goldPeriod}>.</span>
              </span>
            </span>
          </h2>
        </header>

        {/* Top Full-Width Golden Divider Rule */}
        <div className={styles.dividerRuleContainer}>
          <div
            className={styles.dividerRule}
            data-story-act2-rule="true"
            aria-hidden="true"
          />
        </div>

        {/* Middle Content Row: Founder Lockup & Verified Bio */}
        <div className={styles.middleRow}>
          <div className={styles.roleColumn} data-story-act2-role="true">
            <h3 className={styles.roleSubhead}>
              <span>Founder of</span>
              <span className={styles.roleBrand}>Authority Closers.</span>
            </h3>
            <span className={styles.founderDash} aria-hidden="true" />
          </div>

          <div className={styles.bioColumn} data-story-act2-bio="true">
            <p className={styles.bioText}>{content.bioParagraph}</p>
          </div>
        </div>

        {/* Bottom Full-Width Golden Divider Rule */}
        <div className={styles.dividerRuleContainer}>
          <div
            className={styles.dividerRule}
            data-story-act2-rule2="true"
            aria-hidden="true"
          />
        </div>

        {/* Bottom 3-Column Metric Ledger with Vertical Hairlines */}
        <div className={styles.statsRow} data-story-act2-stats="true">
          {content.metrics.map((metric, idx) => (
            <div className={styles.statBlock} key={metric.label}>
              <div className={styles.statValueRow}>
                <span className={styles.statMain}>{metric.main}</span>
                {metric.suffix ? (
                  <span className={styles.statSuffix}>{metric.suffix}</span>
                ) : null}
              </div>
              <div className={styles.statLabelRow}>
                <span className={styles.statLabel}>{metric.label}</span>
              </div>
              {idx < content.metrics.length - 1 && (
                <span className={styles.verticalDivider} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
