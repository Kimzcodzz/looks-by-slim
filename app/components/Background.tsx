"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">

      {/* 🎬 HAIR VIDEO (MAIN VISUAL) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-125 brightness-90 scale-110"
      >
        <source src="/video/hair-bg.mp4" type="video/mp4" />
      </video>

      {/* 🔥 LIGHT OVERLAY (NOT WASHING IT OUT) */}
      <div className="absolute inset-0 bg-black/25" />

      {/* ✨ GOLD GLOW */}
      <motion.div
        animate={{ opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute inset-0 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 25% 30%, rgba(230,194,139,0.3), transparent 70%)",
        }}
      />

      {/* 🌸 PINK GLOW */}
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute inset-0 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 75% 70%, rgba(255,77,141,0.25), transparent 75%)",
        }}
      />

    </div>
  );
}