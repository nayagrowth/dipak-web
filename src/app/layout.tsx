import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dipakvishwakarma.com"),
  title: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
  description:
    "Dipak Vishwakarma is the Founder of Authority Closers and a High-Ticket Sales Expert helping founders and sales teams build certainty, handle objections, and close high-value deals.",
  alternates: {
    canonical: "https://dipakvishwakarma.com/",
  },
  openGraph: {
    type: "website",
    url: "https://dipakvishwakarma.com/",
    siteName: "Dipak Vishwakarma",
    title: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
    description:
      "Dipak Vishwakarma is the Founder of Authority Closers and a High-Ticket Sales Expert helping founders and sales teams build certainty, handle objections, and close high-value deals.",
    images: [
      {
        url: "/social/dipak-og-default-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
      },
      {
        url: "/social/dipak-og-retina-2400x1260.jpg",
        width: 2400,
        height: 1260,
        alt: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
    description:
      "Dipak Vishwakarma is the Founder of Authority Closers and a High-Ticket Sales Expert helping founders and sales teams build certainty, handle objections, and close high-value deals.",
    images: [
      {
        url: "/social/dipak-og-default-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Dipak Vishwakarma — Founder of Authority Closers | High-Ticket Sales Expert",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f4f1ea",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable}`}>
      <head>
        {/* Preload High Priority LCP Assets */}
        <link rel="preload" href="/hero/dipak-seated.webp" as="image" type="image/webp" />
        <link rel="preload" href="/hero/enso-brush-master.webp" as="image" type="image/webp" />

        {/* NayaGrowth Tracking & GTag Bootstrap */}
        <script
          src="https://api.nayagrowth.com/capture/tracking-bootstrap.js"
          async
        />
        {/* NayaGrowth Form Capture Script */}
        <script
          src="https://api.nayagrowth.com/capture/v1.js"
          data-naya-connector="src_authorityclosers_web"
          async
        />

        {/* Structured Data / JSON-LD for Google Search & Entity Knowledge Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://dipakvishwakarma.com/#person",
                  name: "Dipak Vishwakarma",
                  jobTitle: "Founder & The Certainty Builder",
                  worksFor: {
                    "@type": "Organization",
                    name: "Authority Closers",
                    url: "https://authorityclosers.com",
                  },
                  url: "https://dipakvishwakarma.com",
                  image: "https://dipakvishwakarma.com/social/dipak-og-default-1200x630.jpg",
                  sameAs: [
                    "https://www.linkedin.com/in/dipakvishwakarma/",
                    "https://twitter.com/dipakvishwa",
                    "https://www.youtube.com/@dipakvishwakarma",
                  ],
                  description:
                    "Helping founders and sales teams build trust, handle objections, and close high-value clients.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://dipakvishwakarma.com/#website",
                  url: "https://dipakvishwakarma.com",
                  name: "Dipak Vishwakarma",
                  publisher: {
                    "@id": "https://dipakvishwakarma.com/#person",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
