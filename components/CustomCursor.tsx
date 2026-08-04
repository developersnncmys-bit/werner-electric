"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Skip on touch / no-hover devices — native touch behavior stays intact.
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cursor cursor--dot";
    const ring = document.createElement("div");
    ring.className = "cursor cursor--ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.documentElement.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let visible = false;

    const showCursor = () => {
      if (visible) return;
      visible = true;
      dot.classList.add("is-visible");
      ring.classList.add("is-visible");
    };
    const hideCursor = () => {
      visible = false;
      dot.classList.remove("is-visible");
      ring.classList.remove("is-visible");
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      showCursor();
    };

    let rafId = 0;
    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const setHover = (on: boolean) => {
      ring.classList.toggle("is-hover", on);
      dot.classList.toggle("is-hover", on);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      setHover(
        !!target.closest(
          "a, button, [role='button'], input[type='submit'], input[type='button'], label[for], summary"
        )
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
      cancelAnimationFrame(rafId);
      dot.remove();
      ring.remove();
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return null;
}
