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
    <section className="relative h-screen w-full flex items-center justify-center bg-transparent overflow-hidden">

      {/* glow (kept, but toned so it doesn't kill bg) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,77,141,0.12),transparent_70%)]" />

      {/* FRAME */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1.2 }}
        className="
          relative
          w-[270px] md:w-[360px]
          aspect-[9/16]
          rounded-[38px]
          overflow-hidden
          border border-[#e6c28b]/30
          shadow-[0_40px_160px_rgba(230,194,139,0.25)]
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
            w-[140%] h-[140%]
            -translate-x-1/2 -translate-y-1/2
            object-cover
          "
        />

        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent">

          <h1 className="text-[#e6c28b] text-lg text-center mb-3 font-light">
            This is not just hair.
          </h1>

          <button className="
            w-full
            py-3
            border border-[#e6c28b]
            text-[#e6c28b]
            rounded-full
            hover:bg-[#e6c28b] hover:text-black
            transition-all duration-500
          ">
            Book Appointment
          </button>
        </div>

      </motion.div>

      <button
        onClick={toggleSound}
        className="absolute bottom-6 right-6 text-white text-xs opacity-70"
      >
        {soundOn ? "SOUND ON" : "SOUND OFF"}
      </button>
    </section>
  );
}