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
      document.querySelector(".statement")?.classList.add("is-in");
      return;
    }

    let ecoPickActive: (() => void) | null = null;

    const ctx = gsap.context(() => {
      /* 1. HERO — entry + pinned frame-1 → frame-2 morph */
      if (document.querySelector(".hero")) {
        /* Entry timeline: plays once on load */
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero__img", { scale: 1.12, duration: 1.8, ease: "power2.out" })
          .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.8 }, "-=1.2")
          .from(".hero__title", { y: 60, opacity: 0, duration: 1.1 }, "-=0.7")
          .from(".hero__lede", { y: 20, opacity: 0, duration: 0.8 }, "-=0.7")
          .from(".hero__scroll-cue", { y: 20, opacity: 0, duration: 0.6 }, "-=0.6")
          .from(".hero__scroll", { y: 10, opacity: 0, duration: 0.6 }, "-=0.4");

        /* Pinned scrub timeline: frame-1 → frame-2 */
        const scrub = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=100%",       // pin lasts for one viewport of scrolling
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        scrub
          /* Frame 1 elements exit + image zooms */
          .to(".hero__img", { scale: 1.18 }, 0)
          .to(".hero__brand", { autoAlpha: 0, y: -40, ease: "power2.in" }, 0)
          .to(".hero__side", { autoAlpha: 0, y: -40, ease: "power2.in" }, 0)
          .to(".hero__scroll", { autoAlpha: 0, y: 10 }, 0)
          /* Frame 2 enters, slightly delayed for cross-fade */
          .fromTo(
            ".hero__frame2",
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, ease: "power2.out" },
            0.35
          );
      }

      /* 2. STATEMENT — pinned reveal */
      const statement = document.querySelector(".statement");
      if (statement) {

        /* Pinned scrub: 3 phases —
           1) body reveals
           2) black slider sweeps up covering the section
           3) dwell before pin releases
           Text uses mix-blend-mode: difference, so it auto-inverts to white as the slider covers. */
        const navEl = document.querySelector(".nav");

        /* Clear leftover inline styles (hot reload safety) */
        gsap.set([".statement__title", ".statement__word", ".statement__body"], {
          clearProps: "opacity,transform,visibility,color",
        });

        /* Simple 2-scroll pin:
           Scroll 1 → black fill sweeps up covering section, text flips white as fill fits viewport
           Scroll 2 → pin releases, next section reveals
        */
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: statement,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              navEl?.classList.toggle("nav--on-light", self.progress < 0.4);
              // Text flips to white via CSS class — no GSAP inline color battle
              statement.classList.toggle("statement--dark", self.progress > 0.4);
            },
          },
        }).to({}, { duration: 1 }); // just occupy the pin duration; class toggle handles the visual
      }

      /* 3. GENERIC REVEAL */
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("is-in"),
          once: true,
        });
      });

      /* 4. CYCLE — pin the intro heading for one scroll length, then release.
         Offset the pin start by the nav height so the description isn't hidden behind the fixed nav.
         Also switches .cycle to the light theme at the same trigger point (matches the pin engaging). */
      const cycleIntro = document.querySelector<HTMLElement>(".cycle__intro");
      const cycleEl = document.querySelector<HTMLElement>(".cycle");
      if (cycleIntro) {
        const getNavH = () =>
          (document.querySelector<HTMLElement>(".nav")?.offsetHeight ?? 80);
        ScrollTrigger.create({
          trigger: cycleIntro,
          start: () => `top top+=${getNavH()}`,
          end: "+=100%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => cycleEl?.classList.add("cycle--light"),
          onLeaveBack: () => cycleEl?.classList.remove("cycle--light"),
        });
      }

      /* Flip Cycle back to DARK once its last scene is nearly out of view — so the
         hand-off to About (dark) is a seamless dark-to-dark transition, no white strip. */
      const cycleSection = document.querySelector<HTMLElement>(".cycle");
      const lastScene = document.querySelectorAll<HTMLElement>(".scene");
      const lastSceneEl = lastScene[lastScene.length - 1];
      if (cycleSection && lastSceneEl) {
        ScrollTrigger.create({
          trigger: lastSceneEl,
          start: "bottom 80%",
          end: "bottom top",
          onEnter: () => cycleSection.classList.remove("cycle--light"),
          onLeaveBack: () => cycleSection.classList.add("cycle--light"),
        });
      }

      /* 5-7. Same for Problems / Family / Values cards — always visible, no entrance animations. */

      /* 5b. ECOSYSTEM — swap the sticky visual on the right whenever the family
         TITLE on the left crosses the viewport midpoint. Uses a plain scroll listener
         so timing can't drift with ScrollTrigger updates. */
      const familyTitles = gsap.utils.toArray<HTMLElement>(".family__title");
      const ecoVisuals = gsap.utils.toArray<HTMLElement>(".ecosystem__visual");
      if (
        familyTitles.length > 0 &&
        ecoVisuals.length === familyTitles.length
      ) {
        const activate = (i: number) => {
          ecoVisuals.forEach((v, j) => v.classList.toggle("is-active", j === i));
        };
        let lastActive = -1;
        const pickActive = () => {
          const midpoint = window.innerHeight * 0.55;
          let bestIdx = 0;
          for (let i = 0; i < familyTitles.length; i++) {
            const rect = familyTitles[i].getBoundingClientRect();
            if (rect.top <= midpoint) {
              bestIdx = i;
            } else {
              break;
            }
          }
          if (bestIdx !== lastActive) {
            lastActive = bestIdx;
            activate(bestIdx);
          }
        };
        ecoPickActive = pickActive;
        window.addEventListener("scroll", pickActive, { passive: true });
        window.addEventListener("resize", pickActive);
        // Fire once so initial position is correct
        pickActive();
      }

      /* 7b. ABOUT — pin section, hold, scrub cards through clipped viewport, hold, release */
      const aboutSection = document.querySelector<HTMLElement>(".about");
      const aboutCards = document.querySelector<HTMLElement>(".about__cards");
      const aboutCardsWrap = document.querySelector<HTMLElement>(".about__cards-wrap");
      if (aboutSection && aboutCards && aboutCardsWrap && window.innerWidth > 900) {
        const startHold = 500; // px of scroll where section is pinned but cards don't move
        const endHold = 400;   // px of scroll after cards finish before pin releases
        /* Distance so the LAST card's center lands at wrap center at the end of translation
           (so Equality actually reaches the "active" position before the pin releases). */
        const getDistance = () => {
          const cards = aboutCards.querySelectorAll<HTMLElement>(".about-card");
          const lastCard = cards[cards.length - 1];
          if (!lastCard) return aboutCards.scrollHeight - aboutCardsWrap.offsetHeight;
          const lastCardCenter = lastCard.offsetTop + lastCard.offsetHeight / 2;
          const wrapCenter = aboutCardsWrap.offsetHeight / 2;
          return Math.max(0, lastCardCenter - wrapCenter);
        };

        /* Detect which card is closest to the wrap's vertical center; add .is-active */
        const cardEls = () =>
          Array.from(aboutCards.querySelectorAll<HTMLElement>(".about-card"));
        const pickActiveCard = () => {
          const wrapRect = aboutCardsWrap.getBoundingClientRect();
          const wrapCenter = wrapRect.top + wrapRect.height / 2;
          let bestIdx = 0;
          let bestDist = Infinity;
          const cards = cardEls();
          cards.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const dist = Math.abs(center - wrapCenter);
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = i;
            }
          });
          cards.forEach((c, i) => c.classList.toggle("is-active", i === bestIdx));
        };

        gsap.timeline({
          scrollTrigger: {
            trigger: aboutSection,
            start: "top top",
            end: () => `+=${getDistance() + startHold + endHold}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => {
              aboutSection.classList.add("about--dark");
              pickActiveCard();
            },
            onLeaveBack: () => aboutSection.classList.remove("about--dark"),
            onUpdate: pickActiveCard,
            onRefresh: pickActiveCard,
          },
        })
          .to({}, { duration: startHold })
          .to(aboutCards, {
            y: () => -getDistance(),
            ease: "none",
            duration: () => getDistance(),
          })
          .to({}, { duration: endHold });
      }

      /* 7c. CLIENTS — pin so viewers see the marquee cycle before scrolling on.
         Explicit callbacks force nav to light-mode; using onUpdate as a safety net
         because the section's own light-section watcher was removed for this section. */
      const clientsSection = document.querySelector<HTMLElement>(".clients");
      if (clientsSection && window.innerWidth > 900) {
        const getNavH = () =>
          (document.querySelector<HTMLElement>(".nav")?.offsetHeight ?? 80);
        const setNavLight = (on: boolean) => {
          document.querySelector(".nav")?.classList.toggle("nav--on-light", on);
        };
        /* Pin — visual only, no nav toggle here */
        ScrollTrigger.create({
          trigger: clientsSection,
          start: () => `top top+=${getNavH()}`,
          end: "+=150%",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        /* Nav-light — fires as soon as section starts entering behind nav,
           and stays active until section fully leaves upward. Independent of pin. */
        ScrollTrigger.create({
          trigger: clientsSection,
          start: "top 90%",
          end: "bottom top",
          onEnter: () => setNavLight(true),
          onEnterBack: () => setNavLight(true),
          onLeave: () => setNavLight(false),
          onLeaveBack: () => setNavLight(false),
        });
      }

      /* 8. QUOTE — pin section, scrub word-by-word color reveal (muted → ink).
         Force nav to light-mode for the entire pin (the generic light-section
         watcher misfires when the trigger element is being pinned). */
      const quoteSection = document.querySelector<HTMLElement>(".quote");
      if (quoteSection && window.innerWidth > 900) {
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
              end: "+=150%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              toggleClass: { targets: ".nav", className: "nav--on-light" },
            },
          });
        }
      }
    });

    /* Nav color theming — toggle .nav--on-light when scroll is over a light section */
    const navEl = document.querySelector(".nav");
    if (navEl) {
      /* Note: .clients is NOT in this list — its pin trigger manages nav state directly.
         Keeping it here caused a race where the global trigger removed .nav--on-light
         after the pin trigger added it (pin makes section position:fixed, confuses detection). */
      const lightSections = document.querySelectorAll(
        ".cycle"
      );
      lightSections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 80px",
          end: "bottom 80px",
          onToggle: (self) => navEl.classList.toggle("nav--on-light", self.isActive),
        });
      });
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      if (ecoPickActive) {
        window.removeEventListener("scroll", ecoPickActive);
        window.removeEventListener("resize", ecoPickActive);
      }
      ctx.revert();
    };
  }, []);

  return null;
}
