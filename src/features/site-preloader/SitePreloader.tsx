"use client";

import React, { useEffect, useState } from "react";
import styles from "./site-preloader.module.css";

interface SitePreloaderProps {
  onComplete?: () => void;
}

export function SitePreloader({ onComplete }: SitePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, 0);
      return () => clearTimeout(timer);
    }

    // Lock scroll during luxury preloader sequence
    document.body.style.overflow = "hidden";

    const duration = 1200; // 1.2s smooth luxury counter duration
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progressPercent = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(progressPercent);

      if (progressPercent < 100) {
        requestAnimationFrame(updateCounter);
      } else {
        // Trigger smooth shutter exit
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            setIsComplete(true);
            document.body.style.overflow = "";
            onComplete?.();
          }, 650); // Match CSS curtain transition
        }, 160);
      }
    };

    const frameId = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (isComplete) return null;

  const formattedCount = String(progress).padStart(2, "0");

  return (
    <aside
      className={`${styles.preloaderRoot} ${isExiting ? styles.preloaderExiting : ""}`}
      aria-label="Loading Dipak Vishwakarma official experience"
      aria-live="polite"
    >
      {/* Dual Curtain Shutters for Cinematic Opening */}
      <div className={`${styles.curtain} ${styles.curtainTop}`} aria-hidden="true" />
      <div className={`${styles.curtain} ${styles.curtainBottom}`} aria-hidden="true" />

      <div className={styles.preloaderContent}>
        {/* Luminous Golden Ensō Emblem */}
        <div className={styles.ensoWrapper} aria-hidden="true">
          <svg viewBox="0 0 400 400" className={styles.ensoSvg}>
            <circle
              cx="200"
              cy="200"
              r="140"
              className={styles.ensoTrack}
            />
            <circle
              cx="200"
              cy="200"
              r="140"
              className={styles.ensoBar}
              style={{
                strokeDashoffset: 880 - (880 * progress) / 100,
              }}
            />
          </svg>
          <div className={styles.monogram}>DV</div>
        </div>

        {/* Brand Lockup */}
        <div className={styles.titleLockup}>
          <span className={styles.brandName}>DIPAK VISHWAKARMA</span>
          <span className={styles.brandRole}>THE CERTAINTY BUILDER™</span>
        </div>

        {/* Precision Luxury Metric Counter */}
        <div className={styles.counterRow}>
          <span className={styles.counterNumber}>{formattedCount}</span>
          <span className={styles.counterPercent}>%</span>
        </div>

        {/* Hairline Gold Loading Rule */}
        <div className={styles.goldLineTrack} aria-hidden="true">
          <div
            className={styles.goldLineFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
