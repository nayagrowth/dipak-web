import Image from "next/image";
import Link from "next/link";
import {
  authorityClosersCta,
  footerContent,
  primaryNav,
  siteBrand,
  socialLinks,
} from "./site.content";
import styles from "./site-chrome.module.css";

const EVENT_SCHEMA_VERSION = "1";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrandBlock}>
          <Link className={styles.footerBrandLink} href="/" aria-label="Dipak Vishwakarma — home">
            <Image
              src="/branding/dipak-signature-full-white.webp"
              alt="Dipak Vishwakarma"
              width={220}
              height={92}
              className={styles.footerSignatureImg}
            />
          </Link>
          <span className={styles.footerPositioning}>{siteBrand.positioning}</span>
          <p className={styles.footerPhilosophy}>{footerContent.philosophyLine}</p>
        </div>

        <div className={styles.footerNavBlock}>
          <span className={styles.footerLabel}>Navigate</span>
          <ul className={styles.footerNavList}>
            {primaryNav.map((link) => (
              <li key={link.href}>
                <Link className={styles.footerLink} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerCtaBlock}>
          <span className={styles.footerLabel}>Sales training &amp; programs</span>
          <a
            className={styles.footerCta}
            href={authorityClosersCta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-ac-event={authorityClosersCta.event}
            data-ac-event-schema={EVENT_SCHEMA_VERSION}
            data-ac-surface="site-footer"
          >
            {authorityClosersCta.label}
            <span aria-hidden="true">→</span>
          </a>

          {socialLinks.length > 0 ? (
            <ul className={styles.socialList}>
              {socialLinks.map((social) => (
                <li key={social.href}>
                  <a
                    className={styles.footerLink}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className={styles.footerBaseline}>
        <span>
          Copyright © {year} {footerContent.copyright}
        </span>
      </div>
    </footer>
  );
}
