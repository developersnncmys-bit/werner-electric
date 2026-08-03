"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const duration = 1700;
    const start = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const elapsed = t - start;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(Math.floor(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setTimeout(() => setExiting(true), 250);
        setTimeout(() => {
          setVisible(false);
          document.body.style.overflow = "";
        }, 250 + 900);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
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
          <span className="preloader__count-num">{progress}</span>
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
