import React from "react";
import { bridgeContent } from "./bridge.content";
import type { BridgeContent } from "./bridge.types";
import styles from "./dipak-bridge-act.module.css";

interface DipakBridgeActProps {
  content?: BridgeContent;
  className?: string;
}

export function DipakBridgeAct({
  content = bridgeContent,
  className,
}: DipakBridgeActProps) {
  const primaryCta = content.ctas.find((c) => c.primary) || content.ctas[0];
  const secondaryCta = content.ctas.find((c) => !c.primary);

  return (
    <section
      id="authority-closers"
      className={`${styles.bridgeSection} ${className || ""}`}
      aria-labelledby="bridge-heading"
      data-story-act7="true"
    >
      <div className={styles.atmosphereLayer} aria-hidden="true" />

      {/* Restrained Wide Documentary Team Film Strip Layer */}
      <div className={styles.teamFilmStrip} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/08_img_1624.webp"
          alt=""
          className={styles.teamPhoto}
        />
        <div className={styles.teamGradientOverlay} />
      </div>

      <div className={styles.bridgeContainer}>
        {/* Transparent Authority Closers Brand Mark */}
        <div className={styles.brandMarkContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/authority_closers_png__1_.png"
            alt="Authority Closers"
            className={styles.brandMarkLogo}
          />
        </div>

        {/* Header Block */}
        <div className={styles.headerBlock}>
          <div className={styles.sectionIndex} data-story-act7-index="true">
            <span>{content.sectionNumber}</span>
            <span aria-hidden="true">/</span>
            <span>{content.sectionTitle}</span>
          </div>

          <p className={styles.eyebrow} data-story-act7-eyebrow="true">
            {content.eyebrow}
          </p>
        </div>

        {/* Monumental Headline */}
        <h2 id="bridge-heading" className={styles.headline}>
          <span>{content.headlineWord1}</span>{" "}
          <span>{content.headlineWord2}</span>
          <span className={styles.goldPeriod}>.</span>
        </h2>

        {/* Gold Center Line */}
        <div className={styles.goldLine} aria-hidden="true" />

        {/* Body Text */}
        <p className={styles.bodyText} data-story-act7-body="true">
          {content.bodyParagraph}
        </p>

        {/* CTA Buttons */}
        <div className={styles.ctaRow} data-story-act7-ctas="true">
          {primaryCta && (
            <a
              href={primaryCta.href}
              className={styles.primaryButton}
              data-ac-event={primaryCta.event}
            >
              <span>{primaryCta.label}</span>
              <span aria-hidden="true">→</span>
            </a>
          )}

          {secondaryCta && (
            <a
              href={secondaryCta.href}
              className={styles.secondaryButton}
              data-ac-event={secondaryCta.event}
            >
              <span>{secondaryCta.label}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
