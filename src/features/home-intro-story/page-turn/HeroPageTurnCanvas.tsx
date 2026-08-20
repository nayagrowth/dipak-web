"use client";

import React, { useEffect, useRef, useState } from "react";
import { captureHeroTexture } from "./captureHeroTexture";
import { createPageTurnScene } from "./createPageTurnScene";
import { PageTurnController } from "./pageTurnController";
import { PageTurnDebugOverlay } from "./PageTurnDebugOverlay";

interface HeroPageTurnCanvasProps {
  heroElementRef: React.RefObject<HTMLElement | null>;
  isPreloaderReady?: boolean;
  onControllerReady?: (controller: PageTurnController) => void;
  onPageTurnReady?: (ready: boolean) => void;
  className?: string;
}

export function HeroPageTurnCanvas({
  heroElementRef,
  isPreloaderReady = true,
  onControllerReady,
  onPageTurnReady,
  className,
}: HeroPageTurnCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [controller, setController] = useState<PageTurnController | null>(null);
  const [readyStatus, setReadyStatus] = useState<"idle" | "ready" | "failed">("idle");
  const [debugEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("debugPageTurn") === "1";
    }
    return false;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPreloaderReady) return;

    let isMounted = true;
    let localController: PageTurnController | null = null;

    async function initPageTurn() {
      const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 769;

      let hasWebGL2 = false;
      try {
        const testCanvas = document.createElement("canvas");
        hasWebGL2 = Boolean(testCanvas.getContext("webgl2"));
      } catch {
        hasWebGL2 = false;
      }

      if (isReducedMotion || isMobile || !hasWebGL2) {
        if (isMounted) {
          setReadyStatus("failed");
          onPageTurnReady?.(false);
        }
        return;
      }

      const heroEl = heroElementRef.current;
      if (!heroEl || !canvas) {
        if (isMounted) {
          setReadyStatus("failed");
          onPageTurnReady?.(false);
        }
        return;
      }

      try {
        const rect = heroEl.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        // 1. Capture hero texture with finite animation waiting and statistical variance validation
        const THREE = await import("three");
        const tempRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
        });

        const captureResult = await captureHeroTexture(heroEl, tempRenderer);
        tempRenderer.dispose();

        if (!isMounted) {
          captureResult.texture.dispose();
          return;
        }

        // 2. Create isolated Three.js page-turn scene
        const refs = await createPageTurnScene(canvas, width, height, captureResult.texture);

        if (!isMounted) {
          refs.renderer.dispose();
          refs.mesh.geometry.dispose();
          return;
        }

        const ctrl = new PageTurnController(refs);
        localController = ctrl;
        setController(ctrl);
        onControllerReady?.(ctrl);

        // 3. Initial offscreen/hidden render at p = 0 to verify compile
        ctrl.setProgress(0);

        // Check for direct freeze query in URL (e.g. ?pageTurnProgress=0.35 or ?freezeProgress=0.35)
        const params = new URLSearchParams(window.location.search);
        const freezeP = params.get("pageTurnProgress") ?? params.get("freezeProgress");
        if (freezeP !== null) {
          const parsed = parseFloat(freezeP);
          if (!isNaN(parsed)) {
            ctrl.setProgress(parsed);
            if (canvas) {
              canvas.style.opacity = "1";
              canvas.style.visibility = "visible";
            }
          }
        }

        setReadyStatus("ready");
        onPageTurnReady?.(true);

        if (canvas) {
          canvas.setAttribute("data-page-turn-ready", "true");
          canvas.setAttribute("data-page-turn-capture", "valid");
          canvas.setAttribute(
            "data-texture-res",
            `${captureResult.width}x${captureResult.height}`
          );
        }

        // 4. Resize handling
        const handleResize = () => {
          if (!heroElementRef.current || !localController) return;
          const r = heroElementRef.current.getBoundingClientRect();
          localController.resize(r.width || window.innerWidth, r.height || window.innerHeight);
        };

        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
          window.removeEventListener("resize", handleResize);
          ctrl.dispose();
        };
      } catch (err) {
        console.warn("[PageTurn] WebGL page-turn initialization bypassed:", err);
        setReadyStatus("failed");
        onPageTurnReady?.(false);
        if (canvas) {
          canvas.setAttribute("data-page-turn-ready", "false");
          canvas.setAttribute("data-page-turn-capture", "failed");
        }
      }
    }

    const cleanupPromise = initPageTurn();

    return () => {
      isMounted = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [heroElementRef, isPreloaderReady, onControllerReady, onPageTurnReady]);

  return (
    <>
      <canvas
        ref={canvasRef}
        data-page-turn-canvas="true"
        data-page-turn-ready={readyStatus === "ready" ? "true" : "false"}
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
          opacity: 0,
          visibility: "hidden",
          transition: "none",
        }}
        aria-hidden="true"
      />
      {debugEnabled && controller && (
        <PageTurnDebugOverlay controller={controller} />
      )}
    </>
  );
}
