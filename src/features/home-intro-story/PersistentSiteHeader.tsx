"use client";

import React from "react";
import { MobileNav } from "@/features/dipak-hero/MobileNav";
import type { HeroContent } from "@/features/dipak-hero/hero.types";
import styles from "./persistent-site-header.module.css";

interface PersistentSiteHeaderProps {
  content: HeroContent;
}

export function PersistentSiteHeader({ content }: PersistentSiteHeaderProps) {
  return (
    <div className={styles.headerWrapper} data-persistent-header="true">
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
    </div>
  );
}
