import type { ThinkingContent } from "./thinking.types";

/**
 * Static fallback for the "Latest Thinking" act.
 *
 * The homepage injects real published articles from the file-backed store, so
 * `articles` here is only used if that list is empty (e.g. every post is a
 * draft). Keeping it empty means no fabricated essays can reach production.
 */
export const thinkingContent: ThinkingContent = {
  sectionNumber: "06",
  sectionTitle: "Latest Thinking",
  metaLabel: "Publications & Media",
  supportingNote:
    "Deep dives, video breakdowns, and strategic frameworks on buyer psychology and closing.",
  videoSectionHeading: "FEATURED VIDEO MASTERCLASS",
  articleSectionHeading: "LONG-FORM EDITORIAL ESSAYS",

  /**
   * `youtubeUrl` is deliberately unset — the previous value was a placeholder
   * pointing at youtube.com rather than a real video, and the act now hides
   * the whole block rather than shipping a dead link. Set this to the real
   * masterclass URL to bring the featured-video installation back.
   */
  featuredVideo: {
    id: "v1",
    title: "How to Build Unshakable Certainty in High-Ticket Sales",
    category: "SALES STRATEGY",
    duration: "14 MIN WATCH",
    youtubeUrl: "https://www.youtube.com/@DipakVishwakarma",
    summary:
      "A complete breakdown of certainty transfer protocols, buyer friction elimination, and closing mechanics in high-ticket enterprise transactions.",
  },

  articles: [],

  videosCtaText: "Watch all videos",
  articlesCtaText: "Explore All Articles",
};
