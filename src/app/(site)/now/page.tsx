import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./now.module.css";

export const metadata: Metadata = {
  title: "Now — Dipak Vishwakarma",
  description: "What I'm focused on right now.",
  // Hidden page per the site map: reachable by link, kept out of search.
  robots: { index: false, follow: true },
};

/**
 * The /now page.
 *
 * The copy master is explicit: "Keep this page personal, current and dated.
 * Do not fill it with evergreen brand copy." So the sections below carry only
 * what the handoff pack actually establishes as true, and each is written to
 * be replaced by Dipak in his own words. `lastUpdated` is rendered so a stale
 * page is visibly stale rather than quietly wrong.
 */
const lastUpdated = "2026-08-18";

const nowSections = [
  {
    index: "01",
    label: "Current focus",
    note: "What I am building and improving right now.",
    items: [
      "Building Authority Closers — a sales education, practice and technology company built around one belief: watching content is not the same as building skill.",
      "Codifying the frameworks behind The Certainty Builder™ into material other people can teach from.",
    ],
  },
  {
    index: "02",
    label: "Currently learning",
    note: "Skills, ideas and questions I am actively studying.",
    items: [
      "How AI can improve learning, practice and feedback in sales without replacing human judgment.",
    ],
  },
  {
    index: "03",
    label: "Currently reading",
    note: "Books and long-form material currently being read.",
    items: [],
  },
  {
    index: "04",
    label: "Currently listening",
    note: "Podcasts, interviews and conversations worth revisiting.",
    items: [],
  },
  {
    index: "05",
    label: "Current goals",
    note: "The outcomes and projects that matter most in this season.",
    items: [
      "Publish consistently on buyer psychology, communication and high-ticket sales.",
    ],
  },
];

export default function NowPage() {
  const formatted = new Date(lastUpdated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHero
        eyebrow="Now"
        index="01"
        headline="What I’m focused on right now"
        body={[
          "A simple, regularly updated page covering what I am building, learning and thinking about now.",
        ]}
        aside={
          <div className={styles.heroMediaFrame}>
            <Image
              src="/media/10_screenshot_2026-08-08_at_10.40.56_pm.png"
              alt="Collaboration and working session"
              width={800}
              height={1000}
              sizes="(max-width: 900px) 70vw, 24rem"
              quality={90}
              className={styles.heroMediaImage}
            />
          </div>
        }
      />

      <section className={editorial.section}>
        <div className={editorial.container}>
          <p className={styles.updatedStamp}>
            Last updated <time dateTime={lastUpdated}>{formatted}</time>
          </p>

          <ul className={styles.nowList}>
            {nowSections.map((section, index) => (
              <Reveal
                as="li"
                key={section.index}
                index={index}
                className={styles.nowRow}
              >
                <div className={styles.nowHead}>
                  <span className={styles.nowIndex}>{section.index}</span>
                  <h2 className={styles.nowLabel}>{section.label}</h2>
                  <p className={styles.nowNote}>{section.note}</p>
                </div>

                <div className={styles.nowBody}>
                  {section.items.length > 0 ? (
                    <ul className={styles.itemList}>
                      {section.items.map((item) => (
                        <li key={item.slice(0, 40)} className={styles.item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.itemEmpty}>Nothing noted this season.</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
