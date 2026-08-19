"use client";

import { useEffect, useState } from "react";
import styles from "./editorial-preloader.module.css";

interface EditorialPreloaderProps {
  onReady?: () => void;
}

export function EditorialPreloader({ onReady }: EditorialPreloaderProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;

    async function waitForAssets() {
      // 1. Wait for webfonts to finish loading
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.ready;
        } catch {
          // fallback if fonts api fails
        }
      }

      // 2. Preload & decode critical LCP image cutouts
      const criticalImages = ["/hero/dipak-seated.webp", "/hero/enso-brush-master.webp"];
      await Promise.allSettled(
        criticalImages.map((src) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.src = src;
            if (img.complete) {
              if ("decode" in img) {
                img.decode().then(() => resolve()).catch(() => resolve());
              } else {
                resolve();
              }
            } else {
              img.onload = () => {
                if ("decode" in img) {
                  img.decode().then(() => resolve()).catch(() => resolve());
                } else {
                  resolve();
                }
              };
              img.onerror = () => resolve();
            }
          });
        })
      );

      // 3. Minimum editorial pacing buffer (350ms) to ensure butter-smooth dissolve
      await new Promise((resolve) => setTimeout(resolve, 350));

      if (active) {
        setDismissed(true);
        if (onReady) {
          onReady();
        }
      }
    }

    waitForAssets();

    // Safety fallback: maximum 2.5s timeout
    const timer = setTimeout(() => {
      if (active) {
        setDismissed(true);
        if (onReady) onReady();
      }
    }, 2500);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [onReady]);

  return (
    <div
      className={`${styles.preloaderSurface} ${dismissed ? styles.dismissed : ""}`}
      aria-hidden={dismissed ? "true" : "false"}
      role="progressbar"
      aria-label="Loading Dipak Vishwakarma official folio"
    >
      <div className={styles.brandCenter}>
        <div className={styles.monogramRing}>
          <svg viewBox="0 0 100 100" fill="none" className={styles.ringSvg}>
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <span className={styles.monogramText}>DV</span>
        </div>

        <div className={styles.brandWordmark}>
          <span className={styles.brandName}>Dipak Vishwakarma</span>
          <span className={styles.brandKicker}>The Certainty Builder™</span>
        </div>

        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarFill} />
        </div>
      </div>
    </div>
  );
}
