"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHomeIntroTimelineProps {
  shellRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  bridgeRuleRef: RefObject<HTMLElement | null>;
}

export function useHomeIntroTimeline({
  shellRef,
  stageRef,
  bridgeRuleRef,
}: UseHomeIntroTimelineProps) {
  useLayoutEffect(() => {
    const shell = shellRef.current;
    const stage = stageRef.current;
    const bridgeRule = bridgeRuleRef.current;

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
      const act1PageShadow = stage.querySelector("[data-story-page-shadow]");
      const act1PageSheen = stage.querySelector("[data-story-page-sheen]");
      const act2Wrapper = stage.querySelector("[data-story-act2-wrapper]");
      const act3Wrapper = stage.querySelector("[data-story-act3-wrapper]");
      const act4Wrapper = stage.querySelector("[data-story-act4-wrapper]");

      const act2Index = stage.querySelector("[data-story-act2-index]");
      const act2HeadlineLines = stage.querySelectorAll(
        "[data-story-act2-headline]"
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
      const act2ShadowLeft = stage.querySelector("[data-story-act2-shadow-left]");
      const act2ShadowMid = stage.querySelector("[data-story-act2-shadow-mid]");
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
          rotateY: 0,
          rotateZ: 0,
          x: 0,
          y: 0,
          transformOrigin: "left center",
        });
      }
      if (act1PageShadow) gsap.set(act1PageShadow, { opacity: 0 });
      if (act1PageSheen) gsap.set(act1PageSheen, { opacity: 0 });

      gsap.set(act2Wrapper, { visibility: "hidden", opacity: 0, scale: 0.96, filter: "blur(4px)" });
      gsap.set(act3Wrapper, { visibility: "hidden", opacity: 0 });
      gsap.set(act4Wrapper, { visibility: "hidden", opacity: 0 });

      if (act2Sunlight) gsap.set(act2Sunlight, { opacity: 0, x: -30 });
      if (act2ShadowLeft) gsap.set(act2ShadowLeft, { opacity: 0, x: -20 });
      if (act2ShadowMid) gsap.set(act2ShadowMid, { opacity: 0, x: -15 });
      if (act2Ambient) gsap.set(act2Ambient, { opacity: 0 });
      if (act23DHeadline) gsap.set(act23DHeadline, { perspective: 1000, rotateY: -3, rotateX: 2 });

      gsap.set(act2Index, { opacity: 0, y: -8 });
      gsap.set(act2HeadlineLines, { yPercent: 105 });
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

      // MASTER TIMELINE: Ultra-Snappy & Kinetic (0.15s scrub, instant feedback on pixel 1)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: shell,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
          pin: stage,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      // -----------------------------------------------------------------------
      // BEAT 1: 3D LUXURY MAGAZINE PAGE FLIP & CURL (0.0 -> 0.45)
      // Act 1 turns on its spine like a thick editorial cover, revealing Act 2
      // -----------------------------------------------------------------------
      masterTl.addLabel("PAGE_FLIP", 0.0);

      // 1. Dynamic Travelling Paper Sheen & Spine Shadow
      if (act1PageShadow) {
        masterTl.to(
          act1PageShadow,
          {
            opacity: 0.85,
            duration: 0.22,
            ease: "power2.inOut",
          },
          "PAGE_FLIP"
        );
      }
      if (act1PageSheen) {
        masterTl.to(
          act1PageSheen,
          {
            opacity: 0.9,
            duration: 0.2,
            ease: "power1.inOut",
          },
          "PAGE_FLIP"
        );
      }

      // 2. Pure 3D Page Turn: Rotate along left spine with curl & perspective translation
      if (act1Wrapper) {
        masterTl.to(
          act1Wrapper,
          {
            rotateY: -74,
            rotateZ: -4,
            xPercent: -18,
            scale: 0.93,
            boxShadow: "-30px 20px 60px rgba(17, 17, 15, 0.45)",
            duration: 0.38,
            ease: "power2.inOut",
          },
          "PAGE_FLIP"
        );
        masterTl.to(
          act1Wrapper,
          {
            opacity: 0,
            duration: 0.12,
            ease: "power1.in",
          },
          "PAGE_FLIP+=0.28"
        );
        masterTl.set(
          act1Wrapper,
          {
            visibility: "hidden",
          },
          "PAGE_FLIP+=0.42"
        );
      }

      // 3. Act 2 Emerges from Depth underneath the turning page
      masterTl.addLabel("ACT2_ENTER", 0.16);
      masterTl.set(
        act2Wrapper,
        {
          visibility: "visible",
          opacity: 1,
        },
        "ACT2_ENTER"
      );

      masterTl.to(
        act2Wrapper,
        {
          scale: 1,
          filter: "blur(0px)",
          duration: 0.35,
          ease: "power2.out",
        },
        "ACT2_ENTER"
      );

      if (act2Sunlight) {
        masterTl.to(
          act2Sunlight,
          {
            opacity: 0.5,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "ACT2_ENTER"
        );
      }
      if (act2ShadowLeft) {
        masterTl.to(
          act2ShadowLeft,
          {
            opacity: 0.38,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.02"
        );
      }
      if (act2ShadowMid) {
        masterTl.to(
          act2ShadowMid,
          {
            opacity: 0.3,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.04"
        );
      }
      if (act2Ambient) {
        masterTl.to(
          act2Ambient,
          {
            opacity: 0.25,
            duration: 0.5,
            ease: "power2.out",
          },
          "ACT2_ENTER"
        );
      }

      if (act23DHeadline) {
        masterTl.to(
          act23DHeadline,
          {
            rotateY: 0,
            rotateX: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.04"
        );
      }

      if (act2Index) {
        masterTl.to(
          act2Index,
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.02"
        );
      }
      if (act2HeadlineLines.length) {
        masterTl.to(
          act2HeadlineLines,
          {
            yPercent: 0,
            duration: 0.38,
            stagger: 0.03,
            ease: "power3.out",
          },
          "ACT2_ENTER+=0.04"
        );
      }
      if (act2StructuralRules.length) {
        masterTl.to(
          act2StructuralRules,
          {
            scaleX: 1,
            opacity: 0.85,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.06"
        );
      }
      if (act2Role) {
        masterTl.to(
          act2Role,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.08"
        );
      }
      if (act2Bio) {
        masterTl.to(
          act2Bio,
          {
            opacity: 1,
            y: 0,
            duration: 0.32,
            ease: "power2.out",
          },
          "ACT2_ENTER+=0.1"
        );
      }
      if (act2Stats.length) {
        masterTl.to(
          act2Stats,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: "back.out(1.5)",
          },
          "ACT2_ENTER+=0.12"
        );
      }

      // ACT 2 CRISP HOLD
      masterTl.addLabel("ACT2_HOLD", 0.6);
      masterTl.to({}, { duration: 0.6 }, "ACT2_HOLD");

      // -----------------------------------------------------------------------
      // BEAT 3: ACT 2 ➔ ACT 3 (PRESENCE / ENVELOPE REDESIGN) (1.2 -> 2.2)
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT2_TO_ACT3", 1.2);

      if (act2Sunlight) {
        masterTl.to(
          act2Sunlight,
          {
            opacity: 0,
            x: 15,
            duration: 0.25,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }
      if (act2ShadowLeft) {
        masterTl.to(
          act2ShadowLeft,
          {
            opacity: 0,
            x: 15,
            duration: 0.25,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }
      if (act2ShadowMid) {
        masterTl.to(
          act2ShadowMid,
          {
            opacity: 0,
            x: 15,
            duration: 0.25,
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
            duration: 0.25,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      // 1. Surrounding elements (role, bio, stats, index) dissolve first to isolate "Certainty Builder™."
      if (act2Role) {
        masterTl.to(
          act2Role,
          {
            y: -14,
            opacity: 0,
            duration: 0.22,
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
            duration: 0.22,
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
            duration: 0.22,
            stagger: 0.02,
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
            duration: 0.22,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3"
        );
      }

      // 2. "Certainty Builder™." becomes the heroic focal point: scales up with majestic presence, then transitions
      if (act23DHeadline) {
        masterTl.to(
          act23DHeadline,
          {
            scale: 1.08,
            letterSpacing: "0.02em",
            duration: 0.22,
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
            duration: 0.24,
            ease: "power2.in",
          },
          "ACT2_TO_ACT3+=0.16"
        );
      } else if (act2HeadlineLines.length) {
        masterTl.to(
          act2HeadlineLines,
          {
            scale: 1.08,
            duration: 0.2,
            ease: "power2.out",
          },
          "ACT2_TO_ACT3"
        );
        masterTl.to(
          act2HeadlineLines,
          {
            yPercent: -105,
            opacity: 0,
            duration: 0.24,
            stagger: 0.02,
            ease: "power2.inOut",
          },
          "ACT2_TO_ACT3+=0.16"
        );
      }

      // 3. Golden rules expand gracefully into the stage
      if (act2StructuralRules.length) {
        masterTl.to(
          act2StructuralRules,
          {
            scaleX: 1.25,
            opacity: 0,
            duration: 0.36,
            stagger: 0.04,
            ease: "power2.inOut",
          },
          "ACT2_TO_ACT3+=0.04"
        );
      }

      masterTl.to(
        act2Wrapper,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power1.in",
        },
        "ACT2_TO_ACT3+=0.08"
      );
      masterTl.set(
        act2Wrapper,
        {
          visibility: "hidden",
        },
        "ACT2_TO_ACT3+=0.33"
      );

      // ACT 3 ENTRANCE (Continuous Geometric Handoff into Certificate Frame)
      // Overlaps seamlessly at 1.25 where Act 2's gold rules morph into Act 3's axis
      masterTl.addLabel("ACT3_ENTER", 1.25);
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
            duration: 0.4,
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
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.04"
        );
      }
      if (act3Scallops.length) {
        masterTl.to(
          act3Scallops,
          {
            opacity: 1,
            duration: 0.35,
            stagger: 0.02,
            ease: "power1.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }
      if (act3Axis) {
        masterTl.to(
          act3Axis,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.05"
        );
      }
      if (act3AxisFloret) {
        masterTl.to(
          act3AxisFloret,
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.07"
        );
      }
      if (act3Index) {
        masterTl.to(
          act3Index,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
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
            duration: 0.4,
            stagger: 0.04,
            ease: "power3.out",
          },
          "ACT3_ENTER+=0.03"
        );
      }
      if (act3MetaLabel) {
        masterTl.to(
          act3MetaLabel,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.04"
        );
      }
      if (act3MetaStar) {
        masterTl.to(
          act3MetaStar,
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.05"
        );
      }
      if (act3Note) {
        masterTl.to(
          act3Note,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.05"
        );
      }
      if (act3Badges.length) {
        masterTl.to(
          act3Badges,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.06"
        );
      }
      if (act3Titles.length) {
        masterTl.to(
          act3Titles,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.08"
        );
      }
      if (act3Items.length) {
        masterTl.to(
          act3Items,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          },
          "ACT3_ENTER+=0.06"
        );
      }

      // -----------------------------------------------------------------------
      // BEAT 3.5: ACT 3 INTERACTIVE ENGAGEMENT & REPUTATION PULSE (1.4 -> 2.1)
      // Keeps the user captivated as they scroll rather than hitting a dead pause
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT3_HOLD", 1.4);

      // Subtle progressive spotlight & aura intensification across the 5 platforms
      if (act3Badges.length) {
        masterTl.to(
          act3Badges,
          {
            scale: 1.08,
            boxShadow: "0 8px 24px rgba(200, 149, 69, 0.22)",
            duration: 0.35,
            stagger: 0.08,
            ease: "power1.inOut",
          },
          "ACT3_HOLD+=0.05"
        );
        masterTl.to(
          act3Badges,
          {
            scale: 1,
            boxShadow: "none",
            duration: 0.3,
            stagger: 0.08,
            ease: "power1.out",
          },
          "ACT3_HOLD+=0.3"
        );
      }

      // Center sparkle breathes and ignites as energy focuses toward the center
      if (act3AxisFloret) {
        masterTl.to(
          act3AxisFloret,
          {
            scale: 1.45,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "ACT3_HOLD+=0.2"
        );
      }

      // -----------------------------------------------------------------------
      // BEAT 4: ACT 3 ➔ ACT 4 (THE MANIFESTO CONVERGENCE) (2.1 -> 3.0)
      // The Act 3 certificate and cards dissolve inward while the golden axis
      // stretches directly into Act 4's laser manifesto line
      // -----------------------------------------------------------------------
      masterTl.addLabel("ACT3_TO_ACT4", 2.1);

      // Media cards and headlines part and dissolve elegantly
      if (act3Items.length) {
        masterTl.to(
          act3Items,
          {
            y: 20,
            opacity: 0,
            duration: 0.3,
            stagger: 0.03,
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
            duration: 0.32,
            stagger: 0.02,
            ease: "power2.inOut",
          },
          "ACT3_TO_ACT4"
        );
      }
      if (act3Note) {
        masterTl.to(
          act3Note,
          {
            opacity: 0,
            y: -10,
            duration: 0.25,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4"
        );
      }
      if (act3Index) {
        masterTl.to(
          act3Index,
          {
            opacity: 0,
            y: -8,
            duration: 0.22,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4"
        );
      }
      if (act3MetaLabel) {
        masterTl.to(
          act3MetaLabel,
          {
            opacity: 0,
            duration: 0.22,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4"
        );
      }

      // Certificate frame fades out while central axis lines converge
      if (act3Ticket) {
        masterTl.to(
          act3Ticket,
          {
            opacity: 0,
            scale: 0.98,
            duration: 0.35,
            ease: "power2.inOut",
          },
          "ACT3_TO_ACT4+=0.08"
        );
      }
      if (act3Axis) {
        masterTl.to(
          act3Axis,
          {
            scaleX: 1.2,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          "ACT3_TO_ACT4+=0.06"
        );
      }

      masterTl.set(
        act3Wrapper,
        {
          visibility: "hidden",
        },
        "ACT3_TO_ACT4+=0.38"
      );

      // ACT 4 ENTRANCE (Immediate, Grand, Laser-Focused Manifesto)
      masterTl.addLabel("ACT4_ENTER", 2.45);
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
            duration: 0.5,
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
            duration: 0.25,
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
            duration: 0.25,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.02"
        );
      }
      if (act4Lines.length) {
        masterTl.to(
          act4Lines,
          {
            yPercent: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power3.out",
          },
          "ACT4_ENTER+=0.04"
        );
      }
      if (act4Rule) {
        masterTl.to(
          act4Rule,
          {
            scaleX: 1,
            opacity: 0.8,
            duration: 0.35,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.08"
        );
      }
      if (act4Tenets) {
        masterTl.to(
          act4Tenets,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          "ACT4_ENTER+=0.1"
        );
      }

      // ACT 4 READABLE HOLD (Holds cleanly until the pin ends)
      masterTl.addLabel("ACT4_HOLD", 3.1);
      masterTl.to({}, { duration: 0.6 }, "ACT4_HOLD");

      // -----------------------------------------------------------------------
      // PART 5: ACT 5 ARCHITECTURAL DOMAIN LEDGER REVEALS
      // -----------------------------------------------------------------------
      const act5Section = document.querySelector('[data-story-act5="true"]');
      if (act5Section) {
        const act5Index = act5Section.querySelector("[data-story-act5-index]");
        const act5Headlines = act5Section.querySelector("h2");
        const act5Note = act5Section.querySelector("[data-story-act5-note]");
        const act5Items = act5Section.querySelectorAll("[data-story-act5-item]");

        const tl5 = gsap.timeline({
          scrollTrigger: {
            trigger: act5Section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        tl5.from([act5Index, act5Headlines], {
          opacity: 0,
          y: 18,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        })
          .from(
            act5Note,
            { opacity: 0, y: 12, duration: 0.4, ease: "power2.out" },
            "-=0.2"
          )
          .from(
            act5Items,
            {
              opacity: 0,
              y: 28,
              duration: 0.5,
              stagger: 0.08,
              ease: "power3.out",
            },
            "-=0.15"
          );
      }

      // -----------------------------------------------------------------------
      // PART 6: ACTS 6 AND 7 (Below Stages)
      // -----------------------------------------------------------------------

      // ACT 6: LATEST THINKING (Dedicated ScrollTrigger reveals)
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
  }, [shellRef, stageRef, bridgeRuleRef]);
}
