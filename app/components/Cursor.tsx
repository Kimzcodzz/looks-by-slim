"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const addHover = () => setHover(true);
    const removeHover = () => setHover(false);

    window.addEventListener("mousemove", move);

    // detect hover targets
    const targets = document.querySelectorAll("button, video, a");

    targets.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    >
      {/* DEFAULT DOT */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          hover ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } w-3 h-3 bg-[#ff8fb8] rounded-full shadow-[0_0_15px_#ff8fb8]`}
      />

      {/* 🧴 SHAMPOO BOTTLE */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          hover
            ? "scale-100 opacity-100 rotate-6"
            : "scale-0 opacity-0 rotate-0"
        }`}
      >
        <Image
          src="/ui/bottle.png"
          alt="cursor"
          width={40}
          height={40}
        />
      </div>
    </div>
  );
}