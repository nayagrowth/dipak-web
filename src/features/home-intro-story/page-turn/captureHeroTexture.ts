import * as THREE from "three";
import { domToCanvas } from "modern-screenshot";

export interface CapturedHeroResult {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  variance: number;
  darkPixelRatio: number;
}

/**
 * Validates that the captured canvas contains real visual content (typography, portrait, artwork)
 * and is not a blank, single-color, or transparent sheet.
 */
export function validateTextureCapture(canvas: HTMLCanvasElement): {
  isValid: boolean;
  variance: number;
  darkPixelRatio: number;
  reason?: string;
} {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return { isValid: false, variance: 0, darkPixelRatio: 0, reason: "No 2D context" };
  }

  const sampleCols = 40;
  const sampleRows = 40;
  const totalSamples = sampleCols * sampleRows;
  const stepX = Math.max(1, Math.floor(canvas.width / sampleCols));
  const stepY = Math.max(1, Math.floor(canvas.height / sampleRows));

  let sumLuminance = 0;
  let sumLuminanceSq = 0;
  let darkPixelCount = 0;
  let nonBeigeCount = 0;

  // Expected background beige in sRGB: ~[244, 241, 234] -> L ~ 0.94
  for (let r = 0; r < sampleRows; r++) {
    for (let c = 0; c < sampleCols; c++) {
      const x = Math.min(canvas.width - 1, c * stepX);
      const y = Math.min(canvas.height - 1, r * stepY);
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const red = pixel[0] / 255;
      const green = pixel[1] / 255;
      const blue = pixel[2] / 255;
      const alpha = pixel[3] / 255;

      if (alpha < 0.5) {
        continue;
      }

      // Standard perceptual luminance
      const lum = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      sumLuminance += lum;
      sumLuminanceSq += lum * lum;

      if (lum < 0.45) {
        darkPixelCount++; // Dark text or dark jacket/hair
      }

      // Check if significantly different from flat beige
      const diffFromBeige = Math.abs(red - 0.957) + Math.abs(green - 0.945) + Math.abs(blue - 0.918);
      if (diffFromBeige > 0.12) {
        nonBeigeCount++;
      }
    }
  }

  const meanLum = sumLuminance / totalSamples;
  const variance = sumLuminanceSq / totalSamples - meanLum * meanLum;
  const darkPixelRatio = darkPixelCount / totalSamples;
  const nonBeigeRatio = nonBeigeCount / totalSamples;

  // A valid hero texture must have distinct variance from typography, armchair, or portrait
  const isValid = variance > 0.003 && (darkPixelRatio > 0.015 || nonBeigeRatio > 0.04);

  return {
    isValid,
    variance,
    darkPixelRatio,
    reason: isValid
      ? undefined
      : `Capture rejected: variance=${variance.toFixed(4)} (min 0.003), dark=${(darkPixelRatio * 100).toFixed(1)}%, nonBeige=${(nonBeigeRatio * 100).toFixed(1)}%`,
  };
}

/**
 * Awaits any finite CSS entrance animations on the hero element so the texture is captured
 * at full opacity and settled layout.
 */
async function waitForHeroAnimations(heroElement: HTMLElement): Promise<void> {
  if (typeof heroElement.getAnimations === "function") {
    const animations = heroElement.getAnimations({ subtree: true });
    const finiteAnimations = animations.filter((anim) => {
      const duration = anim.effect?.getComputedTiming?.()?.duration;
      return typeof duration === "number" && isFinite(duration) && duration > 0;
    });

    if (finiteAnimations.length > 0) {
      await Promise.allSettled(
        finiteAnimations.map((anim) =>
          anim.finished.catch(() => {})
        )
      );
    }
  }

  // Ensure two layout & paint ticks
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}

/**
 * Captures the rendered DOM hero element into a high-resolution Three.js CanvasTexture.
 * Performs DPR clamping, sRGB color space alignment, anisotropic filtering,
 * statistical variance validation, and GPU pre-uploading via renderer.initTexture.
 *
 * Throws an Error if capture fails or validation detects a blank/corrupted canvas.
 */
export async function captureHeroTexture(
  heroElement: HTMLElement,
  renderer: THREE.WebGLRenderer
): Promise<CapturedHeroResult> {
  // 1. Await finite entrance animations to settle
  await waitForHeroAnimations(heroElement);

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const maxTextureDim = Math.min(renderer.capabilities.maxTextureSize || 4096, 4096);

  const rect = heroElement.getBoundingClientRect();
  const rawWidth = Math.round(rect.width * dpr);
  const rawHeight = Math.round(rect.height * dpr);

  // Ensure dimensions do not exceed GPU limit
  const scale = Math.min(1.0, maxTextureDim / Math.max(rawWidth, rawHeight));
  const finalScale = dpr * scale;

  // 2. Perform DOM to canvas capture
  const canvas = await domToCanvas(heroElement, {
    scale: finalScale,
    width: rect.width,
    height: rect.height,
    features: {
      fixSvgXmlDecode: true,
    },
    filter: (node) => {
      // Exclude preloader, persistent header, and webgl canvas if present
      if (node instanceof HTMLElement) {
        if (
          node.getAttribute("data-persistent-header") === "true" ||
          node.getAttribute("data-page-turn-canvas") === "true" ||
          node.getAttribute("role") === "progressbar"
        ) {
          return false;
        }
      }
      return true;
    },
  });

  // 3. Statistical texture validation (reject blank beige or corrupted captures)
  const validation = validateTextureCapture(canvas);
  if (!validation.isValid) {
    throw new Error(`[PageTurn] Texture validation failed: ${validation.reason}`);
  }

  // 4. Create optimized Three.js CanvasTexture
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  texture.needsUpdate = true;

  // Pre-upload texture to GPU immediately to avoid first-frame stutter
  renderer.initTexture(texture);

  return {
    texture,
    canvas,
    width: canvas.width,
    height: canvas.height,
    variance: validation.variance,
    darkPixelRatio: validation.darkPixelRatio,
  };
}
