import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { authorityClosersCta, socialLinks } from "@/features/site-chrome";
import { PageHero } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import { ContactForm } from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Dipak Vishwakarma — Founder of Authority Closers",
  description:
    "Get in touch with Dipak Vishwakarma, Founder of Authority Closers and High-Ticket Sales Expert, for keynotes, advisory, partnerships, and sales training.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        index="01"
        headline="Start a conversation"
        body={[
          "For speaking, collaborations, interviews, partnerships or questions related to Dipak’s work, use the form below.",
          "For sales training, learning programs or Authority Closers, use the Authority Closers link.",
        ]}
      />

      <section className={editorial.section}>
        <div className={`${editorial.container} ${styles.contactGrid}`}>
          <div className={styles.formColumn}>
            {/* useSearchParams needs a Suspense boundary during prerender. */}
            <Suspense fallback={<div className={styles.formSkeleton} />}>
              <ContactForm />
            </Suspense>
          </div>

          <aside className={styles.asideColumn}>
            <div className={styles.portraitBlock}>
              <Image
                className={styles.portrait}
                src="/media/09_screenshot_2026-08-08_at_10.33.36_pm.png"
                alt="Dipak Vishwakarma on a call"
                width={800}
                height={1000}
                sizes="(max-width: 900px) 50vw, 22rem"
                quality={90}
              />
            </div>

            <div className={styles.asideBlock}>
              <span className={styles.asideLabel}>Sales training &amp; programs</span>
              <p className={styles.asideText}>
                Looking for sales training or programs?
              </p>
              <a
                className={editorial.ctaSecondary}
                href={authorityClosersCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-ac-event={authorityClosersCta.event}
                data-ac-surface="contact-aside"
              >
                {authorityClosersCta.label}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {socialLinks.length > 0 ? (
              <div className={styles.asideBlock}>
                <span className={styles.asideLabel}>Elsewhere</span>
                <ul className={styles.socialList}>
                  {socialLinks.map((social) => (
                    <li key={social.href}>
                      <a
                        className={styles.socialLink}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label}
                        <span aria-hidden="true">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className={styles.asideBlock}>
              <span className={styles.asideLabel}>Response</span>
              <p className={styles.asideText}>
                Every message is read personally. Please include enough context
                for a useful reply.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
