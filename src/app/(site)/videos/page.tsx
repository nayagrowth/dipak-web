import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  videoRails,
  youtubeChannelUrl,
  signatureProperties,
} from "@/features/dipak-media/media.content";
import { PageHero, SectionHeader, Reveal } from "@/features/editorial";
import editorial from "@/features/editorial/editorial.module.css";
import styles from "./videos.module.css";

export const metadata: Metadata = {
  title: "Videos by Dipak Vishwakarma — Founder of Authority Closers | Keynotes & Sales Breakdowns",
  description:
    "Keynotes, sales breakdowns, and practical lessons on buyer psychology from Dipak Vishwakarma, Founder of Authority Closers & High-Ticket Sales Expert.",
};

export default function VideosPage() {
  return (
    <>
      <PageHero
        eyebrow="Videos"
        index="01"
        headline="Watch the latest"
        body={[
          "Conversations, breakdowns and practical lessons on how buyers think and how better sales conversations are built.",
        ]}
        aside={
          <div className={styles.heroMediaPlate}>
            <Image
              src="/media/06_dsc04024.webp"
              alt="Dipak Vishwakarma speaking on stage"
              width={1200}
              height={800}
              sizes="(max-width: 900px) 90vw, 36vw"
              quality={90}
              className={styles.heroMediaImage}
              priority
            />
            <span className={styles.heroMediaCaption}>
              KEYNOTE · STAGE LECTURES &amp; BREAKDOWNS
            </span>
          </div>
        }
      />

      {videoRails.map((rail, railIndex) => (
        <section
          key={rail.id}
          id={rail.id}
          className={`${editorial.section} ${
            railIndex % 2 === 1 ? editorial.sectionSunken : ""
          }`}
          aria-labelledby={`${rail.id}-heading`}
        >
          <div className={editorial.container}>
            <SectionHeader
              index={String(railIndex + 2).padStart(2, "0")}
              label="Videos"
              headline={rail.label}
              note={rail.note}
              headingId={`${rail.id}-heading`}
            />

            {rail.videos.length > 0 ? (
              <ul className={styles.videoGrid}>
                {rail.videos.map((video, index) => (
                  <Reveal as="li" key={video.id} index={index}>
                    <a
                      className={styles.videoCard}
                      href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ac-event="public.videos.video_clicked"
                    >
                      <span className={styles.thumbFrame}>
                        {/*
                          Thumbnail comes straight from YouTube's CDN, so a new
                          video needs only its id — no asset pipeline step.
                        */}
                        <Image
                          className={styles.thumb}
                          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt=""
                          width={480}
                          height={360}
                          sizes="(max-width: 700px) 100vw, 20rem"
                        />
                        <span className={styles.playToken} aria-hidden="true">
                          ▶
                        </span>
                      </span>

                      <span className={styles.videoMeta}>
                        {video.category} · {video.duration}
                      </span>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                    </a>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <Reveal>
                <div className={styles.emptyRail}>
                  <span className={styles.emptyMark} aria-hidden="true">
                    ✦
                  </span>
                  <p className={styles.emptyText}>
                    This rail is being filmed. New breakdowns are published here
                    as they go live.
                  </p>
                  {youtubeChannelUrl ? (
                    <a
                      className={editorial.ctaSecondary}
                      href={youtubeChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link className={editorial.ctaSecondary} href="/articles">
                      Read the articles instead
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      ))}

      {/* --- Signature content properties --- */}
      <section
        className={`${editorial.section} ${editorial.sectionDark}`}
        aria-labelledby="signature-heading"
      >
        <div className={editorial.container}>
          <SectionHeader
            index="05"
            label="Signature Content"
            headline="My signature content properties"
            note="Different formats. One purpose: understand the buyer better and create more certainty."
            inverted
            headingId="signature-heading"
          />

          <ul className={styles.propertyList}>
            {signatureProperties.map((property, index) => (
              <Reveal
                as="li"
                key={property}
                index={index}
                className={styles.propertyItem}
              >
                <span className={styles.propertyIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.propertyName}>{property}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
