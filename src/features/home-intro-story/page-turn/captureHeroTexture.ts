import * as THREE from "three";
import { domToCanvas } from "modern-screenshot";

export interface CapturedHeroResult {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/**
 * Captures the rendered DOM hero element into a high-resolution Three.js CanvasTexture.
 * Performs DPR clamping, sRGB color space alignment, anisotropic filtering,
 * and GPU pre-uploading via renderer.initTexture.
 */
export async function captureHeroTexture(
  heroElement: HTMLElement,
  renderer: THREE.WebGLRenderer
): Promise<CapturedHeroResult> {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  const maxTextureDim = Math.min(renderer.capabilities.maxTextureSize || 4096, 4096);

  const rect = heroElement.getBoundingClientRect();
  const rawWidth = Math.round(rect.width * dpr);
  const rawHeight = Math.round(rect.height * dpr);

  // Ensure dimensions do not exceed GPU limit
  const scale = Math.min(1.0, maxTextureDim / Math.max(rawWidth, rawHeight));
  const finalScale = dpr * scale;

  let canvas: HTMLCanvasElement;

  try {
    canvas = await domToCanvas(heroElement, {
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
  } catch (err) {
    console.warn("[PageTurn] modern-screenshot capture fallback:", err);
    // Fallback: create empty canvas
    canvas = document.createElement("canvas");
    canvas.width = Math.round(rect.width * finalScale);
    canvas.height = Math.round(rect.height * finalScale);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f4f1ea";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

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
  };
}
