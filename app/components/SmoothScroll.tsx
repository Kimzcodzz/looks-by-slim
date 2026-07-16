"use client";

import { useEffect, useRef, useState } from "react";

type Props = { children: React.ReactNode };

export default function SmoothScroll({ children }: Props) {
  const [enabled, setEnabled] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop || isTouch) return;

    const contentEl = contentRef.current;
    if (!contentEl) return;

    const tick = requestAnimationFrame(() => setEnabled(true));

    let current = 0;
    const ease = 0.08;

    const animate = () => {
      const target = window.scrollY || 0;
      current += (target - current) * ease;
      const translate = Math.round(current * 100) / 100;
      contentEl.style.transform = `translate3d(0, -${translate}px, 0)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(tick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (contentEl) contentEl.style.transform = "";
    };
  }, []);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={measureRef} aria-hidden="true" style={{ visibility: "hidden" }}>
        {children}
      </div>

      <div
        ref={contentRef}
        className="fixed inset-0 w-full pointer-events-none"
        style={{ willChange: "transform" }}
      >
        <div className="pointer-events-auto">{children}</div>
      </div>
    </>
  );
}
