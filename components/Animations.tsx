"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Animations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }

    const ctx = gsap.context(() => {
      const nav = document.querySelector(".nav");
      const setNavLight = (on: boolean) =>
        nav?.classList.toggle("nav--on-light", on);

      /* -------------------------------------------------- HERO
         Two-phase pinned intro (HEAVN One style):
         Phase 1 (0.00 → 0.50) — image zooms hard, wordmark + side-1 fade out,
                                 centered brand statement fades in
         Phase 2 (0.50 → 1.00) — hold on the zoomed-in state so the next
                                 scroll tick unpins and reveals Reframe */
      const hero = document.querySelector(".hero");
      if (hero) {
        // Explicit initial state for the phase-2 statement so autoAlpha
        // race with CSS doesn't leave it hidden on hot reload
        gsap.set(".hero__statement", { opacity: 0, y: 40 });

        // Entry
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero__img", { scale: 1.12, duration: 1.8, ease: "power2.out" })
          .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.7 }, "-=1.2")
          .from(".hero__title", { y: 80, opacity: 0, duration: 1.2 }, "-=0.5")
          .from(".hero__side-1", { y: 20, opacity: 0, duration: 0.8 }, "-=0.7");

        // Pinned scrub timeline — single-phase: image zoom + text swap
        // happen together over one scroll gesture, then pin releases
        // straight into the next section (no hold)
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        })
          .to(".hero__img", { scale: 1.2, ease: "power1.inOut", duration: 1 }, 0)
          .to(".hero__wordmark", { opacity: 0, y: -60, ease: "power2.in", duration: 0.5 }, 0)
          .to(".hero__statement", { opacity: 1, y: 0, ease: "power2.out", duration: 0.6 }, 0.4);
      }

      /* -------------------------------------------------- REFRAME
         The graphic circle BECOMES the product. 5-phase pinned timeline:
         (1) HOLD    · headline visible with small red button in the gap
         (2) EXPAND  · red cap scales ~40x to fill the viewport as a red wash
         (3) HOLD-RED· brief dwell on the pure red field
         (4) CONTRACT· red shrinks back to product size AND bezel + highlight
                       + WERNER mark fade in — becomes a physical switch
         (5) DESCEND · switch translates downward, off-screen into next section

         The button is a SIBLING of the H2 (not a child) so the H2 fade
         doesn't take the button with it. Position is set from the invisible
         inline slot in the H2 via getBoundingClientRect. */
      const reframe = document.querySelector<HTMLElement>(".reframe");
      const button = document.querySelector<HTMLElement>(".reframe__button");
      const slot = reframe?.querySelector<HTMLElement>(".reframe__slot");
      const sticky = reframe?.querySelector<HTMLElement>(".reframe__sticky");
      if (reframe && button && slot && sticky) {
        const title = reframe.querySelector<HTMLElement>(".reframe__title");
        const body = reframe.querySelector<HTMLElement>(".reframe__body");
        const eyebrow = reframe.querySelector<HTMLElement>(".reframe__eyebrow");
        const bezel = reframe.querySelector<SVGGElement>(".reframe__btn-bezel");
        const highlight = reframe.querySelector<SVGGElement>(".reframe__btn-highlight");
        const mark = reframe.querySelector<SVGTextElement>(".reframe__btn-mark");

        // Initial placement — sets left/top so ball overlays the H2 slot,
        // and captures the deltas needed to move it to viewport center.
        // Runs ONCE on mount. On resize we only refresh the dataset deltas
        // (no reset of transforms), otherwise mid-animation resize events
        // yank the ball back to slot position and cause a visible glitch.
        const measureDeltas = () => {
          const slotRect = slot.getBoundingClientRect();
          const stickyRect = sticky.getBoundingClientRect();
          const slotCenterX = slotRect.left + slotRect.width / 2 - stickyRect.left;
          const slotCenterY = slotRect.top + slotRect.height / 2 - stickyRect.top;
          const centerX = stickyRect.width / 2;
          const centerY = stickyRect.height / 2;
          button.dataset.dx = String(centerX - slotCenterX);
          button.dataset.dy = String(centerY - slotCenterY);
          return { slotCenterX, slotCenterY };
        };

        const placeButtonOnce = () => {
          const { slotCenterX, slotCenterY } = measureDeltas();
          const btnRect = button.getBoundingClientRect();
          gsap.set(button, {
            left: slotCenterX - btnRect.width / 2,
            top: slotCenterY - btnRect.height / 2,
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
          });
        };
        gsap.set([bezel, highlight, mark], { opacity: 0 });
        placeButtonOnce();
        // On resize: only refresh deltas — never touch the button's
        // transform/opacity while an animation might be scrubbing it.
        window.addEventListener("resize", measureDeltas);

        // Scale factor to make the red cap cover the whole viewport
        const getExpandScale = () => {
          const btnW = button.getBoundingClientRect().width || 140;
          const diag = Math.hypot(window.innerWidth, window.innerHeight);
          // 1.6x diagonal / button diameter — covers even on wide aspect ratios
          return (diag * 1.6) / btnW;
        };

        // Pin: +=800% (8x viewport) so descent has real scroll room and
        // scrub:true means every scroll click moves the ball instantly.
        // The descent phase is 55% of the timeline — that's ~440vh of scroll
        // during which the ball is continuously visibly falling.
        const pinTl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: reframe,
            start: "top top",
            end: "+=500%",
            pin: true,
            pinSpacing: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // (1) HOLD  0.00 → 0.06 : reader takes in headline
        pinTl.to({}, { duration: 0.06 });

        // (2) EXPAND  0.06 → 0.20 : text turns WHITE (stays visible on the
        //     red wash), ball scales to fill viewport AND moves y toward
        //     viewport center so the red wash is centered — and so contract
        //     can continue smoothly downward from that position without
        //     teleporting the ball.
        pinTl.to(title, { color: "#ffffff", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(body, { color: "rgba(255,255,255,0.85)", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(eyebrow, { color: "rgba(255,255,255,0.85)", duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(slot, { width: 0, duration: 0.10, ease: "power1.inOut" }, 0.06);
        pinTl.to(
          button,
          {
            scale: getExpandScale,
            y: () => parseFloat(button.dataset.dy || "0"),
            ease: "power2.inOut",
            duration: 0.14,
          },
          0.06
        );

        // (3) HOLD-RED  0.20 → 0.28 : pure red wash briefly
        pinTl.to({}, { duration: 0.08 });

        // (4) CONTRACT  0.28 → 0.42 : ball shrinks small and moves BELOW
        //     the text at horizontal center; text stays visible with color
        //     restored to black. Bezel + highlight + mark reveal on the ball.
        pinTl.to(title, { color: "#0a0a0a", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(body, { color: "rgba(20,20,20,0.7)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(eyebrow, { color: "rgba(20,20,20,0.7)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(
          button,
          {
            scale: 0.75,
            x: () => parseFloat(button.dataset.dx || "0"),
            y: () =>
              parseFloat(button.dataset.dy || "0") + window.innerHeight * 0.28,
            ease: "power2.inOut",
            duration: 0.14,
          },
          0.28
        );
        pinTl.to(bezel, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.32);
        pinTl.to(highlight, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.36);
        pinTl.to(mark, { opacity: 1, duration: 0.08, ease: "power1.out" }, 0.38);

        // (5) DESCEND  0.42 → 0.98 : ball descends downward from CONTRACT
        //     position (already BELOW the headline) toward the bottom of the
        //     viewport, fading out at the end. Motion starts BELOW the text,
        //     so on reverse scroll the ball comes UP from below the text —
        //     never crosses the headline in either direction.
        pinTl.to(
          button,
          {
            y: () =>
              parseFloat(button.dataset.dy || "0") + window.innerHeight * 0.6,
            ease: "power1.inOut",
            duration: 0.56,
          },
          0.42
        );
        pinTl.to(
          button,
          {
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.20,
          },
          0.80
        );

        // Nav goes dark-text (on-light) while on the white section
        ScrollTrigger.create({
          trigger: reframe,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      }

      /* -------------------------------------------------- CYCLE — nav goes light over cream section */
      const cycle = document.querySelector<HTMLElement>(".cycle");
      if (cycle) {
        ScrollTrigger.create({
          trigger: cycle,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      }

      /* -------------------------------------------------- CYCLE MARKER
         Ball descends into the viewport during the cycle intro (no time
         label yet), then PARKS at mid-viewport once the first shift is
         reached. From then on, the time label ticks smoothly forward with
         every scroll — interpolating between the 5 shift timestamps
         (06:00 → 12:00 → 18:00 → 22:00 → 02:00 next day). */
      const cycleMarker = document.querySelector<HTMLElement>(".cycle__marker");
      const cycleMarkerTime = document.querySelector<HTMLElement>(".cycle__marker-time");
      const cycleIntro = document.querySelector<HTMLElement>(".cycle__intro");
      const shiftEls = gsap.utils.toArray<HTMLElement>(".shift");
      const firstShift = shiftEls[0];
      const lastShift = shiftEls[shiftEls.length - 1];

      if (cycleMarker && cycleMarkerTime && cycleIntro && firstShift && lastShift) {
        // Initial state — small, at the SAME on-screen spot the reframe
        // pushbutton ended its CONTRACT phase (~78vh from top, scale
        // roughly matching). On reverse scroll the marker doesn't shrink
        // and vanish — it just fades where the reframe ball will fade in,
        // reading as one continuous ball that grows into the pushbutton.
        gsap.set(cycleMarker, {
          top: "78vh",
          scale: 0.85,
          autoAlpha: 0,
        });

        // MAIN TIMELINE — fade in at the reframe ball's end position, rise
        // gently to park at 62vh (slightly larger), HOLD through all
        // shifts, then fade off-screen.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: cycleIntro,
              start: "top bottom",
              endTrigger: lastShift,
              end: "bottom center",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          .to(cycleMarker, { autoAlpha: 1, duration: 0.04 }, 0)
          // Stay at entry position (78vh) through cycle intro + first part of
          // 06:00 shift. Rise to sticky-top position around "8:00" scroll.
          .to({}, { duration: 0.18 })
          .to(cycleMarker, { top: "14vh", scale: 1, duration: 0.04 }, 0.22)
          .to({}, { duration: 0.66 })  // HOLD across remaining shifts
          .to(
            cycleMarker,
            { top: "108vh", scale: 0.5, autoAlpha: 0, duration: 0.08 },
            0.92
          );

        // TIME INTERPOLATION — start showing the label when the first shift
        // enters, then tick forward continuously with scroll through all 5.
        // Times as minutes since midnight (02:00 next day = 1560).
        const times = [360, 720, 1080, 1320, 1560]; // 06:00 12:00 18:00 22:00 02:00+1
        const fmt = (mins: number) => {
          const total = Math.round(mins);
          const h = Math.floor(total / 60) % 24;
          const m = total % 60;
          return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        };

        // Each shift's TITLE is the anchor — time reveals when a title
        // reaches viewport center and updates as titles pass through it.
        const shiftTitles = shiftEls.map(
          (s) => s.querySelector<HTMLElement>(".shift__title") ?? s
        );
        const firstTitle = shiftTitles[0];
        const lastTitle = shiftTitles[shiftTitles.length - 1];

        // Reveal the time label only when the FIRST SHIFT TITLE has
        // scrolled into the lower part of the viewport (top 75%). By this
        // point the ball has fully parked at 62vh and the "Shift start..."
        // content is clearly the active section — so the "06:00" reveals
        // right next to the ball, inside the shift, not during cycle intro.
        ScrollTrigger.create({
          trigger: firstTitle,
          start: "top 75%",
          endTrigger: lastShift,
          end: "bottom 40%",
          onEnter: () => cycleMarkerTime.classList.add("is-visible"),
          onEnterBack: () => cycleMarkerTime.classList.add("is-visible"),
          onLeave: () => cycleMarkerTime.classList.remove("is-visible"),
          onLeaveBack: () => cycleMarkerTime.classList.remove("is-visible"),
        });

        // Set initial value so the reveal always shows 06:00 clean.
        cycleMarkerTime.textContent = fmt(times[0]);

        // Time interpolates CONTINUOUSLY across the full scroll distance
        // between each pair of shift titles. Anchor: shift[i] title at 65%
        // viewport = time exactly = times[i]. shift[i+1] title at 65% =
        // time exactly = times[i+1]. Between, time smoothly ticks forward
        // with every scroll click across the ~100vh span between shifts.
        // (65% matches the ball's park position at 62vh — ball and title
        // meet at each shift's exact time value.)
        const cycleMarkerEl = document.querySelector<HTMLElement>(".cycle__marker");
        const setCapByTime = (mins: number) => {
          if (!cycleMarkerEl) return;
          // 07:00 (420) → green, 20:00 (1200) → amber, 25:00 (1500) → red
          let cls: "cycle__marker--green" | "cycle__marker--amber" | null;
          if (mins >= 1500) cls = null; // red
          else if (mins >= 1200) cls = "cycle__marker--amber";
          else if (mins >= 420) cls = "cycle__marker--green";
          else cls = null; // red before 07:00
          cycleMarkerEl.classList.toggle(
            "cycle__marker--green",
            cls === "cycle__marker--green"
          );
          cycleMarkerEl.classList.toggle(
            "cycle__marker--amber",
            cls === "cycle__marker--amber"
          );
        };
        for (let i = 0; i < shiftTitles.length - 1; i++) {
          const from = times[i];
          const to = times[i + 1];
          ScrollTrigger.create({
            trigger: shiftTitles[i],
            start: "top 65%",
            endTrigger: shiftTitles[i + 1],
            end: "top 65%",
            scrub: 1,
            onUpdate: (self) => {
              const current = from + (to - from) * self.progress;
              cycleMarkerTime.textContent = fmt(current);
              setCapByTime(current);
            },
          });
        }

        // Flip marker time-label color to white on dark shifts (night, deep).
        shiftEls.forEach((shift) => {
          const isDark =
            shift.classList.contains("shift--night") ||
            shift.classList.contains("shift--deep");
          ScrollTrigger.create({
            trigger: shift,
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () =>
              cycleMarker.classList.toggle("cycle__marker--dark", isDark),
            onEnterBack: () =>
              cycleMarker.classList.toggle("cycle__marker--dark", isDark),
          });
        });
        // Suppress unused var warning
        void firstShift;
        void lastTitle;
      }

      /* Individual shifts — subtle parallax on media */
      document.querySelectorAll<HTMLElement>(".shift").forEach((shift) => {
        const media = shift.querySelector<HTMLElement>(".shift__media-img");
        if (!media) return;
        gsap.fromTo(
          media,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: shift,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      });

      /* DARK MODE TRIGGER — when the 22:00 (night) shift reaches the top of
         the viewport, flip both the night AND deep shifts to full dark.
         Reverse on scroll back up. */
      const eveningShift = document.querySelector<HTMLElement>(".shift--evening");
      const nightShift = document.querySelector<HTMLElement>(".shift--night");
      const deepShift = document.querySelector<HTMLElement>(".shift--deep");

      /* CAP COLOR is now driven inside the time-interpolation onUpdate above
         so the color always matches the displayed time exactly. */
      if (nightShift) {
        const darkTargets = [eveningShift, nightShift, deepShift].filter(
          (el): el is HTMLElement => !!el
        );
        const addDark = () =>
          darkTargets.forEach((el) => el.classList.add("shift--is-dark"));
        const removeDark = () =>
          darkTargets.forEach((el) => el.classList.remove("shift--is-dark"));
        ScrollTrigger.create({
          trigger: nightShift,
          start: "top center",
          endTrigger: deepShift || nightShift,
          end: "bottom top",
          onEnter: addDark,
          onEnterBack: addDark,
          onLeave: removeDark,
          onLeaveBack: removeDark,
        });
      }

      /* -------------------------------------------------- FEATURES — pushbutton rotates on scroll */
      const featuresHero = document.querySelector<HTMLElement>(".features__hero");
      const product = document.querySelector<HTMLElement>(".features__product");
      if (featuresHero && product) {
        gsap.to(product, {
          rotation: 90,
          scale: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: featuresHero,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }

      /* -------------------------------------------------- TRIAL / TECH — light-section nav (clients is now dark) */
      [".trial", ".quote", ".tech"].forEach((sel) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });
      });

      /* -------------------------------------------------- QUOTE — scrub word colors muted → ink */
      const quoteSection = document.querySelector<HTMLElement>(".quote");
      if (quoteSection) {
        const words = quoteSection.querySelectorAll<HTMLElement>(".quote__word");
        if (words.length > 0) {
          gsap.set(words, { color: "rgba(0, 0, 0, 0.15)" });
          gsap.to(words, {
            color: "#141414",
            ease: "none",
            duration: 0.1,
            stagger: 0.1,
            scrollTrigger: {
              trigger: quoteSection,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          });
        }
      }

      /* -------------------------------------------------- GENERIC REVEAL */
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("is-in"),
          once: true,
        });
      });
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return null;
}
