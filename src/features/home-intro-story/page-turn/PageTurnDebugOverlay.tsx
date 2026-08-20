"use client";

import React, { useEffect, useState } from "react";
import type { PageTurnController } from "./pageTurnController";
import type { PageTurnDebugInfo } from "./page-turn.types";

interface PageTurnDebugOverlayProps {
  controller: PageTurnController;
}

export function PageTurnDebugOverlay({ controller }: PageTurnDebugOverlayProps) {
  const [info, setInfo] = useState<PageTurnDebugInfo>(() => controller.getDebugInfo());
  const [sliderProgress, setSliderProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(controller.getDebugInfo());
    }, 100);

    return () => clearInterval(interval);
  }, [controller]);

  return (
    <div
      data-testid="page-turn-debug-overlay"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        background: "rgba(18, 18, 20, 0.88)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(200, 149, 69, 0.4)",
        borderRadius: "8px",
        padding: "14px 18px",
        color: "#f4f1ea",
        fontFamily: "monospace",
        fontSize: "11px",
        lineHeight: "1.6",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
        pointerEvents: "auto",
        minWidth: "260px",
      }}
    >
      <div style={{ fontWeight: 700, color: "#c89545", marginBottom: "8px", letterSpacing: "0.08em" }}>
        PAGE-TURN V2 DIAGNOSTICS
      </div>

      <div>Progress: {(info.progress * 100).toFixed(1)}%</div>
      <div>Fold X: {info.foldAxisX.toFixed(2)}</div>
      <div>Fold Radius: {info.foldRadius.toFixed(2)}</div>
      <div>Twist: {info.twistAmount.toFixed(4)}</div>
      <div>Draw Calls: {info.drawCalls}</div>
      <div>Triangles: {info.triangles}</div>
      <div>Texture: {info.textureRes}</div>
      <div>
        Frame: {info.frameMs} ms ({info.fps} fps)
      </div>

      <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ marginBottom: "4px", color: "#c89545" }}>Debug Mode:</div>
        <select
          value={info.debugMode}
          onChange={(e) => controller.setDebugMode(Number(e.target.value))}
          style={{
            width: "100%",
            background: "#222",
            color: "#fff",
            border: "1px solid #444",
            padding: "4px 6px",
            borderRadius: "4px",
            fontSize: "11px",
          }}
        >
          <option value={0}>0: Final Composite</option>
          <option value={1}>1: Front Texture Only</option>
          <option value={2}>2: Back Paper Only</option>
          <option value={3}>3: Surface Normals</option>
          <option value={4}>4: Curvature Mask</option>
        </select>
      </div>

      <div style={{ marginTop: "8px" }}>
        <div style={{ marginBottom: "4px", color: "#c89545" }}>Scrub Progress:</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={sliderProgress}
          onChange={(e) => {
            const p = parseFloat(e.target.value);
            setSliderProgress(p);
            controller.setProgress(p);
          }}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
