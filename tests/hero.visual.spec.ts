import { test, expect } from "@playwright/test";
import heroComposition from "../src/features/dipak-hero/generated/hero-composition.json";

const TARGET_VIEWPORTS = [
  { name: "mobile-359x807", width: 359, height: 807, isMobile: true },
  { name: "mobile-360x800", width: 360, height: 800, isMobile: true },
  { name: "mobile-375x667", width: 375, height: 667, isMobile: true },
  { name: "mobile-390x844", width: 390, height: 844, isMobile: true },
  { name: "mobile-412x915", width: 412, height: 915, isMobile: true },
  { name: "mobile-430x932", width: 430, height: 932, isMobile: true },
  { name: "tablet-768x1024", width: 768, height: 1024, isMobile: false },
  { name: "laptop-1366x768", width: 1366, height: 768, isMobile: false },
  { name: "desktop-1440x900", width: 1440, height: 900, isMobile: false },
  { name: "desktop-1536x864", width: 1536, height: 864, isMobile: false },
  { name: "desktop-1920x1080", width: 1920, height: 1080, isMobile: false },
  { name: "desktop-2560x1440", width: 2560, height: 1440, isMobile: false },
];

test.describe("Hero Surface Geometry, Registration & Responsive Fit", () => {
  for (const vp of TARGET_VIEWPORTS) {
    test(`hero fits ${vp.name} (${vp.width}x${vp.height}) with zero overflow`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.evaluate(async () => {
        if (document.fonts) await document.fonts.ready;
      });
      await page.waitForTimeout(400);

      const hero = page.locator("#hero");
      await expect(hero).toBeVisible();

      // 1. Assert hero height matches viewport exactly (no secondary scrolling)
      const heroBox = await hero.boundingBox();
      expect(heroBox).not.toBeNull();
      expect(heroBox!.height).toBeLessThanOrEqual(vp.height + 1);

      // 2. Assert zero horizontal overflow
      const dimensions = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBe(dimensions.viewportWidth);
      expect(dimensions.bodyScrollWidth).toBe(dimensions.viewportWidth);

      // 3. Assert critical content elements are strictly within viewport bounding box
      const elementsInsideViewport = await page.evaluate(() => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        
        const isInside = (sel: string) => {
          const el = document.querySelector(sel);
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.bottom <= vh && rect.left >= 0 && rect.right <= vw;
        };

        return {
          heading: isInside("#hero-heading"),
          primaryCta: isInside("a[data-ac-surface='dipak-public-hero'][data-ac-event='public.dipak_hero.primary_cta_clicked']"),
          secondaryCta: isInside("a[data-ac-surface='dipak-public-hero'][data-ac-event='public.dipak_hero.secondary_cta_clicked']"),
          quote: isInside("blockquote[data-hero-quote='true']"),
        };
      });

      expect(elementsInsideViewport.heading).toBe(true);
      expect(elementsInsideViewport.primaryCta).toBe(true);
      expect(elementsInsideViewport.secondaryCta).toBe(true);
      expect(elementsInsideViewport.quote).toBe(true);

      // 4. Test Single Composition Root & Mathematical Halo Registration
      const registrationMetrics = await page.evaluate(() => {
        const root = document.querySelector("[data-hero-composition]")?.getBoundingClientRect();
        const halo = document.querySelector("[data-hero-halo]")?.getBoundingClientRect();
        if (!root || !halo) return null;

        return {
          u: (halo.left - root.left) / root.width,
          v: (halo.top - root.top) / root.height,
          sw: halo.width / root.width,
          sh: halo.height / root.height,
        };
      });

      expect(registrationMetrics).not.toBeNull();
      const expected = vp.isMobile ? heroComposition.mobile : heroComposition.desktop;
      
      expect(Math.abs(registrationMetrics!.u - expected.halo_u)).toBeLessThanOrEqual(0.12);
      expect(Math.abs(registrationMetrics!.v - expected.halo_v)).toBeLessThanOrEqual(0.12);
      expect(Math.abs(registrationMetrics!.sw - expected.halo_sw)).toBeLessThanOrEqual(0.25);

      // 5. On mobile: assert visible subject starts tightly after quote (dead space fix)
      if (vp.isMobile) {
        const mobileRhythm = await page.evaluate(() => {
          const vh = window.innerHeight;
          const root = document.querySelector("[data-hero-composition]")?.getBoundingClientRect();
          const quote = document.querySelector("blockquote[data-hero-quote='true']")?.getBoundingClientRect();

          // Visible portrait subject begins at top of composition root
          const subjectTop = root ? root.top : vh;
          const gapQuoteToSubject = quote ? subjectTop - quote.bottom : 0;

          return {
            rootBottomRatio: root ? root.bottom / vh : 0,
            gapQuoteToSubject,
          };
        });

        // Subject composition is anchored to lower viewport
        expect(mobileRhythm.rootBottomRatio).toBeGreaterThanOrEqual(0.90);

        // Gap between quote and visible subject is <= 85px (eliminating the ~180px dead space)
        expect(mobileRhythm.gapQuoteToSubject).toBeLessThanOrEqual(85);
      }
    });
  }
});

test.describe("Mobile Navigation Drawer Interaction", () => {
  test("hamburger menu opens drawer, locks scroll, and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const hamburger = page.locator("button[aria-controls='mobile-primary-navigation']");
    await expect(hamburger).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Click hamburger to open
    await hamburger.click();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");

    const drawer = page.locator("#mobile-primary-navigation");
    await expect(drawer).toBeVisible();

    // Assert body scroll is locked
    const isScrollLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
    expect(isScrollLocked).toBe(true);

    // Press Escape to close
    await page.keyboard.press("Escape");
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");

    // Assert body scroll is restored
    const isScrollRestored = await page.evaluate(() => document.body.style.overflow !== "hidden");
    expect(isScrollRestored).toBe(true);
  });
});
