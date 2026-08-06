"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Counter itself is CSS-animated (see .preloader__count-num rule).
    // JS only schedules the exit. Because the counter runs on the
    // compositor via @property, it's immune to main-thread jank —
    // stays perfectly smooth even while React mounts the rest of the
    // page tree.
    const COUNT_DURATION = 1500;
    const EXIT_ANIM = 700;
    const startExit = window.setTimeout(() => {
      setExiting(true);
      window.setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, EXIT_ANIM);
    }, COUNT_DURATION);

    return () => {
      window.clearTimeout(startExit);
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
          <span className="preloader__count-num" />
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
