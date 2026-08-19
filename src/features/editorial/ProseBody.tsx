"use client";

import React, { useEffect, useRef } from "react";
import styles from "./prose-highlighter.module.css";

interface ProseBodyProps {
  html: string;
  className?: string;
}

/**
 * ProseBody renders post/article HTML and observes any `<mark>` elements.
 * When a highlight scrolls into the viewport (documentary style), it triggers
 * a fluid, organic yellow-gold marker sweep with realistic pen texture,
 * soft bleeding edges, and slight ink grain.
 */
export function ProseBody({ html, className = "" }: ProseBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const marks = container.querySelectorAll("mark");
    if (marks.length === 0) return;

    if (prefersReducedMotion) {
      marks.forEach((mark) => {
        mark.classList.add(styles.highlightDrawn);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.highlightDrawn);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    marks.forEach((mark) => {
      mark.classList.add(styles.editorialHighlight);
      observer.observe(mark);
    });

    return () => {
      observer.disconnect();
    };
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`${styles.proseRoot} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
