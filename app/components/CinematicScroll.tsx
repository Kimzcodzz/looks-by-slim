"use client";

import { useEffect } from "react";

export default function CinematicScroll() {
  useEffect(() => {
    // Only enable cinematic scroll on desktop non-touch devices
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768;
    if (!isDesktop || isTouch) return;

    let rafId = 0;
    let targetY = (typeof window !== "undefined" ? window.scrollY : 0) || 0;
    let currentY = targetY;

    const ease = 0.12; // more pronounced cinematic easing
    console.log("CinematicScroll: active");

    function onWheel(e: WheelEvent) {
      // allow modifier keys to bypass custom scroll
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      targetY += e.deltaY;
      clampTarget();
    }

    function onTouchStart() {
      // reset targets on touch start to allow native scrolling
      targetY = window.scrollY || 0;
      currentY = targetY;
    }

    function clampTarget() {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0);
      if (targetY < 0) targetY = 0;
      if (targetY > max) targetY = max;
    }

    function animate() {
      currentY += (targetY - currentY) * ease;
      if (Math.abs(targetY - currentY) < 0.5) currentY = targetY;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(animate);
    }

    // use non-passive so we can prevent default
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    rafId = requestAnimationFrame(animate);

    // keep target synced if user scrolls via other means (keyboard, scrollbar)
    function syncTarget() {
      targetY = window.scrollY || 0;
      currentY = targetY;
    }

    window.addEventListener("scroll", syncTarget, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel as EventListener);
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("scroll", syncTarget as EventListener);
    };
  }, []);

  return null;
}
