import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

/**
 * IndexNow — instant crawl submission to Bing, Yandex, and other IndexNow
 * members. Called automatically by the CI/CD pipeline after each deploy.
 *
 * GET  /api/indexnow        → returns the IndexNow key (required by the protocol
 *                             so search engines can verify ownership)
 * POST /api/indexnow        → submits all article URLs to the IndexNow API
 *
 * Usage from deploy script:
 *   curl -X POST https://dipakvishwakarma.com/api/indexnow
 */

const BASE_URL = "https://dipakvishwakarma.com";
// IndexNow key — must match the file at /public/<key>.txt
// Using a deterministic value tied to the domain for simplicity.
// If you add a real key via Google Search Console, update this value.
const INDEXNOW_KEY = "dipak-vishwakarma-indexnow-2026";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// GET: serve the key so IndexNow can verify ownership
export function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain" },
  });
}

// POST: submit all URLs
export async function POST() {
  const articles = getAllArticles();

  const urls = [
    BASE_URL,
    `${BASE_URL}/about`,
    `${BASE_URL}/articles`,
    `${BASE_URL}/videos`,
    `${BASE_URL}/resources`,
    `${BASE_URL}/contact`,
    ...articles.map((a) => `${BASE_URL}/articles/${a.slug}`),
  ];

  try {
    const body = {
      host: "dipakvishwakarma.com",
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/api/indexnow`,
      urlList: urls,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { ok: false, status: response.status, detail: text },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      submitted: urls.length,
      urls,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
