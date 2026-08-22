"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { HeroCta, NavLink } from "./hero.types";
import styles from "./dipak-hero.module.css";

interface MobileNavProps {
  navLinks: NavLink[];
  ctas: HeroCta[];
}

export function MobileNav({
  navLinks,
  ctas,
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

  const drawerContent =
    isOpen && typeof document !== "undefined" ? (
      <div
        id="mobile-primary-navigation"
        className={`${styles.mobileDrawer} ${styles.mobileDrawerOpen}`}
        aria-modal="true"
        role="dialog"
      >
        {/* Drawer Header */}
        <div className={styles.drawerHeader}>
          <Link
            className={styles.brandLink}
            href="/"
            onClick={handleCloseAndReturnFocus}
          >
            <Image
              src="/branding/dipak-signature-full-black.webp"
              alt="Dipak Vishwakarma"
              width={160}
              height={68}
              className={styles.headerSignatureImg}
              priority
            />
          </Link>

          <button
            ref={closeBtnRef}
            className={styles.drawerCloseBtn}
            aria-label="Close navigation menu"
            type="button"
            onClick={handleCloseAndReturnFocus}
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
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.drawerNavLink} ${link.active ? styles.drawerNavLinkActive : ""}`}
                onClick={handleCloseAndReturnFocus}
              >
                <span className={styles.drawerNavIndex} aria-hidden="true">
                  {num}
                </span>
                <span className={styles.drawerNavLabel}>{link.label}</span>
              </Link>
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
    ) : null;

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

      {drawerContent ? createPortal(drawerContent, document.body) : null}
    </div>
  );
}
