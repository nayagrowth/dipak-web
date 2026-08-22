"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, siteBrand } from "./site.content";
import styles from "./site-chrome.module.css";

const EVENT_SCHEMA_VERSION = "1";

/**
 * Fixed header for the inner pages.
 *
 * The homepage deliberately does NOT use this: its header is baked into the
 * pinned GSAP story stage (see dipak-hero) so it can deconstruct with Act 1.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the drawer on route change so back/forward never strands it open.
  // Adjusted during render rather than in an effect — React re-runs this
  // component before painting, so the drawer never flashes on the new route.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll behind the drawer, and restore it on unmount.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>

      <header
        className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}
        data-site-header="true"
      >
        <Link className={styles.brandLink} href="/" aria-label="Dipak Vishwakarma — home">
          <Image
            src="/branding/dipak-signature-full-black.webp"
            alt="Dipak Vishwakarma"
            width={180}
            height={76}
            className={styles.headerSignatureImg}
            priority
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.navLinkActive : ""}`}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              <span>{link.label}</span>
              {isActive(link.href) ? (
                <span className={styles.activeIndicator} aria-hidden="true" />
              ) : null}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-drawer"
          data-ac-event="public.global.mobile_nav_toggled"
          data-ac-event-schema={EVENT_SCHEMA_VERSION}
        >
          <span className="srOnly">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span
            className={`${styles.menuBar} ${menuOpen ? styles.menuBarTopOpen : ""}`}
            aria-hidden="true"
          />
          <span
            className={`${styles.menuBar} ${menuOpen ? styles.menuBarBottomOpen : ""}`}
            aria-hidden="true"
          />
        </button>
      </header>

      {menuOpen ? (
        <div
          id="site-mobile-drawer"
          className={`${styles.drawer} ${styles.drawerOpen}`}
        >
          <nav className={styles.drawerNav} aria-label="Mobile">
            {primaryNav.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.drawerLink}
                style={{ "--i": index } as React.CSSProperties}
              >
                <span className={styles.drawerIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
