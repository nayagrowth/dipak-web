/**
 * Global brand + navigation contract.
 *
 * Copy is transcribed from the client handoff pack
 * (01_COPY/DIPAK_WEBSITE_COPY_MASTER.md, sections NAVIGATION and FOOTER).
 * Every public page reads from here so nav/footer never drift per-page.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteBrand {
  firstLine: string;
  secondLine: string;
  positioning: string;
  primaryIdea: string;
}

export const siteBrand: SiteBrand = {
  firstLine: "DIPAK",
  secondLine: "VISHWAKARMA",
  positioning: "Founder of Authority Closers | High-Ticket Sales Expert",
  primaryIdea: "Because people buy certainty.",
};

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Articles", href: "/articles" },
  { label: "Videos", href: "/videos" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

/**
 * Persistent cross-link required on every public page by the handoff pack.
 * Kept as config so the destination can change without touching components.
 */
export const authorityClosersCta = {
  label: "Explore Authority Closers",
  href: "https://authorityclosers.com",
  event: "public.global.authority_closers_clicked",
};

export const footerContent = {
  philosophyLine: "Because people buy certainty.",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ] as NavLink[],
  copyright: "Dipak Vishwakarma. All rights reserved.",
};

/**
 * Social handles are deliberately empty.
 *
 * The copy master's CONTENT SAFETY flags list "Any social handles" as
 * unverified, and instructs: do not invent contact details. Populate this
 * array only with handles Dipak confirms — the footer renders nothing
 * until then rather than shipping dead or fabricated links.
 */
export const socialLinks: NavLink[] = [];
