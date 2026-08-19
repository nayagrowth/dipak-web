import Image from "next/image";
import { MobileNav } from "./MobileNav";
import { BrushArtwork } from "./BrushArtwork";
import type { HeroContent, HeroCta } from "./hero.types";
import heroComposition from "./generated/hero-composition.json";
import styles from "./dipak-hero.module.css";

const EVENT_SCHEMA_VERSION = "1";

function CtaButton({ cta }: { cta: HeroCta }) {
  if (!cta.href) return null;

  return (
    <a
      className={cta.kind === "primary" ? styles.primaryCta : styles.secondaryCta}
      href={cta.href}
      data-ac-event={cta.event}
      data-ac-event-schema={EVENT_SCHEMA_VERSION}
      data-ac-surface="dipak-public-hero"
    >
      {cta.kind === "primary" ? (
        <span aria-hidden="true" className={styles.primaryIcon}>
          →
        </span>
      ) : (
        <span aria-hidden="true" className={styles.secondaryIconCircle}>
          <span className={styles.playTriangle}>▶</span>
        </span>
      )}
      <span className={styles.ctaText}>{cta.label}</span>
    </a>
  );
}

export function DipakHero({ content }: { content: HeroContent }) {
  return (
    <section
      id="hero"
      className={styles.surface}
      aria-labelledby="hero-heading"
      data-story-act1="true"
    >
      {/* Authentic Left Margin Calligraphy Brush Accent */}
      <div
        className={styles.leftBrushAccent}
        data-story-left-accent="true"
        aria-hidden="true"
      />

      {/* Top Header & Navigation */}
      <header className={styles.header} data-story-header="true">
        <a className={styles.wordmark} href="#hero" aria-label="Dipak Vishwakarma homepage">
          <span className={styles.wordmarkFirst}>{content.brandFirstLine}</span>
          <span className={styles.wordmarkSecond}>{content.brandSecondLine}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {content.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${link.active ? styles.navLinkActive : ""}`}
            >
              <span>{link.label}</span>
              {link.active ? <span className={styles.activeIndicator} aria-hidden="true" /> : null}
            </a>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <MobileNav
            navLinks={content.navLinks}
            ctas={content.ctas}
            brandFirstLine={content.brandFirstLine}
            brandSecondLine={content.brandSecondLine}
          />
        </div>
      </header>

      {/* Viewport Grid */}
      <div className={styles.heroGrid}>
        {/* Left Column: Copy & CTAs */}
        <div className={styles.copyColumn}>
          <div className={styles.kickerRow} data-story-kicker="true">
            <span className={styles.kickerText}>{content.kicker}</span>
            <span
              className={styles.kickerLine}
              data-story-gold-rule="true"
              aria-hidden="true"
            />
          </div>

          <h1 id="hero-heading" className={styles.headline}>
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-headline-line="true"
                style={{ "--line-index": 0 } as React.CSSProperties}
              >
                {content.headlinePart1}
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-headline-line="true"
                style={{ "--line-index": 1 } as React.CSSProperties}
              >
                {content.headlinePart2}
              </span>
            </span>
            <span className={styles.headlineMask}>
              <span
                className={styles.headlineLine}
                data-story-headline-line="true"
                style={{ "--line-index": 2 } as React.CSSProperties}
              >
                {content.headlinePart3}
                <span className={styles.goldDot} aria-hidden="true">
                  .
                </span>
              </span>
            </span>
          </h1>

          <p className={styles.supportingCopy} data-story-copy="true">
            {content.supportingCopy}
          </p>

          {content.ctas.some((cta) => Boolean(cta.href)) ? (
            <div
              className={styles.ctaRow}
              data-story-cta-row="true"
              aria-label="Hero actions"
            >
              {content.ctas.map((cta) => (
                <CtaButton cta={cta} key={cta.event} />
              ))}
            </div>
          ) : null}

          {content.quote ? (
            <blockquote
              className={styles.quoteBlock}
              data-hero-quote="true"
              data-story-quote="true"
            >
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              <span className={styles.quoteDivider} aria-hidden="true" />
              <span className={styles.quoteText}>{content.quote}</span>
            </blockquote>
          ) : null}
        </div>

        {/* Right Column: Mathematically Registered Single Composition Root */}
        <div className={styles.portraitColumn}>
          <div
            className={styles.visualComposition}
            data-hero-composition="true"
            data-story-portrait-root="true"
            style={
              {
                "--desktop-aspect": heroComposition.desktop.aspectRatio,
                "--desktop-halo-u": heroComposition.desktop.halo_u,
                "--desktop-halo-v": heroComposition.desktop.halo_v,
                "--desktop-halo-sw": heroComposition.desktop.halo_sw,
                "--desktop-halo-sh": heroComposition.desktop.halo_sh,
                "--mobile-aspect": heroComposition.mobile.aspectRatio,
                "--mobile-halo-u": heroComposition.mobile.halo_u,
                "--mobile-halo-v": heroComposition.mobile.halo_v,
                "--mobile-halo-sw": heroComposition.mobile.halo_sw,
                "--mobile-halo-sh": heroComposition.mobile.halo_sh,
              } as React.CSSProperties
            }
          >
            {/* Authentic Natural-Media Ensō Brush Artwork with Animated Reveal */}
            <BrushArtwork className={styles.halo} />

            {/* Decontaminated High-Resolution Portrait Cutouts */}
            <Image
              className={`${styles.portrait} ${styles.desktopPortrait}`}
              data-hero-portrait="true"
              src={content.portrait}
              alt={content.portraitAlt}
              sizes="(max-width: 768px) 1px, (max-width: 1200px) 50vw, 44vw"
              quality={92}
              priority
            />
            <Image
              className={`${styles.portrait} ${styles.mobilePortrait}`}
              data-hero-portrait-mobile="true"
              src="/hero/dipak-seated-mobile.png"
              alt={content.portraitAlt}
              width={1122}
              height={1041}
              sizes="(max-width: 768px) 96vw, 1px"
              quality={92}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
