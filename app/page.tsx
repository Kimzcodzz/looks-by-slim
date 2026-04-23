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

  const aboutY = useTransform(scrollYProgress, [0.1, 0.25], [60, -60]);
  const servicesY = useTransform(scrollYProgress, [0.25, 0.45], [80, -80]);
  const transScale = useTransform(scrollYProgress, [0.45, 0.65], [0.95, 1.05]);
  const stylistScale = useTransform(scrollYProgress, [0.65, 0.8], [1, 1.1]);

  /* 🔥 FIXED INTRO (ACTUALLY RENDERS FIRST) */
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[999] overflow-hidden">

        {/* GOLD + PINK AMBIENT */}
        <div className="absolute inset-0">
          <div className="absolute w-[600px] h-[600px] bg-[color:var(--gold)]/20 blur-[140px] top-[-20%] left-[-10%]" />
          <div className="absolute w-[500px] h-[500px] bg-[color:var(--pink)]/20 blur-[140px] bottom-[-20%] right-[-10%]" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="display-xl text-[64px] text-[color:var(--gold)] tracking-tight"
        >
          LOOKS BY SLIM
        </motion.h1>
      </div>
    );
  }

  return (
    <main className="text-white overflow-x-hidden scroll-smooth">

      {/* SIDE BRAND LEFT */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 rotate-[-90deg] text-white/20 tracking-[0.4em] text-sm z-50">
        LOOKS BY SLIM
      </div>

      {/* SIDE BRAND RIGHT */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 rotate-[90deg] text-white/20 tracking-[0.4em] text-sm z-50">
        LOOKS BY SLIM
      </div>

      {/* HERO */}
      <section className="h-screen flex items-center justify-center px-6">
        <div className="grid md:grid-cols-2 gap-20 max-w-6xl w-full items-center">

          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8 max-w-lg"
          >
            <h1 className="display-xl text-[92px] text-[color:var(--gold)] leading-[0.95]">
              This is not just hair.
            </h1>

            <p className="text-white/60 text-lg max-w-md">
              This is identity. Precision. Presence. Crafted detail that transforms how you are seen before you even speak.
            </p>

            <Link href="/book" className="px-8 py-3 border border-[color:var(--gold)]">
              Book Appointment
            </Link>
          </motion.div>

          <div className="flex justify-center">
            <div className="w-[320px] h-[560px]">
              <Hero />
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-64 flex items-center justify-center px-6">
        <motion.div style={{ y: aboutY }} className="max-w-3xl text-center space-y-8">

          <h2 className="text-[80px] tracking-tight text-[color:var(--gold)]">
            More Than A Style
          </h2>

          <p className="text-white/60 text-lg leading-[1.8]">
            Every detail is intentional. Every finish refined.
            This is not just styling — it is transformation.
          </p>

          <p className="text-white/50 leading-[1.9]">
            At <span className="text-white">Looks by Slim</span>, every look is built with intention.
            Precision is not optional — it is the standard. Each client leaves with more than a style,
            but a presence that speaks before they do.
          </p>

          <p className="text-[26px] italic text-[color:var(--gold)] pt-4">
            “Your hair is the crown you never take off.”
          </p>

        </motion.div>
      </section>

      {/* 🔥 SERVICES (NOW ACTUALLY PREMIUM + NOT FLAT) */}
      <section id="services" className="py-56 px-6">
        <motion.div style={{ y: servicesY }} className="max-w-6xl mx-auto space-y-20">

          <h2 className="text-[80px] text-[color:var(--gold)] text-center">
            Services
          </h2>

          <p className="text-center text-white/50 max-w-xl mx-auto">
            Every service is executed with precision, structure, and intention.
            Pricing varies based on length, volume, and complexity.
          </p>

          <div className="grid md:grid-cols-2 gap-14 perspective">

            {[
              {
                title: "Braids",
                items: [
                  { name: "Cornrows", price: "$80 / $100 / $130" },
                  { name: "Boho Braids", price: "$120 / $160 / $200" },
                  { name: "Knotless", price: "$140 / $180 / $240" },
                ],
              },
              {
                title: "Locs",
                items: [
                  { name: "Starter Locs", price: "$100 / $140 / $180" },
                  { name: "Retwist", price: "$80 / $110 / $140" },
                  { name: "Length (S/M/L)", price: "$120 / $160 / $220" },
                ],
              },
            ].map((service, i) => {
              const isActive = activeCard === i;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  onClick={() => setActiveCard(isActive ? null : i)}
                  className="cursor-pointer"
                >
                  <motion.div
                    animate={{ rotateY: isActive ? 180 : 0 }}
                    transition={{ duration: 0.9 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="relative h-[360px] rounded-2xl border border-white/10 p-10 preserve-3d overflow-hidden bg-black/40 backdrop-blur-xl"
                  >

                    {/* GOLD FLOW */}
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{ x: ["-40%", "40%", "-40%"] }}
                      transition={{ duration: 12, repeat: Infinity }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-[color:var(--gold)]/40 to-transparent blur-2xl" />
                    </motion.div>

                    {/* PINK FLOW */}
                    <motion.div
                      className="absolute inset-0 opacity-25"
                      animate={{ x: ["40%", "-40%", "40%"] }}
                      transition={{ duration: 14, repeat: Infinity }}
                    >
                      <div className="w-full h-full bg-gradient-to-r from-transparent via-[color:var(--pink)]/40 to-transparent blur-2xl" />
                    </motion.div>

                    {/* FRONT */}
                    <div className="absolute inset-0 backface-hidden flex flex-col justify-between">

                      <h3 className="text-[46px] text-[color:var(--gold)]">
                        {service.title}
                      </h3>

                      <div className="space-y-2">
                        {service.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-white/70">{item.name}</span>
                            <span className="text-[color:var(--gold-soft)]">{item.price}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* BACK */}
                    <div className="absolute inset-0 rotate-y-180 backface-hidden flex flex-col justify-center space-y-4">
                      {service.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-lg border-b border-white/10 pb-2">
                          <span>{item.name}</span>
                          <span className="text-[color:var(--gold)]">{item.price}</span>
                        </div>
                      ))}
                    </div>

                  </motion.div>
                </motion.div>
              );
            })}

          </div>
        </motion.div>
      </section>

      {/* STYLIST */}
      <section id="stylist" className="py-40 flex items-center justify-center px-6">
        <div className="grid md:grid-cols-2 gap-20 max-w-6xl w-full items-center">

          <motion.div style={{ scale: stylistScale }}>
            <Image src="/about/stylist.png" alt="" width={550} height={650} className="rounded-2xl" />
          </motion.div>

          <motion.div className="space-y-8 max-w-xl">
            <h2 className="text-[72px] text-[color:var(--gold)] leading-[1]">
              Shae Gumbs
            </h2>

            <p className="text-white/40 tracking-widest text-sm">
              MASTER STYLIST
            </p>

            <p className="text-white/60 leading-[1.8]">
              Over a decade dedicated to mastering the craft...
            </p>

            <p className="text-white/50 leading-[1.8]">
              Every part is intentional.
            </p>

            <Link href="/book" className="px-10 py-4 bg-[color:var(--gold)] text-black rounded-full">
              Book Appointment
            </Link>
          </motion.div>

        </div>
      </section>

      {/* TRANSFORMATION */}
      <section className="py-48 flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-[70px] text-[color:var(--gold)] mb-6">
          The Transformation
        </h2>

        <p className="text-white/60 max-w-2xl mb-12 leading-[1.8]">
          This is where the shift happens.
        </p>

        <motion.div style={{ scale: transScale }} className="w-full flex justify-center">
          <div className="relative w-full max-w-3xl h-[420px] overflow-hidden rounded-2xl">

            <Image src="/hair/before1.png" alt="" fill className="object-cover" />

            <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${slider}%` }}>
              <Image src="/hair/after1.png" alt="" fill className="object-cover" />
            </div>

            <label htmlFor="transformation-slider" className="sr-only">
              Transformation slider
            </label>
            <input
              id="transformation-slider"
              type="range"
              min="0"
              max="100"
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              title="Transformation slider"
              aria-label="Transformation slider"
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%]"
            />
          </div>
        </motion.div>
      </section>

      {/* GALLERY */}
      <section className="py-40 px-6 relative">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {["style1","style2","style3","style4","style5","style6"].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="relative h-[420px] rounded-2xl overflow-hidden"
            >
              <Image src={`/hair/${img}.png`} alt="" fill className="object-cover hover:scale-110 transition duration-700" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 flex flex-col items-center justify-center text-center px-6 space-y-6">
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