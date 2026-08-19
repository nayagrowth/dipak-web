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
  title: "Dipak Vishwakarma | The Certainty Builder",
  description:
    "Helping founders and sales teams build trust, handle objections, and close high-value clients.",
  alternates: {
    canonical: "https://dipakvishwakarma.com/",
  },
  openGraph: {
    type: "website",
    url: "https://dipakvishwakarma.com/",
    siteName: "Dipak Vishwakarma",
    title: "Dipak Vishwakarma | The Certainty Builder",
    description:
      "Helping founders and sales teams build trust, handle objections, and close high-value clients.",
    images: [
      {
        url: "/social/dipak-og-default-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Dipak Vishwakarma, The Certainty Builder, helping founders and sales teams close high-value deals.",
      },
      {
        url: "/social/dipak-og-retina-2400x1260.jpg",
        width: 2400,
        height: 1260,
        alt: "Dipak Vishwakarma, The Certainty Builder, helping founders and sales teams close high-value deals.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dipak Vishwakarma | The Certainty Builder",
    description:
      "Helping founders and sales teams build trust, handle objections, and close high-value clients.",
    images: [
      {
        url: "/social/dipak-og-default-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Dipak Vishwakarma, The Certainty Builder, helping founders and sales teams close high-value deals.",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
