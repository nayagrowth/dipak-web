"use client";

import React, { useEffect, useState } from "react";
import type { PageTurnController } from "./pageTurnController";
import type { PageTurnDebugInfo } from "./page-turn.types";

interface PageTurnDebugOverlayProps {
  controller: PageTurnController;
}

export function PageTurnDebugOverlay({ controller }: PageTurnDebugOverlayProps) {
  const [info, setInfo] = useState<PageTurnDebugInfo>(() => controller.getDebugInfo());
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setInfo(controller.getDebugInfo());
    }, 100);
    return () => clearInterval(interval);
  }, [controller]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderValue(val);
    controller.setProgress(val);
    setInfo(controller.getDebugInfo());
  };

  const setFixedProgress = (p: number) => {
    setSliderValue(p);
    controller.setProgress(p);
    setInfo(controller.getDebugInfo());
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        background: "rgba(17, 17, 15, 0.92)",
        color: "#f4f1ea",
        padding: "1rem 1.25rem",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "0.78rem",
        lineHeight: "1.4",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        border: "1px solid rgba(200, 149, 69, 0.4)",
        maxWidth: "340px",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.6rem",
          borderBottom: "1px solid rgba(200, 149, 69, 0.3)",
          paddingBottom: "0.4rem",
        }}
      >
        <span style={{ color: "#c89545", fontWeight: 700, letterSpacing: "0.08em" }}>
          THREE.JS PAGE-TURN QA
        </span>
        <span style={{ color: info.frameMs < 16.7 ? "#4ade80" : "#f87171" }}>
          {info.frameMs}ms ({info.fps} fps)
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem", marginBottom: "0.6rem" }}>
        <div>Progress: <strong style={{ color: "#c89545" }}>{info.progress.toFixed(3)}</strong></div>
        <div>FOV: {info.cameraFov}°</div>
        <div>Fold X: {info.foldAxisX.toFixed(2)}</div>
        <div>Radius: {info.foldRadius.toFixed(2)}</div>
        <div>Twist: {info.twistAmount.toFixed(3)}</div>
        <div>Triangles: {info.triangles}</div>
        <div>Draw Calls: {info.drawCalls}</div>
        <div>Texture: {info.textureRes}</div>
      </div>

      {/* Manual Progress Slider */}
      <div style={{ marginTop: "0.6rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
          <span>Manual Progress:</span>
          <span>{sliderValue.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.005"
          value={sliderValue}
          onChange={handleSliderChange}
          style={{ width: "100%", accentColor: "#c89545", cursor: "pointer" }}
        />
      </div>

      {/* Quick Checkpoint Buttons */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.25rem",
          marginTop: "0.6rem",
        }}
      >
        {[0, 0.08, 0.18, 0.3, 0.42, 0.5, 0.6, 0.72, 0.85, 1.0].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFixedProgress(p)}
            style={{
              background: sliderValue === p ? "#c89545" : "rgba(255,255,255,0.1)",
              color: sliderValue === p ? "#11110f" : "#f4f1ea",
              border: "1px solid rgba(200, 149, 69, 0.3)",
              borderRadius: "3px",
              padding: "0.15rem 0.35rem",
              fontSize: "0.7rem",
              cursor: "pointer",
            }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
