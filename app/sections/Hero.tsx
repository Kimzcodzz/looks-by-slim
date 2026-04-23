"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const toggleSound = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.muted) {
      video.muted = false;
      video.volume = 1;
      await video.play();
      setSoundOn(true);
    } else {
      video.muted = true;
      setSoundOn(false);
    }
  };

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">

      {/* CINEMATIC FRAME */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.4 }}
        className="
          relative
          w-[280px] md:w-[380px]
          aspect-[9/16]
          rounded-[40px]
          overflow-hidden
          border border-[#e6c28b]/30
          shadow-[0_60px_200px_rgba(230,194,139,0.35)]
        "
      >
        <video
          ref={videoRef}
          src="/video/herov.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="
            absolute top-1/2 left-1/2
            w-[150%] h-[150%]
            -translate-x-1/2 -translate-y-1/2
            object-cover
          "
        />

        {/* CINEMATIC TEXT OVERLAY */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[28px] md:text-[34px] text-[#e6c28b] leading-[1.1] font-serif tracking-tight"
          >
            Crafted. Defined. Elevated.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-sm mt-3 leading-[1.6]"
          >
            This is more than a hairstyle.  
            This is structure, discipline, and presence — built strand by strand.
          </motion.p>
        </div>
      </motion.div>

      {/* SOUND */}
      <button
        onClick={toggleSound}
        className="absolute bottom-6 right-6 text-white text-xs opacity-70 hover:opacity-100 transition"
      >
        {soundOn ? "SOUND ON" : "SOUND OFF"}
      </button>
    </div>
  );
}