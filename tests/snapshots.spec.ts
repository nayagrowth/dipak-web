import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const VIEWPORTS = [
  { name: "359x807-reference-mobile", width: 359, height: 807, dpr: 1 },
  { name: "360x800-mobile", width: 360, height: 800, dpr: 1 },
  { name: "375x667-compact-mobile", width: 375, height: 667, dpr: 1 },
  { name: "390x844-mobile-1x", width: 390, height: 844, dpr: 1 },
  { name: "390x844-mobile-dpr2", width: 390, height: 844, dpr: 2 },
  { name: "412x915-tall-mobile", width: 412, height: 915, dpr: 1 },
  { name: "430x932-large-mobile", width: 430, height: 932, dpr: 1 },
  { name: "768x1024-tablet", width: 768, height: 1024, dpr: 1 },
  { name: "1366x768-laptop", width: 1366, height: 768, dpr: 1 },
  { name: "1440x900-desktop", width: 1440, height: 900, dpr: 1 },
  { name: "1536x864-desktop", width: 1536, height: 864, dpr: 1 },
  { name: "1920x1080-desktop-fhd", width: 1920, height: 1080, dpr: 1 },
  { name: "2560x1440-desktop-2k", width: 2560, height: 1440, dpr: 1 },
];

test.describe("Hero Surface Visual Snapshot Capture", () => {
  const outDir = path.join(process.cwd(), "public", "test-snapshots");

  test.beforeAll(() => {
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
  });

  for (const vp of VIEWPORTS) {
    test(`capture snapshot for ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      await page.evaluate(async () => {
        if (document.fonts) await document.fonts.ready;
      });
      // Wait for intro motion to settle
      await page.waitForTimeout(600);

      const filePath = path.join(outDir, `${vp.name}.png`);
      await page.screenshot({ path: filePath, fullPage: false });
    });
  }
});
