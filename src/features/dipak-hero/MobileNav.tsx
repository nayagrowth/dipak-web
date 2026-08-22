"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { HeroCta, NavLink } from "./hero.types";
import styles from "./dipak-hero.module.css";

interface MobileNavProps {
  navLinks: NavLink[];
  ctas: HeroCta[];
  brandFirstLine: string;
  brandSecondLine: string;
}

export function MobileNav({
  navLinks,
  ctas,
  brandFirstLine,
  brandSecondLine,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-close on Esc key & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        openBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);
  };

  const handleCloseAndReturnFocus = () => {
    setIsOpen(false);
    openBtnRef.current?.focus();
  };

  const secondaryCta = ctas.find((c) => c.kind === "secondary" && Boolean(c.href)) || ctas[0];

  return (
    <div className={styles.mobileNavContainer}>
      {/* Editorial Menu Toggle Button */}
      <button
        ref={openBtnRef}
        className={styles.hamburgerBtn}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-primary-navigation"
        type="button"
        onClick={handleOpen}
      >
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
        <span className={styles.hamburgerLine} />
      </button>

      {/* Full-Screen Editorial Mobile Drawer */}
      <div
        id="mobile-primary-navigation"
        className={`${styles.mobileDrawer} ${isOpen ? styles.mobileDrawerOpen : ""}`}
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <a
            className={styles.brandLink}
            href="#hero"
            onClick={handleCloseAndReturnFocus}
            tabIndex={isOpen ? 0 : -1}
          >
            <Image
              src="/branding/dipak-signature-full-black.webp"
              alt="Dipak Vishwakarma"
              width={160}
              height={68}
              className={styles.headerSignatureImg}
            />
          </a>

          <button
            ref={closeBtnRef}
            className={styles.drawerCloseBtn}
            aria-label="Close navigation menu"
            type="button"
            onClick={handleCloseAndReturnFocus}
            tabIndex={isOpen ? 0 : -1}
          >
            <span aria-hidden="true" className={styles.closeIcon}>
              ✕
            </span>
          </button>
        </div>

        {/* Numbered Editorial Navigation Links */}
        <nav className={styles.drawerNav} aria-label="Mobile navigation">
          {navLinks.map((link, index) => {
            const num = (index + 1).toString().padStart(2, "0");
            return (
              <a
                key={link.label}
                href={link.href}
                className={`${styles.drawerNavLink} ${link.active ? styles.drawerNavLinkActive : ""}`}
                onClick={handleCloseAndReturnFocus}
                tabIndex={isOpen ? 0 : -1}
              >
                <span className={styles.drawerNavIndex} aria-hidden="true">
                  {num}
                </span>
                <span className={styles.drawerNavLabel}>{link.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Drawer Bottom CTA */}
        {secondaryCta?.href ? (
          <div className={styles.drawerFooter}>
            <div className={styles.drawerDivider} aria-hidden="true" />
            <a
              href={secondaryCta.href}
              className={styles.drawerCta}
              onClick={handleCloseAndReturnFocus}
              tabIndex={isOpen ? 0 : -1}
              data-ac-event={secondaryCta.event}
              data-ac-event-schema="1"
              data-ac-surface="dipak-public-hero-mobile-drawer"
            >
              <span>{secondaryCta.label}</span>
              <span aria-hidden="true" className={styles.drawerCtaArrow}>
                →
              </span>
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
