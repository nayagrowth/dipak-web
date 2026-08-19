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
      {/* 3D Diagonal Sunlight & Shadow Strips Layer */}
      <div className={styles.shadowGoboContainer} aria-hidden="true" data-story-act2-gobo="true">
        <div className={styles.sunlightBeam} data-story-act2-sunlight="true" />
        <div className={styles.shadowStripLeft} data-story-act2-shadow-left="true" />
        <div className={styles.shadowStripMid} data-story-act2-shadow-mid="true" />
        <div className={styles.ambientLightWash} data-story-act2-ambient="true" />
        {/* Subtle Architectural Seal Watermark Background */}
        <div className={styles.watermarkEmblem} data-story-act2-emblem="true" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="100" cy="100" r="48" stroke="currentColor" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <polygon points="100,20 180,100 100,180 20,100" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </div>
      </div>

      <div className={styles.identityContainer}>
        {/* Top Header Row: Section Number + Hairline/Dot + Headline */}
        <header className={styles.topRow}>
          <div className={styles.sectionIndexWrapper} data-story-act2-index="true">
            <div className={styles.sectionIndex}>
              <span className={styles.livePulseDot} aria-hidden="true" />
              <span>{content.sectionNumber}</span>
              <span aria-hidden="true">/</span>
              <span>{content.sectionTitle}</span>
            </div>
            <div className={styles.headerHairlineTrack}>
              <span className={styles.headerHairline} />
              <span className={styles.headerDot} />
            </div>
          </div>

          <h2 id="identity-heading" className={styles.headline} data-story-act2-3dheadline="true">
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-act2-headline="true"
              >
                <span className={styles.highlightSmudge}>
                  {content.headlinePart1}
                </span>
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-act2-headline="true"
              >
                <span className={styles.highlightSmudge}>
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

        {/* Middle Content Row: Founder Lockup & Verified Bio with Executive Proof */}
        <div className={styles.middleRow}>
          <div className={styles.roleColumn} data-story-act2-role="true">
            <h3 className={styles.roleSubhead}>
              <span>Founder of</span>
              <span className={styles.roleBrand}>Authority Closers.</span>
            </h3>
            <span className={styles.founderDash} aria-hidden="true" />

            <div className={styles.executiveProofSnippet}>
              <span className={styles.proofBadge}>KEYNOTE & ADVISORY</span>
              <p className={styles.proofCaption}>Direct Architect of ₹100Cr+ High-Ticket Sales Pipelines</p>
            </div>
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
