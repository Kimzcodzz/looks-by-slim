"use client";

import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function Background() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("/video/hair-bg-mobile.mp4");

  const getFallback = () => {
    if (typeof window === "undefined") {
      return false;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = typeof navigator !== "undefined" && "connection" in navigator
      ? Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
      : false;
    // Keep video on mobile and desktop; fallback only for explicit low-motion/data preferences.
    return reduceMotion || saveData;
  };

  // Start with video and fallback only when needed.
  const [useImageFallback, setUseImageFallback] = useState<boolean>(false);
  const [lowMotionMode, setLowMotionMode] = useState<boolean>(false);

  useEffect(() => {
    // update after mount (deferred) to avoid SSR/client mismatch and cascading renders
    const initial = getFallback();
    const isSmallScreen = window.innerWidth < 900;
    requestAnimationFrame(() => {
      setVideoSrc(isSmallScreen ? "/video/hair-bg-mobile.mp4" : "/video/hair-bg.mp4");
    });
    if (initial) requestAnimationFrame(() => setUseImageFallback(initial));
    requestAnimationFrame(() => setLowMotionMode(initial));

    function handleResize() {
      const next = getFallback();
      const small = window.innerWidth < 900;
      setVideoSrc(small ? "/video/hair-bg-mobile.mp4" : "/video/hair-bg.mp4");
      setUseImageFallback(next);
      setLowMotionMode(next);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">

      {/* VIDEO BACKGROUND (desktop + mobile) or IMAGE FALLBACK (reduced-motion/save-data) */}
      {!useImageFallback ? (
        <video
          ref={videoRef}
          className="decorative-video w-full h-full object-cover opacity-60 pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          disablePictureInPicture
          preload="metadata"
          src={videoSrc}
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={(event) => {
            const el = event.currentTarget;
            const playPromise = el.play();
            if (playPromise) {
              playPromise.catch(() => {
                // Ignore transient autoplay timing rejections on iOS.
              });
            }
          }}
          onError={() => {
            setUseImageFallback(true);
            setLowMotionMode(true);
          }}
        />
      ) : (
        <div className="w-full h-full relative">
          <Image src="/hair/style5.png" alt="background" fill className="object-cover opacity-80" priority />
        </div>
      )}

      {/* DARKENING OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* ✨ GOLD GLOW */}
      {lowMotionMode ? (
        <div
          className="absolute inset-0 blur-[90px]"
          style={{
            opacity: 0.28,
            background:
              "radial-gradient(circle at 25% 30%, rgba(230,194,139,0.28), transparent 70%)",
          }}
        />
      ) : (
        <motion.div
          animate={{ opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute inset-0 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 25% 30%, rgba(230,194,139,0.28), transparent 70%)",
          }}
        />
      )}

      {/* 🌸 PINK GLOW */}
      {lowMotionMode ? (
        <div
          className="absolute inset-0 blur-[105px]"
          style={{
            opacity: 0.24,
            background:
              "radial-gradient(circle at 75% 70%, rgba(255,77,141,0.2), transparent 75%)",
          }}
        />
      ) : (
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute inset-0 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle at 75% 70%, rgba(255,77,141,0.2), transparent 75%)",
          }}
        />
      )}

    </div>
  );
}