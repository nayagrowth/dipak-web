"use client";

import React, { useEffect, useRef, useState } from "react";
import { captureHeroTexture } from "./captureHeroTexture";
import { createPageTurnScene } from "./createPageTurnScene";
import { PageTurnController } from "./pageTurnController";
import { PageTurnDebugOverlay } from "./PageTurnDebugOverlay";

interface HeroPageTurnCanvasProps {
  heroElementRef: React.RefObject<HTMLElement | null>;
  onControllerReady?: (controller: PageTurnController) => void;
  className?: string;
}

export function HeroPageTurnCanvas({
  heroElementRef,
  onControllerReady,
  className,
}: HeroPageTurnCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<PageTurnController | null>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [controllerReady, setControllerReady] = useState(false);

  useEffect(() => {
    // Check debug flag from URL query param ?debugPageTurn=1
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setDebugEnabled(params.get("debugPageTurn") === "1");
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 769;

    // WebGL capability detection
    let hasWebGL2 = false;
    try {
      const testCanvas = document.createElement("canvas");
      hasWebGL2 = Boolean(testCanvas.getContext("webgl2"));
    } catch {
      hasWebGL2 = false;
    }

    if (isReducedMotion || isMobile || !hasWebGL2) {
      return;
    }

    let isMounted = true;

    async function initPageTurn() {
      const heroEl = heroElementRef.current;
      if (!heroEl || !canvas) return;

      const rect = heroEl.getBoundingClientRect();
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      // 1. Capture hero texture
      // Create temporary renderer for capture and texture preparation
      const tempRenderer = new (await import("three")).WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      const { texture } = await captureHeroTexture(heroEl, tempRenderer);
      tempRenderer.dispose();

      if (!isMounted) {
        texture.dispose();
        return;
      }

      // 2. Create isolated Three.js page-turn scene
      const refs = await createPageTurnScene(canvas, width, height, texture);

      if (!isMounted) {
        refs.renderer.dispose();
        refs.mesh.geometry.dispose();
        return;
      }

      const controller = new PageTurnController(refs);
      controllerRef.current = controller;
      setControllerReady(true);
      onControllerReady?.(controller);

      // 3. Initial render at p = 0
      controller.setProgress(0);

      // 4. Resize handling
      const handleResize = () => {
        if (!heroElementRef.current || !controllerRef.current) return;
        const r = heroElementRef.current.getBoundingClientRect();
        controllerRef.current.resize(r.width || window.innerWidth, r.height || window.innerHeight);
      };

      window.addEventListener("resize", handleResize, { passive: true });

      return () => {
        window.removeEventListener("resize", handleResize);
        controller.dispose();
      };
    }

    const cleanupPromise = initPageTurn();

    return () => {
      isMounted = false;
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, [heroElementRef, onControllerReady]);

  return (
    <>
      <canvas
        ref={canvasRef}
        data-page-turn-canvas="true"
        className={className}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
        aria-hidden="true"
      />
      {debugEnabled && controllerReady && controllerRef.current && (
        <PageTurnDebugOverlay controller={controllerRef.current} />
      )}
    </>
  );
}
