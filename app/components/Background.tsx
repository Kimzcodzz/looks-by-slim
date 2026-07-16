"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Background() {
  const getFallback = () => {
    const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const small = typeof window !== "undefined" && window.innerWidth < 768;
    return isTouch || small;
  };

  // Start with `false` so server and initial client render match (video). Update after mount.
  const [useImageFallback, setUseImageFallback] = useState<boolean>(false);

  useEffect(() => {
    // update after mount (deferred) to avoid SSR/client mismatch and cascading renders
    const initial = getFallback();
    if (initial) requestAnimationFrame(() => setUseImageFallback(initial));

    function handleResize() {
      setUseImageFallback(getFallback());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">

      {/* VIDEO BACKGROUND (desktop) or IMAGE FALLBACK (mobile/touch) */}
      {!useImageFallback ? (
        <video
          className="w-full h-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          src="/video/hair-bg.mp4"
          poster="/hair/style5.png"
        />
      ) : (
        <div className="w-full h-full relative">
          <Image src="/hair/style5.png" alt="background" fill className="object-cover opacity-80" priority />
        </div>
      )}

      {/* DARKENING OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* ✨ GOLD GLOW */}
      <motion.div
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute inset-0 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(230,194,139,0.28), transparent 70%)",
        }}
      />

      {/* 🌸 PINK GLOW */}
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute inset-0 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 75% 70%, rgba(255,77,141,0.2), transparent 75%)",
        }}
      />

    </div>
  );
}