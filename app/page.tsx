"use client";

import Hero from "./sections/Hero";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [slider, setSlider] = useState(50);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.14], [0, -24]);
  const heroX = useTransform(scrollYProgress, [0, 0.14], [0, -120]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.14], [0, -4]);
  const heroTextX = useTransform(scrollYProgress, [0, 0.14], [0, 42]);
  const heroTextSkew = useTransform(scrollYProgress, [0, 0.14], [0, 3.5]);
  const heroImageX = useTransform(scrollYProgress, [0, 0.14], [0, -90]);
  const heroImageRotateY = useTransform(scrollYProgress, [0, 0.14], [0, 12]);
  const aboutY = useTransform(scrollYProgress, [0.08, 0.22], [20, -24]);
  const aboutX = useTransform(scrollYProgress, [0.08, 0.22], [54, -120]);
  const aboutRotate = useTransform(scrollYProgress, [0.08, 0.22], [0, -2.4]);
  const aboutSkew = useTransform(scrollYProgress, [0.08, 0.22], [0, 4]);
  const servicesY = useTransform(scrollYProgress, [0.22, 0.5], [30, -24]);
  const servicesX = useTransform(scrollYProgress, [0.22, 0.5], [-120, 120]);
  const servicesRotate = useTransform(scrollYProgress, [0.22, 0.5], [0, 2.5]);
  const servicesSkew = useTransform(scrollYProgress, [0.22, 0.5], [0, -4]);
  const transScale = useTransform(scrollYProgress, [0.45, 0.65], [0.95, 1.05]);
  const stylistScale = useTransform(scrollYProgress, [0.65, 0.8], [1, 1.1]);

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
    hidden: { opacity: 0, y: 140, scale: 0.98, rotate: -3 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 86, damping: 18, duration: 0.85 },
    },
  } as const;

  const slideInVariant = {
    hidden: { opacity: 0, x: -140, scale: 0.96, rotate: -5 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 88, damping: 19, duration: 0.9 },
    },
  } as const;

  /* INTRO */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[999] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] bg-[color:var(--gold)]/20 blur-[140px] top-[-20%] left-[-10%]" />
          <div className="absolute w-[500px] h-[500px] bg-[color:var(--pink)]/20 blur-[140px] bottom-[-20%] right-[-10%]" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="display-xl text-[36px] sm:text-[56px] md:text-[64px] text-[color:var(--gold)] tracking-tight text-center px-4"
        >
          LOOKS BY SLIM
        </motion.h1>
      </div>
    );
  }

  return (
    <main className="text-white overflow-x-hidden scroll-smooth">

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
        style={{ y: heroY, x: heroX, rotate: heroRotate, skewY: heroTextSkew }}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-6xl w-full items-center">

          <motion.div
            variants={revealVariant}
            style={{ x: heroTextX }}
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
              <Link href="/book" className="inline-block px-7 py-3 border border-[color:var(--gold)] text-sm sm:text-base">
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
            style={{ x: heroImageX, rotateY: heroImageRotateY }}
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
        <motion.div style={{ y: aboutY, x: aboutX, rotate: aboutRotate, skewY: aboutSkew }} className="max-w-3xl text-center space-y-5 md:space-y-6 preserve-3d">
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
        <motion.div style={{ y: servicesY, x: servicesX, rotate: servicesRotate, skewY: servicesSkew }} className="preserve-3d">
          <motion.span
            variants={revealVariant}
            className="block text-[11px] uppercase tracking-[0.45em] text-white/30 mb-3 text-center"
          >
            Chapter Two — The Signature
          </motion.span>
          <motion.div style={{ y: servicesY }} className="max-w-6xl mx-auto space-y-16 md:space-y-20">

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
                  whileHover={{ y: -16, scale: 1.02, rotateY: 6 }}
                  whileTap={{ scale: 0.98 }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariant}
                  transition={{ delay: i * 0.08 }}
                  className="group cursor-pointer preserve-3d"
                >
                  <div className="relative h-[320px] sm:h-[340px] md:h-[360px] rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,242,190,0.15),_rgba(0,0,0,0.5)_65%)] p-6 sm:p-8 md:p-10 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_55px_140px_rgba(0,0,0,0.4)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,215,150,0.18),transparent_35%)] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.4)_70%)] pointer-events-none" />
                    <div className="absolute left-6 top-6 w-14 h-14 rounded-full bg-[rgba(255,215,150,0.18)] blur-3xl pointer-events-none" />
                    <div className="absolute right-8 bottom-10 h-28 w-28 rounded-full bg-[rgba(255,255,255,0.05)] blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex h-full flex-col justify-between">
                      <div>
                        <h3 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-[color:var(--gold)] tracking-[-0.03em]">
                          {service.title}
                        </h3>
                      </div>

                      <div className="space-y-5">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="rounded-[28px] border border-white/10 bg-white/5 p-5 flex items-center justify-between gap-4 shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition hover:border-[color:var(--gold)] hover:bg-white/10">
                            <div>
                              <p className="font-semibold text-white text-lg">{item.name}</p>
                              <p className="text-[11px] uppercase tracking-[0.35em] text-white/40 mt-1">
                                Starting at
                              </p>
                            </div>
                            <p className="text-[color:var(--gold)] font-semibold text-2xl">
                              {item.price}
                            </p>
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
            style={{ scale: stylistScale }}
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

            <Link href="/book" className="px-10 py-4 bg-[color:var(--gold)] text-black rounded-full">
              Book Appointment
            </Link>
          </motion.div>

        </div>
      </motion.section>

      {/* TRANSFORMATION (FULL RESTORED) */}
      <section className="snap-start py-48 flex flex-col items-center justify-center px-6 text-center">

        <h2 className="text-[70px] text-[color:var(--gold)] mb-6">
          The Transformation
        </h2>

        <p className="text-white/60 max-w-2xl mb-12 leading-[1.8]">
          This is where the shift happens. From unstructured to refined.
          From ordinary to intentional. Every transformation is built
          through precision, patience, and an understanding of what
          elevates not just your look — but your presence.
        </p>

        <motion.div style={{ scale: transScale }} className="w-full flex justify-center">
          <div className="relative w-full max-w-3xl h-[420px] overflow-hidden rounded-2xl">

            <Image src="/hair/before1.png" alt="" fill className="object-cover" />

            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${slider}%` }}>
              <Image src="/hair/after1.png" alt="" fill className="object-cover" />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%]"
              aria-label="Transformation slider"
            />
          </div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="snap-start py-40 px-6 relative">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-4">
            <div>
              <h2 className="text-[38px] sm:text-[60px] md:text-[80px] text-[color:var(--gold)]">
                Gallery
              </h2>
            </div>
            <p className="text-white/50 max-w-2xl">
              A refined showcase of signature styles, finishes, and luxury transformations.
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)] px-5 py-3 text-sm text-[color:var(--gold)] transition hover:bg-[color:var(--gold)] hover:text-black"
            >
              View full gallery
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="flex gap-10 overflow-x-auto pb-3 snap-x snap-mandatory">
            {[
              { src: "style1" },
              { src: "style2" },
              { src: "style3" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="min-w-[320px] md:min-w-[360px] snap-start"
              >
                <div className="relative h-[420px] rounded-2xl overflow-hidden">
                  <Image src={`/hair/${item.src}.png`} alt="Gallery image" fill className="object-cover hover:scale-110 transition duration-700" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="snap-start py-40 flex flex-col items-center justify-center text-center px-6 space-y-6">
        <h2 className="text-[70px] text-[color:var(--gold)]">
          Step Into Your Best Look
        </h2>

        <p className="text-white/50 max-w-md">
          Your next look isn’t just a style — it’s a statement.
        </p>

        <Link href="/book" className="px-14 py-5 rounded-full bg-[color:var(--gold)] text-black hover:scale-105 transition">
          Book Appointment
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center">
        <p className="text-white/40 text-sm">
          Looks By Slim © {new Date().getFullYear()}
        </p>
      </footer>

    </main>
  );
}
