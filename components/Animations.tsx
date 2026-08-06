"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

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

    /* -------------------------------------------------- SMOOTH SCROLL
       Lenis wraps the native scroll with a lerped/inertia-based one that
       feels much smoother than raw wheel/trackpad scroll. Wired to
       ScrollTrigger via the standard pattern:
         - lenis.on("scroll", ScrollTrigger.update) — so every smooth
           scroll tick advances scrubbed ScrollTriggers
         - gsap.ticker drives lenis.raf() — one animation loop, no
           duplicate rAF
         - lagSmoothing(0) — disables GSAP's lag compensation so the
           smoothed scroll and the pin timelines stay in perfect sync */
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const lenisTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);

    // Cleanup slots that live outside gsap.context (context cleanup
     // only tears down GSAP-managed things — the raf loop and the DOM
     // event listeners we register manually below need their own
     // teardown routed through useEffect's return).
    let ballSafetyCleanup: (() => void) | null = null;

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
          .from(".hero__img", { scale: 1.08, duration: 0.9, ease: "power2.out" })
          .from(".hero__eyebrow", { y: 14, opacity: 0, duration: 0.35 }, "-=0.7")
          .from(".hero__title", { y: 40, opacity: 0, duration: 0.6 }, "-=0.3")
          .from(".hero__side-1", { y: 12, opacity: 0, duration: 0.4 }, "-=0.4");

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
      // Ball is now the shared .global-ball rendered at page root (fixed).
      const button = document.querySelector<HTMLElement>(".global-ball");
      const orb = button?.querySelector<HTMLElement>(".global-ball-orb");
      const slot = reframe?.querySelector<HTMLElement>(".reframe__slot");
      if (reframe && button && orb && slot) {
        const title = reframe.querySelector<HTMLElement>(".reframe__title");
        const body = reframe.querySelector<HTMLElement>(".reframe__body");
        const eyebrow = reframe.querySelector<HTMLElement>(".reframe__eyebrow");
        const bezel = button.querySelector<SVGGElement>(".reframe__btn-bezel");
        const highlight = button.querySelector<SVGGElement>(".reframe__btn-highlight");
        const mark = button.querySelector<SVGTextElement>(".reframe__btn-mark");

        // Slot has default width 0 in CSS (so the headline doesn't show
        // an awkward empty gap before pin engages). GSAP animates the
        // slot's width open at pin start and closed again at EXPAND.
        const expectedSlotWidth = () =>
          Math.max(90, Math.min((9 * window.innerWidth) / 100, 150));

        // Ball position: measure the slot at its TARGET (expanded)
        // width, not its current width. Because the H2 is text-align:
        // center and "Control" is wider than "that", the slot's actual
        // center X shifts rightward from the viewport center when the
        // slot expands. If we measured with the slot at its current
        // width (which starts at 0), the ball would land at the wrong
        // spot — visibly left of the gap, overlapping "Control".
        //
        // To get the correct target X, temporarily force the slot to
        // its expected width, measure its rect, then restore. Two forced
        // reflows per measurement, but this only happens on pin enter /
        // resize / refresh — not per-frame — so the perf cost is
        // negligible.
        const measureDeltas = () => {
          const reframeRect = reframe.getBoundingClientRect();
          // Save whatever width GSAP or CSS currently has on the slot,
          // temporarily force it to the target expanded width to
          // measure, then restore. Using gsap.getProperty/gsap.set
          // preserves GSAP's internal cache so this doesn't fight any
          // in-flight width tween.
          const previousWidth = gsap.getProperty(slot, "width") as number;
          gsap.set(slot, { width: expectedSlotWidth() });
          const slotRect = slot.getBoundingClientRect();
          gsap.set(slot, { width: previousWidth });
          const slotCenterX =
            slotRect.left - reframeRect.left + slotRect.width / 2;
          const slotCenterY =
            slotRect.top - reframeRect.top + slotRect.height / 2;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          button.dataset.dx = String(centerX - slotCenterX);
          button.dataset.dy = String(centerY - slotCenterY);
          return { slotCenterX, slotCenterY };
        };

        const placeButtonOnce = () => {
          const { slotCenterX, slotCenterY } = measureDeltas();
          // Measure the ORB (not the whole flex container which includes
          // the time label). We want the orb centered on the slot.
          const orbRect = orb.getBoundingClientRect();
          // NOTE: no autoAlpha here — the ball's fixed viewport position
          // means it would visibly float over Hero (which is above reframe
          // in scroll order). Visibility is toggled by the pin
          // ScrollTrigger's onEnter/onLeaveBack callbacks below.
          gsap.set(button, {
            left: slotCenterX - orbRect.width / 2,
            top: slotCenterY - orbRect.height / 2,
            x: 0,
            y: 0,
            scale: 1,
          });
        };
        // Initial state: bezel/highlight/WERNER-mark start invisible
        // — they only fade in during the CONTRACT phase of the pin
        // timeline. onEnter/onEnterBack now use pinTl.progress() to
        // force the timeline to re-sync on re-entry, so no manual
        // reset is needed there.
        gsap.set([bezel, highlight, mark], { opacity: 0 });
        placeButtonOnce();
        // On resize: only refresh deltas — never touch the button's
        // transform/opacity while an animation might be scrubbing it.
        window.addEventListener("resize", measureDeltas);

        // Scale factor to make the red cap cover the whole viewport.
        // Measure the ORB (the actual visible circle), not the whole
        // flex container which also contains the time-label span.
        const getExpandScale = () => {
          const btnW = orb.getBoundingClientRect().width || 140;
          const diag = Math.hypot(window.innerWidth, window.innerHeight);
          // 1.6x diagonal / orb diameter — covers even on wide aspect ratios
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
            // Re-place ball at pin-start slot position on every refresh
            // (layout shifts, font loading, resize). Also re-sync
            // visibility state from the trigger's active flag so that
            // reloading with scroll already past the pin start doesn't
            // leave the ball hidden (onEnter only fires on forward scroll
            // INTO the trigger — never fires if we start out inside it).
            onRefresh: (self) => {
              placeButtonOnce();
              if (self.isActive) {
                gsap.set(button, { autoAlpha: 1 });
                slot.classList.add("is-taken");
              } else {
                gsap.set(button, { autoAlpha: 0 });
                slot.classList.remove("is-taken");
              }
            },
            // Visibility gate: the ball only exists (visually) while the
            // reframe pin is active. Before entering, it would otherwise
            // float over the Hero at its fixed viewport slot; scrolling
            // back to Hero should hide it again. In parallel, we toggle
            // .is-taken on the slot's CSS placeholder ball — it holds the
            // headline gap pre-pin, then fades out the instant the JS
            // ball takes over so there's no empty gap between "Control"
            // and "that".
            onEnter: () => {
              placeButtonOnce();
              gsap.set(button, { autoAlpha: 1 });
              slot.classList.add("is-taken");
              // Force ScrollTrigger to flush all trigger state to
              // timelines synchronously in this same tick, so the pin
              // timeline scrub applies scale/x/y/bezel-opacity for the
              // CURRENT scroll position — no one-frame gap where
              // placeButtonOnce's scale:1/x:0/y:0 baseline is visible
              // before the scrub catches up.
              ScrollTrigger.update();
            },
            onEnterBack: () => {
              // Scrolling back up from cycle into reframe pin. At this
              // scroll position we're at pin progress ~1.0 (CONTRACT
              // completed), so bypass the scrub lerp (scrub: 1.2 would
              // take 1.2s to reach target values) and PRE-SET the ball
              // to exactly the CONTRACT-end state in the same tick as
              // placeButtonOnce. This eliminates the visible frame gap
              // where the ball would sit at the slot (scale 1, no
              // bezel) before scrub caught up. The next scroll tick's
              // scrub will re-apply timeline values continuously —
              // which start from these matching values, so no visible
              // transition.
              placeButtonOnce();
              const dy = parseFloat(button.dataset.dy || "0");
              gsap.set(button, {
                autoAlpha: 1,
                scale: 0.42,
                x: 0,
                y: dy + window.innerHeight * 0.42,
              });
              gsap.set([bezel, highlight, mark], { opacity: 1 });
              slot.classList.add("is-taken");
            },
            onLeaveBack: () => {
              // Scrolling UP out of the pin toward Hero. Hide the ball
              // completely and also snap its transforms back to identity
              // so nothing lingers over Hero at a stale position. AND
              // restore the slot's CSS placeholder so the H2 gap isn't
              // empty when the reframe scrolls back into view again.
              gsap.set(button, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
              slot.classList.remove("is-taken");
              cycleMarkerTime?.classList.remove("is-visible");
            },
            // NOTE: no onLeave here. Scrolling DOWN past the pin end
            // means the ball is transitioning into the cycle marker —
            // it's still visible on screen. If we removed .is-taken
            // here, the slot's CSS placeholder would pop back in and
            // we'd see TWO red balls (placeholder in slot + JS ball
            // below description). The placeholder only needs to reappear
            // when scrolling BACK to Hero (handled by onLeaveBack).
          },
        });

        // (1) HOLD  0.00 → 0.06 : reader takes in headline. Open the
        //     slot from width 0 (its CSS default, so no gap before pin)
        //     to its full expected width — this is what creates the
        //     visible gap for the ball in "Control [ball] that". Very
        //     quick (0.02 of timeline = ~10vh scroll) so the reveal
        //     feels like the ball punches into existence rather than
        //     text sliding open.
        pinTl.to(
          slot,
          {
            width: () => expectedSlotWidth(),
            duration: 0.02,
            ease: "power2.out",
          },
          0
        );
        pinTl.to({}, { duration: 0.04 });

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
        //     Position is pushed to ~92% viewport (below body paragraph,
        //     between body & eyebrow) and scale is small so the physical
        //     switch is visibly its own element and never overlaps text.
        pinTl.to(title, { color: "#0a0a0a", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(body, { color: "rgba(20,20,20,0.7)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(eyebrow, { color: "rgba(20,20,20,0.7)", duration: 0.10, ease: "power1.inOut" }, 0.28);
        pinTl.to(
          button,
          {
            scale: 0.42,
            x: () => parseFloat(button.dataset.dx || "0"),
            y: () =>
              parseFloat(button.dataset.dy || "0") + window.innerHeight * 0.42,
            ease: "power2.inOut",
            duration: 0.14,
          },
          0.28
        );
        pinTl.to(bezel, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.34);
        pinTl.to(highlight, { opacity: 1, duration: 0.10, ease: "power1.out" }, 0.36);
        pinTl.to(mark, { opacity: 1, duration: 0.08, ease: "power1.out" }, 0.38);

        // (5) HOLD  0.42 → 1.00 : ball STAYS at CONTRACT position as a
        //     small physical switch below the description for the rest of
        //     the pin scroll. No DESCEND, no fade out — the user asked
        //     for one continuous ball that flows from reframe into cycle,
        //     so we leave it visible here and let the cycle timeline
        //     smoothly reshape it into the plain marker.
        pinTl.to({}, { duration: 0.58 });

        // Nav goes dark-text (on-light) while on the white section
        ScrollTrigger.create({
          trigger: reframe,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => setNavLight(self.isActive),
        });

        // (The fixed white bg layer approach was removed — reframe now
        // paints its own white bg again, and .reframe__sticky's z-index
        // was bumped above the ball at document-root level, so text
        // stays on top of the red wash without needing a separate layer.)
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
      const cycleMarker = document.querySelector<HTMLElement>(".global-ball");
      const cycleMarkerOrb = cycleMarker?.querySelector<HTMLElement>(".global-ball-orb");
      const cycleMarkerTime = document.querySelector<HTMLElement>(".global-ball-time");
      const cycleIntro = document.querySelector<HTMLElement>(".cycle__intro");
      const shiftEls = gsap.utils.toArray<HTMLElement>(".shift");
      const firstShift = shiftEls[0];
      const lastShift = shiftEls[shiftEls.length - 1];

      if (cycleMarker && cycleMarkerTime && cycleIntro && firstShift && lastShift) {
        // The shared .global-ball is sized to the REFRAME clamp (90-150px)
        // so the reframe pushbutton looks right. The old .cycle__marker-orb
        // was ~35% of that size (32-52px). To keep the cycle marker
        // visually identical to before, we scale the ball down here.
        // Old: scale 0.85 on 52px orb ≈ 44px displayed
        // New: scale 0.29 on 150px ball ≈ 44px displayed → same on-screen size
        // Keeps the SAME physical-button appearance the reframe pin left
        // us with (CONTRACT scale 0.42, bezel+highlight+WERNER mark
        // visible). Entry matches CONTRACT exactly so the handoff is
        // seamless. Base is larger so the parked button reads clearly
        // next to the time label.
        const CYCLE_BASE_SCALE = 0.42;
        const CYCLE_ENTRY_SCALE = 0.42;
        const CYCLE_EXIT_SCALE = 0.28;

        // NO gsap.set() at ctx-mount time — that would clobber the
        // reframe pin's initial state (which places the ball at the H2
        // slot). Instead, the cycle timeline's first .set() call — with
        // immediateRender: false — establishes the entry state ONLY when
        // the cycle ScrollTrigger reaches its start position.
        //
        // MAIN TIMELINE — set entry state, fade in at the reframe ball's
        // end position, rise gently to park at 14vh (slightly larger),
        // HOLD through all shifts, then fade off-screen.
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
          // Entry — SMOOTHLY animate from wherever the reframe pin left
          // the ball (CONTRACT state: below description at ~92vh viewport,
          // scale 0.42, with bezel + highlight + WERNER mark visible) to
          // the cycle marker position at 78vh. Keeps the same physical
          // button appearance — bezel + highlight + mark stay visible so
          // it's clearly the same button flowing down from reframe, NOT
          // a different plain red ball.
          //
          // Using .to() instead of .set() means the button flows from
          // its last reframe position into the marker position rather
          // than hard-snapping.
          .to(
            cycleMarker,
            {
              top: "78vh",
              // Center the WHOLE visible combo (orb + gap + time label)
              // in the viewport. The ball container has a fixed width
              // (150px) but the time label overflows to the right, so
              // the actual visual extent is ~orb.left → time.right.
              // Centering on just the orb pushed the combo right of
              // center (because the time label extends past the orb);
              // centering on the container's fixed width did the same.
              left: () => {
                const orbW = cycleMarkerOrb
                  ? cycleMarkerOrb.getBoundingClientRect().width
                  : cycleMarker.getBoundingClientRect().width;
                const timeRect = cycleMarkerTime.getBoundingClientRect();
                const orbRect = cycleMarkerOrb
                  ? cycleMarkerOrb.getBoundingClientRect()
                  : cycleMarker.getBoundingClientRect();
                // Visual combo width = from orb's left edge to time's
                // right edge (accounts for gap between them and the
                // time label's actual rendered width).
                const comboW = Math.max(
                  orbW,
                  timeRect.right - orbRect.left
                );
                return window.innerWidth / 2 - comboW / 2;
              },
              x: 0,
              y: 0,
              scale: CYCLE_ENTRY_SCALE,
              autoAlpha: 1,
              ease: "power2.inOut",
              duration: 0.06,
            },
            0
          )
          // Stay at entry position (78vh) through cycle intro + first part of
          // 06:00 shift. Rise to sticky-top position around "8:00" scroll.
          .to({}, { duration: 0.16 })
          .to(cycleMarker, { top: "14vh", scale: CYCLE_BASE_SCALE, duration: 0.04 }, 0.22)
          .to({}, { duration: 0.66 })  // HOLD across remaining shifts
          .to(
            cycleMarker,
            { top: "108vh", scale: CYCLE_EXIT_SCALE, autoAlpha: 0, duration: 0.08 },
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
        const lastTitle = shiftTitles[shiftTitles.length - 1];

        // Reveal the time label only when the FIRST SHIFT TITLE has
        // scrolled into the lower part of the viewport (top 75%). By this
        // point the ball has fully parked at 62vh and the "Shift start..."
        // content is clearly the active section — so the "06:00" reveals
        // right next to the ball, inside the shift, not during cycle intro.
        ScrollTrigger.create({
          // Trigger on the FIRST SHIFT (not its title) with start at
          // "top bottom" — so the time label reveals the moment the
          // "Shift start. First press of the day" section's top edge
          // enters the viewport from below, which is the same moment
          // the ball becomes sticky at the top. Previously used the
          // title with "top 75%" which fired ~half a viewport later.
          trigger: firstShift,
          start: "top bottom",
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
        const cycleMarkerEl = document.querySelector<HTMLElement>(".global-ball");
        const setCapByTime = (mins: number) => {
          if (!cycleMarkerEl) return;
          // 07:00 (420) → green, 20:00 (1200) → amber, 25:00 (1500) → red
          let cls: "global-ball--green" | "global-ball--amber" | null;
          if (mins >= 1500) cls = null; // red
          else if (mins >= 1200) cls = "global-ball--amber";
          else if (mins >= 420) cls = "global-ball--green";
          else cls = null; // red before 07:00
          cycleMarkerEl.classList.toggle(
            "global-ball--green",
            cls === "global-ball--green"
          );
          cycleMarkerEl.classList.toggle(
            "global-ball--amber",
            cls === "global-ball--amber"
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
              cycleMarker.classList.toggle("global-ball--dark", isDark),
            onEnterBack: () =>
              cycleMarker.classList.toggle("global-ball--dark", isDark),
          });
        });
        // Suppress unused var warning
        void firstShift;
        void lastTitle;
      }

      /* Individual shifts — parallax disabled; caused visible per-scroll jitter */

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

      /* -------------------------------------------------- QUOTE — reveal via
         raw scroll math + rAF. Independent of ScrollTrigger/Lenis — if
         the page scrolls, this animates. Progress is measured against the
         viewport with getBoundingClientRect on every frame the scroll has
         changed. */
      const quoteText = document.querySelector<HTMLElement>(".quote__text");
      if (quoteText) {
        const words = Array.from(
          quoteText.querySelectorAll<HTMLElement>(".quote__word")
        );
        if (words.length > 0) {
          const paint = (progress: number) => {
            const p = Math.max(0, Math.min(1, progress));
            const revealed = Math.round(p * words.length);
            for (let i = 0; i < words.length; i++) {
              const on = i < revealed;
              if ((words[i].dataset.revealed === "true") !== on) {
                words[i].dataset.revealed = on ? "true" : "false";
              }
            }
          };
          const compute = () => {
            const rect = quoteText.getBoundingClientRect();
            const vh = window.innerHeight;
            // Progress 0 when text top is at 80% down viewport (just
            // entering). Progress 1 when text bottom is at 40% down
            // viewport (nearly finished passing). Linear between.
            const startY = vh * 0.8;
            const endY = vh * 0.4;
            const totalTravel = (startY - endY) + rect.height;
            const traveled = startY - rect.top;
            paint(traveled / totalTravel);
          };
          compute();
          let ticking = false;
          const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
              compute();
              ticking = false;
            });
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", compute);
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

      /* -------------------------------------------------- BALL SAFETY NET
         Defensive scroll listener that ENFORCES "ball hidden in Hero
         region". Why we need this on top of ScrollTrigger callbacks:
         the BackToTop button uses native `window.scrollTo({ behavior:
         "smooth" })`, and Chrome's native smooth-scroll can dispatch
         scroll events with big gaps between them — big enough that
         ScrollTrigger's onLeaveBack sometimes doesn't fire when the
         scroll blows past the pin-start boundary. Result: ball's pin
         state (CONTRACT position, autoAlpha 1) sticks around and the
         ball ends up floating over the hero.

         This listener runs on every scroll event and, if reframe hasn't
         yet reached the viewport top (i.e. we're still in hero region),
         hard-resets the ball to hidden. It's idempotent — reads the
         current state and only writes when we're actually in hero — so
         it doesn't fight the pin timeline when the pin is active. */
      const reframeEl = document.querySelector<HTMLElement>(".reframe");
      const ballEl = document.querySelector<HTMLElement>(".global-ball");
      const slotEl = document.querySelector<HTMLElement>(".reframe__slot");
      const timeEl = document.querySelector<HTMLElement>(".global-ball-time");
      const firstShiftEl = document.querySelector<HTMLElement>(".shift");
      const allShifts = document.querySelectorAll<HTMLElement>(".shift");
      const lastShiftEl = allShifts[allShifts.length - 1] ?? null;
      if (reframeEl && ballEl) {
        const enforceBallState = () => {
          const rr = reframeEl.getBoundingClientRect();
          // reframe.top > 0 means the reframe hasn't reached the viewport
          // top yet — we're still scrolling through Hero. Ball must be
          // hidden here regardless of what the pin timeline last set.
          if (rr.top > 0) {
            gsap.set(ballEl, { autoAlpha: 0, x: 0, y: 0, scale: 1 });
            slotEl?.classList.remove("is-taken");
            timeEl?.classList.remove("is-visible");
            return;
          }
          // Time label visibility: should be visible while somewhere
          // between the first shift entering the viewport (top bottom,
          // matching the ScrollTrigger start) and the last shift exiting
          // (bottom above viewport top). Outside that range, force it
          // off — the shift ScrollTriggers handle this normally but
          // smooth-scroll (from BackToTop) can skip past their
          // boundaries. Range MUST be a superset of the trigger's range
          // or the listener will strip the class right after the trigger
          // adds it.
          if (timeEl && firstShiftEl && lastShiftEl) {
            const fr = firstShiftEl.getBoundingClientRect();
            const lr = lastShiftEl.getBoundingClientRect();
            const vh = window.innerHeight;
            const inShiftRange = fr.top < vh && lr.bottom > 0;
            if (!inShiftRange) timeEl.classList.remove("is-visible");
          }
        };
        // (1) Scroll events — catches most transitions.
        window.addEventListener("scroll", enforceBallState, { passive: true });
        // (2) requestAnimationFrame loop — the absolute guarantee. Runs
        //     every frame (~60fps) so even if a scroll event is missed
        //     (fast programmatic scroll, tab switch race, layout shift
        //     from font load, etc.), the ball can never be visible in
        //     Hero for more than one frame. Cheap: one getBoundingClientRect
        //     + a conditional gsap.set that's a no-op when already hidden.
        let rafId = 0;
        const rafEnforce = () => {
          enforceBallState();
          rafId = requestAnimationFrame(rafEnforce);
        };
        rafId = requestAnimationFrame(rafEnforce);
        // (3) ScrollTrigger's own refresh event — fires on layout shifts
        //     (resize, font load, pin recalculations). Enforce right after
        //     any recalculation.
        ScrollTrigger.addEventListener("refresh", enforceBallState);
        // (4) Run once immediately so the very first paint reflects the
        //     correct state (before any scroll or raf tick).
        enforceBallState();
        // Store cleanup for the outer useEffect return — gsap.context()
        // doesn't tear down our manually-registered raf loop and DOM
        // listeners, so route them through React's own teardown so we
        // don't leak on hot reload / unmount.
        ballSafetyCleanup = () => {
          cancelAnimationFrame(rafId);
          window.removeEventListener("scroll", enforceBallState);
          ScrollTrigger.removeEventListener("refresh", enforceBallState);
        };
      }
    });

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ballSafetyCleanup?.();
      // Tear down Lenis — stop its raf hook, remove scroll listener,
      // destroy the instance so it doesn't keep processing scroll after
      // hot reload / unmount.
      gsap.ticker.remove(lenisTick);
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return null;
}
