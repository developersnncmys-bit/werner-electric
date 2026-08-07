"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    let stopped = false;
    let interval: ReturnType<typeof setInterval> | null = null;
    let safetyTimer: ReturnType<typeof setTimeout> | null = null;
    const started = performance.now();

    const startExit = () => {
      if (stopped) return;
      stopped = true;
      if (interval) clearInterval(interval);
      if (safetyTimer) clearTimeout(safetyTimer);
      setProgress(100);
      setTimeout(() => setExiting(true), 80);
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 80 + 500);
    };

    // Ambient counter — climbs 0→92 smoothly while the page loads
    let current = 0;
    interval = setInterval(() => {
      current = Math.min(92, current + Math.random() * 10 + 3);
      setProgress(Math.floor(current));
    }, 100);

    // Exit when the page has finished loading (min 400ms display)
    const MIN_DISPLAY = 400;
    const onReady = () => {
      const elapsed = performance.now() - started;
      setTimeout(startExit, Math.max(0, MIN_DISPLAY - elapsed));
    };

    if (document.readyState === "complete") {
      onReady();
    } else {
      window.addEventListener("load", onReady, { once: true });
    }

    // Safety net: force exit after 5s no matter what
    safetyTimer = setTimeout(startExit, 5000);

    return () => {
      if (interval) clearInterval(interval);
      if (safetyTimer) clearTimeout(safetyTimer);
      window.removeEventListener("load", onReady);
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Werner" className="preloader__mark-logo" />
          <span className="preloader__mark-line" />
        </div>
      </div>
    </div>
  );
}
