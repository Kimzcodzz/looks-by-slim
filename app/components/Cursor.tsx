"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const hasFinePointer = () => {
  if (typeof window === "undefined" || window.innerWidth < 768) return false;
  const hoverMatch = window.matchMedia?.("(hover: hover)")?.matches;
  const pointerMatch = window.matchMedia?.("(pointer: fine)")?.matches;
  return hoverMatch || pointerMatch || window.innerWidth >= 1024;
};

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const animationId = window.requestAnimationFrame(() => {
      if (hasFinePointer()) {
        setEnabled(true);
      }
    });

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const addHover = () => setHover(true);
    const removeHover = () => setHover(false);

    window.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("button, a, input, textarea, select");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    document.body.classList.add("custom-cursor-active");

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      document.body.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        width: 76,
        height: 76,
      }}
    >
      <div
        className={`relative w-full h-full rounded-full transition-transform duration-200 ${
          hover ? "scale-110" : "scale-100"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-[rgba(230,194,139,0.18)] blur-2xl" />
        <Image
          src="/ui/bottle.png"
          alt="hair shampoo cursor"
          width={52}
          height={52}
          className="relative mx-auto mt-[12px] block"
        />
      </div>
    </div>
  );
}