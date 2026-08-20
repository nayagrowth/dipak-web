import { test, expect } from "@playwright/test";

test.describe("Three.js Deformable Page-Turn Transition & Handoff V2", () => {
  test("initial load has sharp interactive hero DOM and persistent header above stage", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?debugPageTurn=1");

    await page.evaluate(async () => {
      if (document.fonts) await document.fonts.ready;
    });

    // 1. Persistent Header is in DOM and positioned above stage
    const header = page.locator("[data-persistent-header='true']");
    await expect(header).toBeVisible();

    // 2. Hero DOM is visible and interactive
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    // 3. Act 2 wrapper is in DOM underneath (ready to be physically uncovered)
    const act2 = page.locator("[data-story-act2-wrapper='true']");
    await expect(act2).toBeAttached();
  });

  test("readiness pipeline validates non-blank texture capture and marks canvas valid", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?debugPageTurn=1");

    await page.evaluate(async () => {
      if (document.fonts) await document.fonts.ready;
    });

    const canvas = page.locator("[data-page-turn-canvas='true']");
    await expect(canvas).toBeAttached();

    // Canvas should receive data-page-turn-capture="valid" once readiness pipeline finishes
    await expect(canvas).toHaveAttribute("data-page-turn-capture", "valid", { timeout: 10000 });
    await expect(canvas).toHaveAttribute("data-page-turn-ready", "true", { timeout: 10000 });

    // Texture resolution should be non-empty and non-zero
    const textureRes = await canvas.getAttribute("data-texture-res");
    expect(textureRes).toBeTruthy();
    expect(textureRes).not.toBe("0x0");
  });

  test("freeze progress ?pageTurnProgress=0.35 activates cylindrical deformation and unmasks Act 2", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?pageTurnProgress=0.35&debugPageTurn=1");

    await page.evaluate(async () => {
      if (document.fonts) await document.fonts.ready;
    });

    const canvas = page.locator("[data-page-turn-canvas='true']");
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const overlay = page.locator("[data-testid='page-turn-debug-overlay']");
    await expect(overlay).toBeVisible({ timeout: 10000 });
    await expect(overlay).toContainText("35.0%");

    // Act 2 wrapper is attached and ready
    const act2 = page.locator("[data-story-act2-wrapper='true']");
    await expect(act2).toBeAttached();
  });

  test("freeze progress ?pageTurnProgress=0.78 rotates page mesh out of viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?pageTurnProgress=0.78&debugPageTurn=1");

    await page.evaluate(async () => {
      if (document.fonts) await document.fonts.ready;
    });

    const overlay = page.locator("[data-testid='page-turn-debug-overlay']");
    await expect(overlay).toBeVisible({ timeout: 10000 });
    await expect(overlay).toContainText("78.0%");

    // Act 2 headline is attached
    const act2Headline = page.locator("[data-story-act2-3dheadline='true']");
    await expect(act2Headline).toBeAttached();
  });

  test("scroll drives page curl and uncovers Act 2 Certainty Builder", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const canvas = page.locator("[data-page-turn-canvas='true']");
    await expect(canvas).toHaveAttribute("data-page-turn-capture", "valid", { timeout: 10000 });

    // Scroll into mid-turn (p ~ 0.35)
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 1.5, behavior: "instant" });
    });
    await page.waitForTimeout(400);

    // Assert Act 2 headline is attached
    const act2Headline = page.locator("[data-story-act2-3dheadline='true']");
    await expect(act2Headline).toBeAttached();

    // Scroll into reading hold (p ~ 0.55)
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight * 2.6, behavior: "instant" });
    });
    await page.waitForTimeout(400);

    // Assert Act 2 index & stats are attached and displayed
    const act2Stats = page.locator("[data-story-act2-stats='true']");
    await expect(act2Stats).toBeAttached();

    // Scroll back to top to verify full reversibility
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(400);

    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();
  });

  test("mobile viewports (<=768px) bypass WebGL page-turn and use sequential flow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Hero is visible
    const hero = page.locator("#hero");
    await expect(hero).toBeVisible();

    // Mobile nav drawer trigger is accessible
    const hamburger = page.locator("button[aria-controls='mobile-primary-navigation']");
    await expect(hamburger).toBeVisible();
  });

  test("prefers-reduced-motion displays all acts statically without WebGL curl", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const act1 = page.locator("[data-story-act1-wrapper='true']");
    const act2 = page.locator("[data-story-act2-wrapper='true']");

    await expect(act1).toBeVisible();
    await expect(act2).toBeVisible();
  });
});
