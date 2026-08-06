"use client";

import { useEffect, useRef, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  // Ref to the counter <span> — the rAF loop writes textContent
  // directly so the number can update every frame without triggering
  // React re-renders (which would fight with the heavy Lenis/GSAP
  // setup happening on the same mount tick).
  const numRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const COUNT_DURATION = 1500;
    const started = performance.now();
    let stopped = false;
    let rafId = 0;
    let last = -1;

    const startExit = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(rafId);
      if (numRef.current) numRef.current.textContent = "100";
      setTimeout(() => setExiting(true), 100);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 100 + 600);
    };

    const tick = () => {
      if (stopped) return;
      const elapsed = performance.now() - started;
      const t = Math.min(1, elapsed / COUNT_DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.floor(eased * 100);
      if (value !== last && numRef.current) {
        numRef.current.textContent = String(value);
        last = value;
      }
      if (t >= 1) {
        startExit();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`preloader ${exiting ? "preloader--exit" : ""}`}
      aria-hidden="true"
    >
      <div className="preloader__content">
        {/* Loading counter — top left */}
        <div className="preloader__count-wrap">
          <span className="preloader__count-label">Loading</span>
          <span className="preloader__count-num" ref={numRef}>0</span>
        </div>

        {/* Bottom-right locale */}
        <div className="preloader__corner preloader__corner--br">
          <span>MYSORE &middot; ISTANBUL</span>
        </div>

        {/* Center mark */}
        <div className="preloader__mark-wrap">
          <h1 className="preloader__mark">
            Werner<span className="preloader__mark-dot">.</span>
          </h1>
          <span className="preloader__mark-line" />
        </div>
      </div>
    </div>
  );
}
