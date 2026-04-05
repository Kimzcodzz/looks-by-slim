"use client";

import { useRef, useState, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const toggleSound = async () => {
    if (!videoRef.current) return;

    try {
      const newState = !soundOn;
      setSoundOn(newState);

      videoRef.current.muted = !newState;
      videoRef.current.volume = newState ? 1 : 0;

      await videoRef.current.play();
    } catch (err) {
      console.log("Sound error:", err);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <main className="h-screen w-full overflow-hidden">
      <section className="relative h-full w-full">

        {/* 🔥 FORCE FULL BLEED VIDEO */}
        <video
          ref={videoRef}
          src="/video/hero1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="
            absolute top-1/2 left-1/2
            h-[140%] w-auto
            min-w-[120%]
            -translate-x-1/2 -translate-y-1/2
            object-cover
            brightness-[0.7]
          "
        />

        {/* CINEMATIC OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />

        {/* TEXT */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-[#e6c28b] text-4xl md:text-6xl text-center font-light tracking-wide">
            This is not just hair.
          </h1>
        </div>

        {/* SOUND */}
        <button
          onClick={toggleSound}
          className="absolute bottom-6 right-6 text-white text-xs tracking-wider opacity-70 hover:opacity-100"
        >
          {soundOn ? "SOUND ON" : "SOUND OFF"}
        </button>

      </section>
    </main>
  );
}