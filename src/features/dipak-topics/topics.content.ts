import type { TopicsContent } from "./topics.types";

/**
 * "What I Think About" — the eight subjects from the client copy master
 * (01_COPY section 06). Titles and descriptions are transcribed verbatim;
 * only the mono `tag` kickers are presentational additions.
 */
export const topicsContent: TopicsContent = {
  sectionNumber: "05",
  sectionTitle: "Subjects",
  headlineWord1: "WHAT I",
  headlineWord2: "THINK ABOUT",
  metaLabel: "Advisory & Keynotes",
  supportingNote:
    "The ideas, systems and questions I spend most of my time exploring.",
  topics: [
    {
      id: "buyer-psychology",
      number: "01",
      tag: "Cognitive Dynamics",
      title: "Buyer Psychology",
      description:
        "Why people hesitate, what creates trust, and how decisions are actually made.",
      image: "/topics/buyer-psychology.jpg",
      href: "/blog/buyer-psychology-undecided-mind",
    },
    {
      id: "high-ticket-sales",
      number: "02",
      tag: "Systems Architecture",
      title: "High-Ticket Sales",
      description:
        "How to lead complex conversations without pressure, scripts or manipulation.",
      image: "/topics/high-ticket-sales.jpg",
      href: "/blog/the-architecture-of-high-ticket-sales",
    },
    {
      id: "communication",
      number: "03",
      tag: "Language & Framing",
      title: "Communication",
      description:
        "Questions, listening, framing and the language that changes how people understand value.",
      image: "/topics/communication.jpg",
      href: "/blog/the-true-meaning-of-communication",
    },
    {
      id: "personal-branding",
      number: "04",
      tag: "Intellectual Equity",
      title: "Personal Branding",
      description:
        "How expertise becomes authority — and how authority compounds over time.",
      image: "/topics/personal-branding.jpg",
      href: "/blog/personal-branding-in-the-age-of-ai",
    },
    {
      id: "ai",
      number: "05",
      tag: "Applied Intelligence",
      title: "AI & Sales Engineering",
      description:
        "How AI can improve learning, practice, feedback and decision-making without replacing human judgment.",
      image: "/topics/ai.jpg",
      href: "/blog/ai-and-the-future-of-sales",
    },
    {
      id: "entrepreneurship",
      number: "06",
      tag: "Operating Reality",
      title: "Entrepreneurship & Scale",
      description:
        "Building systems, teams and products around a clear market problem.",
      image: "/topics/entrepreneurship.jpg",
      href: "/blog/sales-number-one-skill-for-founders",
    },
    {
      id: "startups",
      number: "07",
      tag: "Founder-Led Growth",
      title: "Startups & Deal Velocity",
      description:
        "Sales systems, founder-led growth and the transition from instinct to repeatability.",
      image: "/topics/authority-building.jpg",
      href: "/blog/sales-number-one-skill-for-founders",
    },
    {
      id: "public-speaking",
      number: "08",
      tag: "Stage Craft",
      title: "Public Speaking & Leverage",
      description:
        "Communicating ideas with clarity, structure and conviction to influence multiple decision-makers.",
      image: "/topics/sales-leadership.jpg",
      href: "/blog/public-speaking-as-business-leverage",
    },
  ],
};
