"use client";

import Hero from "./sections/Hero";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [slider, setSlider] = useState(50);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px), (pointer: coarse)");
    const updateMobileState = () => setIsMobile(mediaQuery.matches);

    updateMobileState();
    mediaQuery.addEventListener("change", updateMobileState);

    return () => mediaQuery.removeEventListener("change", updateMobileState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      requestAnimationFrame(() => setShowIntro(false));
      return;
    }

    if (isMobile) {
      const hasSeenIntro = window.sessionStorage.getItem("lbs-mobile-intro-seen") === "1";
      const shouldShowIntro = !hasSeenIntro;

      if (shouldShowIntro) {
        window.sessionStorage.setItem("lbs-mobile-intro-seen", "1");
      }

      requestAnimationFrame(() => setShowIntro(shouldShowIntro));
      return;
    }

    requestAnimationFrame(() => setShowIntro(true));
  }, [isMobile]);

  useLayoutEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (showIntro) {
      document.body.classList.add("intro-active");
    } else {
      document.body.classList.remove("intro-active");
    }

    return () => {
      document.body.classList.remove("intro-active");
    };
  }, [showIntro]);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.14], [0, -16]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.14], [0, -2.2]);
  const heroTextSkew = useTransform(scrollYProgress, [0, 0.14], [0, 1.4]);
  const heroImageRotateY = useTransform(scrollYProgress, [0, 0.14], [0, 6]);
  const aboutY = useTransform(scrollYProgress, [0.08, 0.22], [12, -16]);
  const aboutX = useTransform(scrollYProgress, [0.08, 0.22], [24, -56]);
  const aboutRotate = useTransform(scrollYProgress, [0.08, 0.22], [0, -1.2]);
  const aboutSkew = useTransform(scrollYProgress, [0.08, 0.22], [0, 1.6]);
  const servicesY = useTransform(scrollYProgress, [0.22, 0.5], [16, -16]);
  const servicesX = useTransform(scrollYProgress, [0.22, 0.5], [-56, 56]);
  const servicesRotate = useTransform(scrollYProgress, [0.22, 0.5], [0, 1.2]);
  const servicesSkew = useTransform(scrollYProgress, [0.22, 0.5], [0, -1.4]);
  const transScale = useTransform(scrollYProgress, [0.45, 0.65], [0.98, 1.02]);
  const stylistScale = useTransform(scrollYProgress, [0.65, 0.8], [1, 1.1]);
  const transformationY = useTransform(scrollYProgress, [0.58, 0.75], [12, -12]);
  const transformationRotate = useTransform(scrollYProgress, [0.58, 0.75], [0, -0.4]);
  const transformationGlow = useTransform(scrollYProgress, [0.58, 0.75], [0.92, 1.04]);
  const galleryY = useTransform(scrollYProgress, [0.72, 0.89], [10, -10]);
  const galleryRotate = useTransform(scrollYProgress, [0.72, 0.89], [0, 0.4]);
  const galleryScale = useTransform(scrollYProgress, [0.72, 0.89], [0.992, 1.008]);
  const ctaY = useTransform(scrollYProgress, [0.84, 0.98], [14, -10]);
  const ctaScale = useTransform(scrollYProgress, [0.84, 0.98], [0.985, 1.015]);
  const footerY = useTransform(scrollYProgress, [0.92, 1], [10, -6]);
  const enableScrollFx = !isMobile;

  const staggerContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.16,
      },
    },
  };

  const revealVariant = {
    hidden: { opacity: 0, y: 56, scale: 0.985, rotate: -2 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { type: "tween" as const, ease: "easeOut", duration: 0.78 },
    },
  } as const;

  const cardVariant = {
    hidden: { opacity: 0, y: 90, scale: 0.985, rotate: -1.2 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "tween" as const,
        ease: [0.22, 1, 0.36, 1],
        duration: 0.82,
      },
    },
  } as const;

  const slideInVariant = {
    hidden: { opacity: 0, x: -90, scale: 0.98, rotate: -2 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "tween" as const,
        ease: [0.22, 1, 0.36, 1],
        duration: 0.84,
      },
    },
  } as const;

  return (
    <main className="text-white overflow-x-hidden scroll-smooth">

      {showIntro ? (
        <motion.div
          className="fixed inset-0 z-[1200] pointer-events-none flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: isMobile ? 1.65 : 2.7, times: [0, 0.75, 1], ease: "easeInOut" }}
          onAnimationComplete={() => {
            setShowIntro(false);
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.95),rgba(0,0,0,0.72))]" />
          {!isMobile ? <div className="intro-film-grain absolute inset-0 opacity-30" /> : null}

          <div className="absolute inset-0">
            {!isMobile ? (
              <motion.div
                className="absolute h-[46vh] w-[120vw] left-[-14vw] top-[22vh] bg-[linear-gradient(90deg,rgba(230,194,139,0),rgba(230,194,139,0.34),rgba(255,77,141,0.3),rgba(230,194,139,0))] blur-[80px]"
                animate={{ x: ["-14vw", "6vw", "-14vw"], opacity: [0.55, 0.9, 0.55] }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />
            ) : null}

            <div className="absolute w-[620px] h-[620px] bg-[color:var(--gold)]/24 blur-[140px] top-[-22%] left-[-10%]" />
            <div className="absolute w-[520px] h-[520px] bg-[color:var(--pink)]/24 blur-[140px] bottom-[-22%] right-[-8%]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.95, ease: [0.2, 0.7, 0.2, 1] }}
            className="relative z-10 text-center px-8 flex flex-col items-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0 rgba(230,194,139,0.0), 0 0 0 rgba(255,77,141,0.0)",
                  "0 0 42px rgba(230,194,139,0.45), 0 0 54px rgba(255,77,141,0.35)",
                  "0 0 0 rgba(230,194,139,0.0), 0 0 0 rgba(255,77,141,0.0)",
                ],
              }}
              transition={{ duration: isMobile ? 1.95 : 2.4, ease: "easeInOut" }}
              className="relative mb-7 h-16 w-16 md:h-20 md:w-20 rounded-full border border-[color:var(--gold)]/55 overflow-hidden"
            >
              <Image
                src="/logo/Looksbyslimlogo.png"
                alt="Looks By Slim logo"
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="display-xl text-[36px] sm:text-[58px] md:text-[74px] text-[color:var(--gold)] tracking-tight leading-[0.92]"
            >
              LOOKS BY SLIM
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.38, duration: 0.7, ease: "easeOut" }}
              className="mx-auto mt-5 h-px w-52 origin-center bg-[linear-gradient(90deg,rgba(230,194,139,0),rgba(230,194,139,0.95),rgba(255,77,141,0.88),rgba(230,194,139,0))]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.7, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-5 text-[11px] md:text-xs uppercase tracking-[0.5em] text-white/65"
            >
              Luxury Hair Experience
            </motion.p>
          </motion.div>
        </motion.div>
      ) : null}

      {/* SIDE BRAND (hidden on mobile = cleaner luxury feel) */}
      <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 rotate-[-90deg] text-white/20 tracking-[0.4em] text-sm z-50">
        LOOKS BY SLIM
      </div>

      <div className="hidden md:block fixed right-4 top-1/2 -translate-y-1/2 rotate-[90deg] text-white/20 tracking-[0.4em] text-sm z-50">
        LOOKS BY SLIM
      </div>

      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="min-h-screen snap-start relative flex items-center justify-center px-5 sm:px-6 pt-20 md:pt-0"
        style={enableScrollFx ? { y: heroY, rotate: heroRotate, skewY: heroTextSkew } : undefined}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-6xl w-full items-center">

          <motion.div
            variants={revealVariant}
            className="space-y-6 md:space-y-8 max-w-lg preserve-3d"
          >
            <motion.h1
              variants={revealVariant}
              className="display-xl text-[40px] sm:text-[64px] md:text-[92px] text-[color:var(--gold)] leading-[0.95]"
            >
              This is not just hair.
            </motion.h1>

            <motion.p
              variants={revealVariant}
              className="text-white/60 text-base sm:text-lg max-w-md"
            >
              This is identity. Precision. Presence. Crafted detail that transforms how you are seen before you even speak.
            </motion.p>

            <motion.div variants={revealVariant}>
              <Link href="/policy" className="inline-block px-7 py-3 border border-[color:var(--gold)] text-sm sm:text-base">
                Book Appointment
              </Link>
            </motion.div>

            <motion.div variants={revealVariant} className="mt-10 flex flex-col items-center gap-4 text-center">
              <Link
                href="#about"
                className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.45em] text-white/70 hover:text-white transition"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition group-hover:border-[color:var(--gold)] group-hover:text-[color:var(--gold)]">
                  ↓
                </span>
                Discover Chapter One
              </Link>
              <span className="text-[11px] uppercase tracking-[0.35em] text-white/30">
                Scroll down to reveal the next chapter
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-8 flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2 text-white/60">
                <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center">
                  <span className="text-lg">⌄</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-white/30">
                  Keep scrolling
                </p>
              </div>
            </motion.div>
          </motion.div>
          <motion.div
            variants={revealVariant}
            style={enableScrollFx ? { rotateY: heroImageRotateY } : undefined}
            className="flex justify-center preserve-3d"
          >
            <div className="w-[240px] sm:w-[300px] md:w-[320px] h-[460px] sm:h-[520px] md:h-[560px]">
              <Hero />
            </div>
          </motion.div>

        </div>
      </motion.section>

      {/* ABOUT */}
      <motion.section
        id="about"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={staggerContainer}
        className="snap-start py-20 sm:py-32 md:py-48 flex items-center justify-center px-6"
      >
        <motion.div
          style={enableScrollFx ? { y: aboutY, x: aboutX, rotate: aboutRotate, skewY: aboutSkew } : undefined}
          className="max-w-3xl text-center space-y-5 md:space-y-6 preserve-3d"
        >
          <motion.span
            variants={revealVariant}
            className="block text-[11px] uppercase tracking-[0.45em] text-white/30"
          >
            Chapter One — The Foundation
          </motion.span>

          <motion.h2
            variants={revealVariant}
            className="text-[38px] sm:text-[60px] md:text-[80px] tracking-tight text-[color:var(--gold)]"
          >
            More Than A Style
          </motion.h2>

          <motion.p
            variants={revealVariant}
            className="text-white/50 max-w-2xl mx-auto"
          >
            Every story begins with a moment of truth. The moment your look shifts from ordinary to unforgettable.
          </motion.p>

          <motion.p
            variants={revealVariant}
            className="text-white/60 text-base sm:text-lg leading-[1.8]"
          >
            Every detail is intentional. Every finish refined.
            This is not just styling — it is transformation.
          </motion.p>

          <motion.p
            variants={revealVariant}
            className="text-white/50 leading-[1.9]"
          >
            At <span className="text-white">Looks by Slim</span>, every look is built with intention.
            Precision is not optional — it is the standard. Each client leaves with more than a style,
            but a presence that speaks before they do.
          </motion.p>

          <motion.p
            variants={revealVariant}
            className="text-[20px] sm:text-[26px] italic text-[color:var(--gold)] pt-4"
          >
            “Your hair is the crown you never take off.”
          </motion.p>

        </motion.div>
      </motion.section>

      {/* SERVICES */}
      <motion.section
        id="services"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22 }}
        variants={staggerContainer}
        className="snap-start py-20 sm:py-32 md:py-48 px-6"
      >
        <motion.div
          style={enableScrollFx ? { y: servicesY, x: servicesX, rotate: servicesRotate, skewY: servicesSkew } : undefined}
          className="preserve-3d"
        >
          <motion.span
            variants={revealVariant}
            className="block text-[11px] uppercase tracking-[0.45em] text-white/30 mb-3 text-center"
          >
            Chapter Two — The Signature
          </motion.span>
          <motion.div style={enableScrollFx ? { y: servicesY } : undefined} className="max-w-6xl mx-auto space-y-16 md:space-y-20">

          <motion.h2
            variants={revealVariant}
            className="text-[38px] sm:text-[60px] md:text-[80px] text-[color:var(--gold)] text-center"
          >
            Services
          </motion.h2>

          <motion.p
            variants={revealVariant}
            className="text-center text-white/50 max-w-xl mx-auto"
          >
            Every service is executed with precision, structure, and intention.
            Each offering is shown with a single price for clarity.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-14 perspective">

            {[
              {
                title: "Braids",
                items: [
                  { name: "Cornrows", price: "$80" },
                  { name: "Boho Braids", price: "$120" },
                  { name: "Knotless", price: "$140" },
                ],
              },
              {
                title: "Locs",
                items: [
                  { name: "Starter Locs", price: "$100" },
                  { name: "Retwist", price: "$80" },
                  { name: "Length", price: "$120" },
                ],
              },
            ].map((service, i) => {
              const isActive = activeCard === i;

              return (
                <motion.div
                  key={i}
                  onClick={() => setActiveCard(isActive ? null : i)}
                  whileHover={isMobile ? undefined : { y: -16, scale: 1.02, rotateY: 6 }}
                  whileTap={{ scale: 0.98 }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariant}
                  transition={{ delay: i * 0.08 }}
                  className="group cursor-pointer preserve-3d"
                >
                  <div className="relative min-h-[320px] sm:min-h-[340px] md:min-h-[360px] rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,242,190,0.15),_rgba(0,0,0,0.5)_65%)] p-6 sm:p-8 md:p-10 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_55px_140px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,150,0.18),transparent_35%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.4)_70%)] pointer-events-none" />
                    <div className="absolute left-6 top-6 w-14 h-14 rounded-full bg-[rgba(255,215,150,0.18)] blur-3xl pointer-events-none" />
                    <div className="absolute right-8 bottom-10 h-28 w-28 rounded-full bg-[rgba(255,255,255,0.05)] blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col gap-8">
                      <div>
                        <h3 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-[color:var(--gold)] tracking-[-0.03em]">
                          {service.title}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="group/item flex items-end justify-between gap-5 border-b border-white/12 py-4 last:border-b-0">
                            <div className="flex items-center gap-3">
                              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--gold)]/80" />
                              <p className="font-semibold text-white text-lg leading-tight">{item.name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                                Starting at
                              </p>
                              <p className="text-[color:var(--gold)] font-semibold text-2xl leading-none transition-colors duration-300 group-hover/item:text-[color:var(--gold-soft)]">
                                {item.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

          </div>
        </motion.div>
      </motion.div>
      </motion.section>

      {/* STYLIST (RESTORED) */}
      <motion.section
        id="stylist"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={slideInVariant}
        className="snap-start py-40 flex items-center justify-center px-6"
      >
        <div className="grid md:grid-cols-2 gap-20 max-w-6xl w-full items-center">

          <motion.div
            style={enableScrollFx ? { scale: stylistScale } : undefined}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <Image src="/about/stylist.png" alt="" width={550} height={650} className="rounded-2xl" />
          </motion.div>

          <motion.div
            className="space-y-8 max-w-xl"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-[72px] text-[color:var(--gold)] leading-[1]">
              Shae Gumbs
            </h2>

            <p className="text-white/40 tracking-widest text-sm">
              MASTER STYLIST
            </p>

            <p className="text-white/60 leading-[1.8]">
              Over a decade dedicated to mastering the craft — not just practicing,
              but refining, studying, and perfecting every detail that defines true
              precision.
            </p>

            <p className="text-white/50 leading-[1.8]">
              Every part is intentional. Every section is placed with purpose.
            </p>

            <p className="text-white/50 leading-[1.8] text-sm uppercase tracking-[0.35em] text-white/40">
              A story told through silhouette, structure, and finish.
            </p>

            <Link href="/policy" className="px-10 py-4 bg-[color:var(--gold)] text-black rounded-full">
              Book Appointment
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* TRANSFORMATION (FULL RESTORED) */}
      <motion.section
        className="snap-start py-48 flex flex-col items-center justify-center px-6 text-center"
        style={enableScrollFx ? { y: transformationY, rotate: transformationRotate } : undefined}
        initial={{ opacity: 0, y: 90 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-6"
        >

        <p className="text-[11px] uppercase tracking-[0.42em] text-white/30">
          Chapter Three — The Shift
        </p>

        <h2 className="text-[70px] text-[color:var(--gold)] mb-6">
          The Transformation
        </h2>

        <p className="text-white/60 max-w-2xl mb-12 leading-[1.8]">
          This is where the shift happens. From unstructured to refined.
          From ordinary to intentional. Every transformation is built
          through precision, patience, and an understanding of what
          elevates not just your look — but your presence.
        </p>

        </motion.div>

        <motion.div
          style={enableScrollFx ? { scale: transScale } : undefined}
          initial={{ opacity: 0, scale: 0.92, y: 70 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.28 }}
          transition={{ duration: 0.95, ease: "easeOut", delay: 0.08 }}
          className="w-full flex justify-center"
        >
          <div className={`relative w-full max-w-4xl rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(230,194,139,0.14),_rgba(0,0,0,0.68)_58%)] p-4 md:p-5 ${isMobile ? "shadow-[0_14px_40px_rgba(0,0,0,0.28)]" : "shadow-[0_35px_120px_rgba(0,0,0,0.38)]"}`}>

            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,rgba(230,194,139,0),rgba(230,194,139,0.9),rgba(230,194,139,0))]" />

            <div className="relative h-[420px] overflow-hidden rounded-[24px] border border-white/10">

              {isMobile ? (
                <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(230,194,139,0.14),_transparent_55%)]" />
              ) : (
                <motion.div
                  style={{ scale: transformationGlow }}
                  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top,_rgba(230,194,139,0.18),_transparent_55%)]"
                />
              )}

              <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.12)_30%,rgba(0,0,0,0.45)_100%)]" />

              <div className={`absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/75 ${isMobile ? "" : "backdrop-blur-sm"}`}>
                Before
              </div>

              <div className={`absolute right-5 top-5 z-20 rounded-full border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/15 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold-soft)] ${isMobile ? "" : "backdrop-blur-sm"}`}>
                After
              </div>

              <Image
                src="/hair/before1.png"
                alt="Before transformation"
                fill
                className="object-cover object-top scale-[0.92]"
              />

              <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${slider}%` }}>
                <Image src="/hair/after1.png" alt="After transformation" fill className="object-cover" />
              </div>

              <div
                className="pointer-events-none absolute top-0 bottom-0 z-20"
                style={{ left: `calc(${slider}% - 1px)` }}
              >
                <div className="relative h-full w-[2px] bg-white/85 shadow-[0_0_24px_rgba(255,255,255,0.28)]">
                  <div className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--gold)]/40 bg-black/45 text-[color:var(--gold)] shadow-[0_0_30px_rgba(230,194,139,0.28)] ${isMobile ? "" : "backdrop-blur-sm"}`}>
                    <span className="text-lg tracking-[-0.2em]">⇄</span>
                  </div>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-6 pt-16 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.78))]">
                <div className="mx-auto max-w-2xl space-y-4">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-white/45">
                    <span>Move To Reveal</span>
                    <span>{slider}%</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={slider}
                    onChange={(e) => setSlider(Number(e.target.value))}
                    className="transformation-range w-full"
                    aria-label="Transformation slider"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-2 pt-5 text-left md:grid-cols-3">
              {[
                ["Precision", "Every parting, line, and finish is placed with purpose."],
                ["Structure", "The final shape is built to frame presence, not just style hair."],
                ["Finish", "Polish, softness, and detail complete the full transformation."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--gold)]/80 mb-2">{title}</p>
                  <p className="text-sm leading-7 text-white/60">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* GALLERY */}
      <motion.section
        id="gallery"
        className="snap-start py-40 px-6 relative"
        style={enableScrollFx ? { y: galleryY, rotate: galleryRotate, scale: galleryScale } : undefined}
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="space-y-4"
          >
            <p className="text-[11px] uppercase tracking-[0.42em] text-white/30">
              Chapter Four — The Finish
            </p>
            <div>
              <h2 className="text-[38px] sm:text-[60px] md:text-[80px] text-[color:var(--gold)]">
                Gallery
              </h2>
            </div>
            <p className="text-white/50 max-w-2xl">
              A refined showcase of signature styles, finishes, and luxury transformations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-end"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)] px-5 py-3 text-sm text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-black"
            >
              View full gallery
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>

          <div className="flex gap-10 overflow-x-auto pb-3 snap-x snap-mandatory">
            {[
              { src: "style1", video: "/styles/style1.mp4" },
              { src: "style2", video: "/styles/style2.mp4" },
              { src: "style3" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="min-w-[320px] md:min-w-[360px] snap-start"
              >
                <div className="group relative h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.18)_35%,rgba(0,0,0,0.55)_100%)]" />
                  <Image
                    src={`/hair/${item.src}.png`}
                    alt="Gallery image"
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-0"
                  />

                  {!isMobile && item.video ? (
                    <video
                      src={item.video}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                    />
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-center pt-10"
          >
            <div className="h-20 w-px bg-[linear-gradient(180deg,rgba(230,194,139,0),rgba(230,194,139,0.9),rgba(230,194,139,0))]" />
            <div className="mt-4 h-3 w-3 rounded-full bg-[color:var(--gold)] shadow-[0_0_30px_rgba(230,194,139,0.8)]" />
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="snap-start py-40 flex flex-col items-center justify-center text-center px-6 space-y-6"
        style={enableScrollFx ? { y: ctaY, scale: ctaScale } : undefined}
        initial={{ opacity: 0, y: 90, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="relative space-y-6 max-w-3xl px-4"
        >
        <div className="pointer-events-none absolute inset-x-24 -top-4 h-px bg-[linear-gradient(90deg,rgba(230,194,139,0),rgba(230,194,139,0.9),rgba(230,194,139,0))]" />
        <div className="pointer-events-none absolute -left-10 top-4 h-24 w-24 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 bottom-0 h-20 w-20 rounded-full bg-white/6 blur-3xl" />
        <p className="relative z-10 text-[11px] uppercase tracking-[0.42em] text-white/35">
          Final Chapter
        </p>
        <h2 className="text-[70px] text-[color:var(--gold)]">
          Step Into Your Best Look
        </h2>

        <p className="text-white/50 max-w-md mx-auto">
          Your next look isn’t just a style — it’s a statement.
        </p>

        <Link href="/policy" className="relative z-10 inline-flex items-center justify-center px-14 py-5 rounded-full bg-[color:var(--gold)] text-black hover:scale-105 transition shadow-[0_16px_44px_rgba(230,194,139,0.34)]">
          Book Appointment
        </Link>

        </motion.div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="py-12 text-center"
        style={enableScrollFx ? { y: footerY } : undefined}
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <p className="text-white/40 text-sm">
          Looks By Slim © {new Date().getFullYear()}
        </p>
      </motion.footer>

    </main>
  );
}
