"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { PageTurnController } from "./page-turn";
import { range } from "./page-turn/pageTurnMath";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHomeIntroTimelineProps {
  shellRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  bridgeRuleRef: RefObject<HTMLElement | null>;
  heroFrontRef?: RefObject<HTMLElement | null>;
  pageTurnCtrlRef?: RefObject<PageTurnController | null>;
  pageTurnReady?: boolean;
}

export function useHomeIntroTimeline({
  shellRef,
  stageRef,
  bridgeRuleRef,
  heroFrontRef,
  pageTurnCtrlRef,
  pageTurnReady = false,
}: UseHomeIntroTimelineProps) {
  useLayoutEffect(() => {
    const shell = shellRef.current;
    const stage = stageRef.current;
    const bridgeRule = bridgeRuleRef.current;
    const heroFront = heroFrontRef?.current;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        "[data-story-act1-wrapper], [data-story-act2-wrapper], [data-story-act3-wrapper], [data-story-act4-wrapper], [data-story-act5], [data-story-act6], [data-story-act7]",
        {
          opacity: 1,
          visibility: "visible",
        }
      );
      return;
    }

    const mm = gsap.matchMedia();

    // =========================================================================
    // 1. DESKTOP CONTINUOUS STORY CHOREOGRAPHY (>= 769px)
    // =========================================================================
    mm.add("(min-width: 769px)", () => {
      if (!shell || !stage) return;

      // -----------------------------------------------------------------------
      // PART 1-4: PINNED 4-ACT STORY TIMELINE (Acts 1 to 4)
      // -----------------------------------------------------------------------
      const act1Wrapper = stage.querySelector("[data-story-act1-wrapper]");
      const act2Wrapper = stage.querySelector("[data-story-act2-wrapper]");
      const act3Wrapper = stage.querySelector("[data-story-act3-wrapper]");
      const act4Wrapper = stage.querySelector("[data-story-act4-wrapper]");

      const act2Index = stage.querySelector("[data-story-act2-index]");
      const act2HeadlineLines = stage.querySelectorAll(
        "[data-story-act2-headline]"
      );
      const act2Highlights = stage.querySelectorAll(
        "[data-story-act2-highlight]"
      );
      const act2StructuralRules = stage.querySelectorAll(
        "[data-story-act2-rule], [data-story-act2-rule2]"
      );
      const act2Role = stage.querySelector("[data-story-act2-role]");
      const act2Bio = stage.querySelector("[data-story-act2-bio]");
      const act2Stats = stage.querySelectorAll(
        "[data-story-act2-stats] > div"
      );
      const act2Sunlight = stage.querySelector("[data-story-act2-sunlight]");
      const act2Ambient = stage.querySelector("[data-story-act2-ambient]");
      const act23DHeadline = stage.querySelector("[data-story-act2-3dheadline]");

      const act3Ticket = stage.querySelector("[data-story-act3-ticket]");
      const act3Florets = stage.querySelectorAll("[data-story-act3-floret]");
      const act3Scallops = stage.querySelectorAll("[data-story-act3-scallop]");
      const act3Axis = stage.querySelector("[data-story-act3-axis]");
      const act3AxisFloret = stage.querySelector("[data-story-act3-axis-floret]");
      const act3Index = stage.querySelector("[data-story-act3-index]");
      const act3HeadlineLines = stage.querySelectorAll(
        "[data-story-act3-headline]"
      );
      const act3MetaLabel = stage.querySelector("[data-story-act3-meta-label]");
      const act3MetaStar = stage.querySelector("[data-story-act3-meta-star]");
      const act3Note = stage.querySelector("[data-story-act3-note]");
      const act3Items = stage.querySelectorAll("[data-story-act3-item]");
      const act3Badges = stage.querySelectorAll("[data-story-act3-badge]");
      const act3Titles = stage.querySelectorAll("[data-story-act3-item-title]");

      const act4Index = stage.querySelector("[data-story-act4-index]");
      const act4Kicker = stage.querySelector("[data-story-act4-kicker]");
      const act4Lines = stage.querySelectorAll("[data-story-act4-line]");
      const act4Rule = stage.querySelector("[data-story-act4-rule]");
      const act4Tenets = stage.querySelector("[data-story-act4-tenets]");
      const act4Enso = stage.querySelector("[data-story-act4-enso]");

      if (bridgeRule) {
        gsap.set(bridgeRule, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "left center",
        });
      }

      // Initial 3D Spatial States
      if (act1Wrapper) {
        gsap.set(act1Wrapper, {
          opacity: 1,
          visibility: "visible",
        });
      }

      if (heroFront) {
        gsap.set(heroFront, { opacity: 1 });
      }

      // Act 2 starts completely sharp & visible underneath the physical sheet (no scale or blur pops)
      gsap.set(act2Wrapper, { visibility: "visible", opacity: 1, scale: 1 });
      gsap.set(act3Wrapper, { visibility: "hidden", opacity: 0 });
      gsap.set(act4Wrapper, { visibility: "hidden", opacity: 0 });

      if (act2Sunlight) gsap.set(act2Sunlight, { opacity: 0, x: -30 });
      if (act2Ambient) gsap.set(act2Ambient, { opacity: 0 });
      if (act23DHeadline) gsap.set(act23DHeadline, { perspective: 1000, rotateY: 0, rotateX: 0 });

      // Internal text/content masks start hidden until physically uncovered
      gsap.set(act2Index, { opacity: 0, y: -8 });
      gsap.set(act2HeadlineLines, { yPercent: 105 });
      if (act2Highlights.length) {
        gsap.set(act2Highlights, { backgroundSize: "0% 100%" });
      }
      gsap.set(act2StructuralRules, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "left center",
      });
      gsap.set(act2Role, { opacity: 0, y: 10 });
      gsap.set(act2Bio, { opacity: 0, y: 12 });
      gsap.set(act2Stats, { opacity: 0, y: 14 });

      gsap.set(act3Ticket, {
        opacity: 0,
        y: 12,
        transformOrigin: "center center",
      });
      gsap.set(act3Florets, {
        opacity: 0,
        scale: 0.85,
        transformOrigin: "center center",
      });
      gsap.set(act3Scallops, {
        opacity: 0,
        transformOrigin: "center center",
      });
      gsap.set(act3Axis, {
        scaleX: 0,
        opacity: 0,
        transformOrigin: "center",
      });
      gsap.set(act3AxisFloret, {
        scale: 0.4,
        opacity: 0,
      });
      gsap.set(act3Index, { opacity: 0, y: -8 });
      gsap.set(act3HeadlineLines, { yPercent: 105 });
      gsap.set(act3MetaLabel, { opacity: 0, y: -6 });
      gsap.set(act3MetaStar, { scale: 0.4, opacity: 0 });
      gsap.set(act3Note, { opacity: 0, y: 10 });
      gsap.set(act3Badges, { opacity: 0, y: 8 });
      gsap.set(act3Titles, { opacity: 0, y: 6 });
      gsap.set(act3Items, { opacity: 0, y: 8 });

      gsap.set(act4Index, { opacity: 0, y: -8 });
      gsap.set(act4Kicker, { opacity: 0, y: -6 });
      gsap.set(act4Lines, { yPercent: 105 });
      gsap.set(act4Rule, { scaleX: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(act4Tenets, { opacity: 0, y: 16 });
      if (act4Enso) {
        gsap.set(act4Enso, { opacity: 0, rotate: -25, scale: 0.85 });
      }

      // MASTER TIMELINE: Luxury Editorial Scrub (0.45 scrub for deliberate physical mass)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: shell,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45, // Deliberate physical mass and tactile feedback
          pin: stage,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      const pageTurnCanvas = stage.querySelector<HTMLCanvasElement>("[data-page-turn-canvas=\"true\"]");

      // -----------------------------------------------------------------------
      // BEAT 1: DEFORMABLE PAGE TURN / TRANSITION (0.00 -> 0.27)
      // If WebGL is ready, executes real-time cylindrical page-curl transition.
      // If WebGL is unavailable or failed validation, performs smooth standard DOM fade.
      // -----------------------------------------------------------------------
      masterTl.addLabel("PAGE_FLIP", 0.0);

      if (pageTurnReady) {
        // 1. Crisp DOM Hero -> WebGL Canvas Handoff (0.00 -> 0.015)
        if (heroFront) {
          masterTl.to(
            heroFront,
            {
              opacity: 0,
              duration: 0.015,
              ease: "none",
            },
            "PAGE_FLIP"
          );
        }

        if (pageTurnCanvas) {
          masterTl.to(
            pageTurnCanvas,
            {
              autoAlpha: 1,
              duration: 0.015,
              ease: "none",
            },
            "PAGE_FLIP"
          );
        }

        // 2. Drive Three.js PageTurnController progress (0.00 -> 0.27)
        const pageTurnProxy = { p: 0 };
        masterTl.to(
          pageTurnProxy,
          {
            p: 1.0,
            duration: 0.27,
            ease: "none",
            onUpdate: () => {
              if (pageTurnCtrlRef?.current) {
                pageTurnCtrlRef.current.setProgress(pageTurnProxy.p);

                // 3. Fold Edge -> DOM Gold Rule Bridge screen projection handoff (p = 0.45 to 0.75)
                if (bridgeRule && pageTurnProxy.p >= 0.45 && pageTurnProxy.p <= 0.78) {
                  const coords = pageTurnCtrlRef.current.getFoldScreenCoordinates(
                    window.innerWidth,
                    window.innerHeight
                  );
                  if (coords) {
                    const goldAlpha = range(pageTurnProxy.p, 0.45, 0.65);
                    gsap.set(bridgeRule, {
                      opacity: goldAlpha,
                      x: coords.x - coords.length / 2,
                      y: coords.y,
                      rotation: (coords.angleRad * 180) / Math.PI,
                      width: coords.length,
                      scaleX: 1,
                    });
                  }
                } else if (bridgeRule && pageTurnProxy.p > 0.78) {
                  gsap.set(bridgeRule, { opacity: 0 });
                }
              }
            },
          },
          "PAGE_FLIP"
        );

        if (pageTurnCanvas) {
          masterTl.to(
            pageTurnCanvas,
            {
              autoAlpha: 0,
              duration: 0.02,
            },
            "PAGE_FLIP+=0.25"
          );
        }

        if (act1Wrapper) {
          masterTl.set(
            act1Wrapper,
            {
              visibility: "hidden",
            },
            "PAGE_FLIP+=0.27"
          );
        }
      } else {
        // Fallback: standard smooth DOM fade when WebGL is unready / reduced motion
        if (heroFront) {
          masterTl.to(
            heroFront,
            {
              opacity: 0,
              y: -25,
              duration: 0.25,
              ease: "power2.inOut",
            },
            "PAGE_FLIP"
          );
        }

        if (act1Wrapper) {
          masterTl.set(
            act1Wrapper,
            {
              visibility: "hidden",
            },
            "PAGE_FLIP+=0.27"
          );
        }
      }

      // -----------------------------------------------------------------------
      // BEAT 2: ACT 2 INTERNAL REVEALS (0.27 -> 0.42)
      // Staggered luxury reveal as the page completely clears the viewport
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT2_ENTER", 0.27);

      if (act2Sunlight) {
        masterTl.to(
          act2Sunlight,
          {
            opacity: 0.5,
            x: 0,
            duration: 0.15,
            ease: "power2.out",
          },
          "ACT2_ENTER"
        );
      }

      if (act2Ambient) {
        masterTl.to(
          act2Ambient,
          {
            opacity: 0.25,
            duration: 0.15,
            ease: "power2.out",
          },
          "ACT2_ENTER"
        );
      }

      // 1. Section Index
      if (act2Index) {
        masterTl.to(
          act2Index,
          {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.01"
        );
      }

      // 2. THE CERTAINTY BUILDER™ Headline
      if (act2HeadlineLines.length) {
        masterTl.to(
          act2HeadlineLines,
          {
            yPercent: 0,
            duration: 0.12,
            stagger: 0.025,
            ease: "power3.out",
          },
          "ACT2_ENTER+=0.02"
        );
      }

      if (act2Highlights.length) {
        masterTl.to(
          act2Highlights,
          {
            backgroundSize: "100% 100%",
            duration: 0.12,
            stagger: 0.05,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.06"
        );
      }

      // 3. Structural Rules
      if (act2StructuralRules.length) {
        masterTl.to(
          act2StructuralRules,
          {
            scaleX: 1,
            opacity: 0.85,
            duration: 0.1,
            stagger: 0.03,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.04"
        );
      }

      // 4. Founder Role & Bio
      if (act2Role) {
        masterTl.to(
          act2Role,
          {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.05"
        );
      }

      if (act2Bio) {
        masterTl.to(
          act2Bio,
          {
            opacity: 1,
            y: 0,
            duration: 0.09,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.06"
        );
      }

      // 5. Metric Ledger (power3.out editorial ease, NO back bounce)
      if (act2Stats.length) {
        masterTl.to(
          act2Stats,
          {
            opacity: 1,
            y: 0,
            duration: 0.1,
            stagger: 0.025,
            ease: "power3.out",
          },
          "ACT2_ENTER+=0.08"
        );
      }

      // -----------------------------------------------------------------------
      // BEAT 2.5: ACT 2 SOLID READING HOLD (0.42 -> 0.63)
      // Generous reading pause so user can absorb content before Act 3
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT2_HOLD", 0.42);
      masterTl.to({}, { duration: 0.21 }, "ACT2_HOLD");

      // -----------------------------------------------------------------------
      // BEAT 3: ACT 2 ➔ ACT 3 (PRESENCE) (0.63 -> 0.74)
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT2_TO_ACT3", 0.63);

      if (act2Sunlight) {
        masterTl.to(
          act2Sunlight,
          {
            opacity: 0,
            x: 15,
            duration: 0.08,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act2Ambient) {
        masterTl.to(
          act2Ambient,
          {
            opacity: 0,
            duration: 0.08,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act2Role) {
        masterTl.to(
          act2Role,
          {
            y: -14,
            opacity: 0,
            duration: 0.06,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act2Bio) {
        masterTl.to(
          act2Bio,
          {
            y: -14,
            opacity: 0,
            duration: 0.06,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act2Stats.length) {
        masterTl.to(
          act2Stats,
          {
            y: 20,
            opacity: 0,
            duration: 0.06,
            stagger: 0.015,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act2Index) {
        masterTl.to(
          act2Index,
          {
            y: -16,
            opacity: 0,
            duration: 0.06,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      if (act23DHeadline) {
        masterTl.to(
          act23DHeadline,
          {
            scale: 1.08,
            letterSpacing: "0.02em",
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT2_TO_ACT3"
        );
        masterTl.to(
          act23DHeadline,
          {
            scale: 1.14,
            opacity: 0,
            y: -18,
            duration: 0.07,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3+=0.04"
        );
      } else if (act2HeadlineLines.length) {
        masterTl.to(
          act2HeadlineLines,
          {
            yPercent: -105,
            opacity: 0,
            duration: 0.08,
            stagger: 0.015,
            ease: "power2.inOut",
          },
          "ACT2_TO_ACT3+=0.03"
        );
      }

      if (act2StructuralRules.length) {
        masterTl.to(
          act2StructuralRules,
          {
            scaleX: 1.25,
            opacity: 0,
            duration: 0.09,
            stagger: 0.02,
            ease: "power2.inOut",
          },
          "ACT2_TO_ACT3+=0.02"
        );
      }

      masterTl.to(
        act2Wrapper,
        {
          opacity: 0,
          duration: 0.08,
          ease: "power1.in",
        },
        "ACT2_TO_ACT3+=0.03"
      );

      masterTl.set(
        act2Wrapper,
        {
          visibility: "hidden",
        },
        "ACT2_TO_ACT3+=0.11"
      );

      // -----------------------------------------------------------------------
      // BEAT 4: ACT 3 ENTRANCE & HOLD (0.74 -> 0.88)
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT3_ENTER", 0.74);
      masterTl.set(
        act3Wrapper,
        {
          visibility: "visible",
          opacity: 1,
        },
        "ACT3_ENTER"
      );

      if (act3Ticket) {
        masterTl.to(
          act3Ticket,
          {
            opacity: 1,
            y: 0,
            duration: 0.08,
            ease: "power2.out",
          },
          "ACT3_ENTER"
        );
      }

      if (act3Florets.length) {
        masterTl.to(
          act3Florets,
          {
            opacity: 1,
            scale: 1,
            duration: 0.07,
            stagger: 0.015,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.01"
        );
      }

      if (act3Scallops.length) {
        masterTl.to(
          act3Scallops,
          {
            opacity: 1,
            duration: 0.07,
            stagger: 0.01,
            ease: "power1.out",
          },
          "ACT3_ENTER+=0.01"
        );
      }

      if (act3Axis) {
        masterTl.to(
          act3Axis,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.08,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.02"
        );
      }

      if (act3AxisFloret) {
        masterTl.to(
          act3AxisFloret,
          {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }

      if (act3Index) {
        masterTl.to(
          act3Index,
          {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT3_ENTER"
        );
      }

      if (act3HeadlineLines.length) {
        masterTl.to(
          act3HeadlineLines,
          {
            yPercent: 0,
            duration: 0.08,
            stagger: 0.02,
            ease: "power3.out",
          },
          "ACT3_ENTER+=0.01"
        );
      }

      if (act3MetaLabel) {
        masterTl.to(
          act3MetaLabel,
          {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.02"
        );
      }

      if (act3MetaStar) {
        masterTl.to(
          act3MetaStar,
          {
            scale: 1,
            opacity: 1,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.02"
        );
      }

      if (act3Note) {
        masterTl.to(
          act3Note,
          {
            opacity: 1,
            y: 0,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.02"
        );
      }

      if (act3Badges.length) {
        masterTl.to(
          act3Badges,
          {
            opacity: 1,
            y: 0,
            duration: 0.07,
            stagger: 0.015,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }

      if (act3Titles.length) {
        masterTl.to(
          act3Titles,
          {
            opacity: 1,
            y: 0,
            duration: 0.07,
            stagger: 0.015,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }

      if (act3Items.length) {
        masterTl.to(
          act3Items,
          {
            opacity: 1,
            y: 0,
            duration: 0.07,
            stagger: 0.015,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }

      // ACT 3 HOLD
      masterTl.addLabel("ACT3_HOLD", 0.84);
      masterTl.to({}, { duration: 0.04 }, "ACT3_HOLD");

      // -----------------------------------------------------------------------
      // BEAT 5: ACT 3 ➔ ACT 4 (MANIFESTO CONVERGENCE) (0.88 -> 0.94)
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT3_TO_ACT4", 0.88);

      if (act3Items.length) {
        masterTl.to(
          act3Items,
          {
            y: 20,
            opacity: 0,
            duration: 0.05,
            stagger: 0.01,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4"
        );
      }

      if (act3HeadlineLines.length) {
        masterTl.to(
          act3HeadlineLines,
          {
            yPercent: -105,
            opacity: 0,
            duration: 0.06,
            stagger: 0.01,
            ease: "power2.inOut",
          },
          "ACT3_TO_ACT4"
        );
      }

      if (act3Ticket) {
        masterTl.to(
          act3Ticket,
          {
            opacity: 0,
            scale: 0.98,
            duration: 0.06,
            ease: "power2.inOut",
          },
          "ACT3_TO_ACT4"
        );
      }

      if (act3Axis) {
        masterTl.to(
          act3Axis,
          {
            scaleX: 1.2,
            opacity: 0,
            duration: 0.05,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4"
        );
      }

      masterTl.set(
        act3Wrapper,
        {
          visibility: "hidden",
        },
        "ACT3_TO_ACT4+=0.06"
      );

      // -----------------------------------------------------------------------
      // BEAT 6: ACT 4 ENTRANCE & FINAL HOLD (0.94 -> 1.00)
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT4_ENTER", 0.94);
      masterTl.set(
        act4Wrapper,
        {
          visibility: "visible",
          opacity: 1,
        },
        "ACT4_ENTER"
      );

      if (act4Enso) {
        masterTl.to(
          act4Enso,
          {
            opacity: 0.05,
            rotate: 0,
            scale: 1,
            duration: 0.06,
            ease: "power2.out",
          },
          "ACT4_ENTER"
        );
      }

      if (act4Index) {
        masterTl.to(
          act4Index,
          {
            opacity: 1,
            y: 0,
            duration: 0.04,
            ease: "power2.out",
          },
          "ACT4_ENTER"
        );
      }

      if (act4Kicker) {
        masterTl.to(
          act4Kicker,
          {
            opacity: 1,
            y: 0,
            duration: 0.04,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.01"
        );
      }

      if (act4Lines.length) {
        masterTl.to(
          act4Lines,
          {
            yPercent: 0,
            duration: 0.06,
            stagger: 0.015,
            ease: "power3.out",
          },
          "ACT4_ENTER+=0.01"
        );
      }

      if (act4Rule) {
        masterTl.to(
          act4Rule,
          {
            scaleX: 1,
            opacity: 0.8,
            duration: 0.05,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.02"
        );
      }

      if (act4Tenets) {
        masterTl.to(
          act4Tenets,
          {
            opacity: 1,
            y: 0,
            duration: 0.05,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.02"
        );
      }

      masterTl.addLabel("ACT4_HOLD", 0.98);
      masterTl.to({}, { duration: 0.02 }, "ACT4_HOLD");

      // -----------------------------------------------------------------------
      // PART 5: ACT 5 ARCHITECTURAL DOMAIN LEDGER REVEALS
      // -----------------------------------------------------------------------
      const act5Section = document.querySelector('[data-story-act5="true"]');
      if (act5Section) {
        const act5Index = act5Section.querySelector("[data-story-act5-index]");
        const act5Headlines = act5Section.querySelector("h2");
        const act5Note = act5Section.querySelector("[data-story-act5-note]");

        gsap.from([act5Index, act5Headlines, act5Note], {
          scrollTrigger: {
            trigger: act5Section,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 18,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        });
      }

      // -----------------------------------------------------------------------
      // PART 6: ACTS 6 AND 7 (Below Stages)
      // -----------------------------------------------------------------------
      const act6 = document.querySelector('[data-story-act6="true"]');
      if (act6) {
        const act6Header = act6.querySelector("header");
        const act6Video = act6.querySelector("[data-story-act6-video]");
        const act6ArticlesBlock = act6.querySelector("[data-story-act6-articles]");
        const act6EssayRows = act6.querySelectorAll("[data-story-act6-essay-row]");

        if (act6Header) {
          gsap.from(act6Header, {
            scrollTrigger: {
              trigger: act6Header,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 18,
            duration: 0.45,
            ease: "power2.out",
          });
        }

        if (act6Video) {
          gsap.from(act6Video, {
            scrollTrigger: {
              trigger: act6Video,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 28,
            duration: 0.5,
            ease: "power3.out",
          });
        }

        if (act6ArticlesBlock && act6EssayRows.length) {
          gsap.from(act6EssayRows, {
            scrollTrigger: {
              trigger: act6ArticlesBlock,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 24,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          });
        }
      }

      // ACT 7: AUTHORITY CLOSERS BRIDGE
      const act7 = document.querySelector('[data-story-act7="true"]');
      if (act7) {
        const act7Index = act7.querySelector("[data-story-act7-index]");
        const act7Eyebrow = act7.querySelector("[data-story-act7-eyebrow]");
        const act7Headlines = act7.querySelector("h2");
        const act7Body = act7.querySelector("[data-story-act7-body]");
        const act7Ctas = act7.querySelector("[data-story-act7-ctas]");

        const tl7 = gsap.timeline({
          scrollTrigger: {
            trigger: act7,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        tl7.from([act7Index, act7Eyebrow, act7Headlines], {
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        }).from(
          [act7Body, act7Ctas],
          {
            opacity: 0,
            y: 18,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.2"
        );
      }
    });

    // =========================================================================
    // 2. MOBILE SEQUENTIAL DOCUMENT FLOW (<= 768px)
    // =========================================================================
    mm.add("(max-width: 768px)", () => {
      const allActs = [
        "[data-story-act2-wrapper]",
        "[data-story-act3-wrapper]",
        "[data-story-act4-wrapper]",
        "[data-story-act5-item]",
        "[data-story-act6]",
        "[data-story-act7]",
      ];

      allActs.forEach((actSelector) => {
        const elements = document.querySelectorAll(actSelector);
        elements.forEach((el) => {
          gsap.set(el, { visibility: "visible", opacity: 1, position: "relative" });
        });
      });
    });

    return () => mm.revert();
  }, [shellRef, stageRef, bridgeRuleRef, heroFrontRef, pageTurnCtrlRef, pageTurnReady]);
}
