"use client";

import Hero from "./sections/Hero";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

export default function Home() {
const galleryRef = useRef<HTMLDivElement | null>(null);
const cursorRef = useRef<HTMLDivElement>(null);
const mainRef = useRef<HTMLDivElement | null>(null);

// ================= CURSOR =================
useEffect(() => {
const moveCursor = (e: MouseEvent) => {
if (!cursorRef.current) return;
cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
document.documentElement.style.setProperty("--my", `${e.clientY}px`);
};

window.addEventListener("mousemove", moveCursor);
return () => window.removeEventListener("mousemove", moveCursor);

}, []);

// ================= SCROLL =================
const { scrollYProgress } = useScroll({ target: mainRef });

const yHero = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

// 🔥 ADD DEPTH FADE (cinematic feel)
const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.85]);

const fadeUp = {
initial: { opacity: 0, y: 100 },
whileInView: { opacity: 1, y: 0 },
transition: { duration: 1.2, ease: easeOut },
viewport: { once: true, margin: "-120px" },
};

// ================= GALLERY =================
const { scrollYProgress: galleryProgress } = useScroll({ target: galleryRef });

const ySlow = useTransform(galleryProgress, [0, 1], ["0%", "-20%"]);
const yMedium = useTransform(galleryProgress, [0, 1], ["0%", "-35%"]);
const yFast = useTransform(galleryProgress, [0, 1], ["0%", "-50%"]);

// ================= SERVICES =================
const [flipped, setFlipped] = useState<number | null>(null);

const services = [
{ title: "Braids", items: ["Cornrows", "Boho Braids", "Knotless"] },
{ title: "Locs", items: ["Starter Locs", "Retwist", "Length (S/M/L)"] },
];

return ( <main ref={mainRef} className="text-white overflow-x-hidden snap-y snap-mandatory">

```
  {/* CURSOR */}
  <div
    ref={cursorRef}
    className="fixed w-6 h-6 rounded-full pointer-events-none z-[999]
    bg-[color:var(--gold)] blur-[10px] opacity-90
    -translate-x-1/2 -translate-y-1/2"
  />

  {/* NAV */}
  <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
    <div className="mt-4 flex items-center gap-8 px-6 py-3 rounded-full glass">

      <div className="w-14 h-14 rounded-full overflow-hidden border border-[color:var(--gold)]/40 relative">
        <Image src="/logo/Looksbyslimlogo.png" alt="" fill className="object-cover" />
      </div>

      <div className="hidden md:flex gap-6 text-sm text-white/70">
        {["Services","Stylist","Work","Contact"].map((item,i)=>(
          <a key={i} href={`#${item.toLowerCase()}`} className="relative group">
            {item}
            <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-[color:var(--gold)] group-hover:w-full transition-all duration-300"/>
          </a>
        ))}
      </div>

      <button className="px-5 py-2 rounded-full border border-[color:var(--gold)]
      text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black transition">
        Book
      </button>

    </div>
  </div>

  {/* HERO */}
  <motion.div style={{ y: yHero }} className="relative h-screen flex items-center justify-center">

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.75))]" />

    <div className="hidden lg:block absolute left-[6%] top-1/2 -translate-y-1/2 text-white/20 text-xs tracking-[0.5em] rotate-[-90deg]">
      LUXURY HAIR EXPERIENCE
    </div>

    <div className="hidden lg:block absolute right-[6%] top-1/2 -translate-y-1/2 text-white/20 text-xs tracking-[0.5em] rotate-90">
      PRECISION • CARE • GROWTH
    </div>

    <Hero />
  </motion.div>

  {/* CONTENT */}
  <motion.div style={{ y: yContent, scale, opacity }}>

    {/* INTRO */}
    <motion.section {...fadeUp} className="min-h-screen snap-start flex items-center justify-center text-center px-6">
      <div className="max-w-5xl">
        <h2 className="text-[110px] leading-[1] text-[color:var(--gold)] mb-8">
          More Than A Style
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto text-lg">
          This is where precision meets care. Every detail, every part, every finish is intentional — 
          built to elevate not just your look, but your presence.
        </p>
      </div>
    </motion.section>

    {/* SERVICES */}
    <section id="services" className="min-h-screen snap-start flex items-center justify-center px-6">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full">

        {services.map((service, i) => {
          const isFlipped = flipped === i;

          return (
            <div key={i} className="perspective" onClick={() => setFlipped(isFlipped ? null : i)}>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full h-[380px] rounded-2xl preserve-3d cursor-pointer
                border border-white/10 overflow-hidden group"
              >

                {/* GLOW SWEEP */}
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]
                translate-x-[-100%] group-hover:translate-x-[100%] transition duration-700"/>

                {/* FRONT */}
                <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                  <h3 className="text-[56px] text-[color:var(--gold)]">{service.title}</h3>
                </div>

                {/* BACK */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center space-y-4 bg-black/70">
                  {service.items.map((item, idx) => (
                    <p key={idx} className="text-white/80 text-base tracking-wide">{item}</p>
                  ))}
                </div>

              </motion.div>
            </div>
          );
        })}
      </div>
    </section>

    {/* STYLIST */}
    <motion.section {...fadeUp} id="stylist" className="min-h-screen snap-start flex items-center justify-center px-6">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl w-full items-center">

        <Image src="/about/stylist.png" alt="" width={800} height={600} className="rounded-2xl object-cover"/>

        <div className="space-y-8">
          <h2 className="text-[64px] text-[color:var(--gold)]">Meet the Stylist</h2>

          <p className="text-white/50 text-lg">
            Precision. Discipline. Craft. This is not a service — it’s a standard.
          </p>

          <p className="text-white/40 leading-relaxed">
            Shae Gumbs brings over a decade of mastery, cultivating not only styles, 
            but an environment where creativity, care, and healthy growth coexist. 
            Every appointment becomes an experience tailored to you.
          </p>

          <button className="px-8 py-3 bg-[color:var(--gold)] text-black rounded-full">
            Book Appointment
          </button>
        </div>

      </div>
    </motion.section>

    {/* GALLERY */}
    <section ref={galleryRef} className="min-h-[140vh] snap-start px-6 flex items-center justify-center">
      <div className="relative max-w-6xl w-full">

        <motion.div style={{ y: ySlow, scale: 1.08 }}>
          <Image src="/hair/style1.png" alt="" width={1000} height={600}
            className="w-full h-[520px] object-cover rounded-2xl"
          />
        </motion.div>

        <motion.div style={{ y: yMedium, rotate: -5 }} className="absolute left-[-50px] top-[55%] w-[260px]">
          <Image src="/hair/style2.png" alt="" width={300} height={400} className="rounded-2xl"/>
        </motion.div>

        <motion.div style={{ y: yFast, rotate: 5 }} className="absolute right-[-50px] top-[65%] w-[260px]">
          <Image src="/hair/style3.png" alt="" width={300} height={400} className="rounded-2xl"/>
        </motion.div>

      </div>
    </section>

    {/* 🔥 TRANSFORMATION (FIXED — YOU NOW SEE IT) */}
    <motion.section {...fadeUp} className="min-h-screen snap-start flex flex-col items-center justify-center px-6">

      <div className="text-center mb-16">
        <h2 className="text-[90px] text-[color:var(--gold)]">Transformation Speaks</h2>
        <p className="text-white/50 text-lg">Not just styled. Elevated.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">

        <div className="relative">
          <Image src="/hair/before1.png" alt="" width={600} height={600} className="rounded-2xl"/>
          <span className="absolute bottom-4 left-4 text-xs tracking-widest text-white/50">BEFORE</span>
        </div>

        <div className="relative">
          <Image src="/hair/after1.png" alt="" width={600} height={600} className="rounded-2xl"/>
          <span className="absolute bottom-4 left-4 text-xs tracking-widest text-white/50">AFTER</span>
        </div>

      </div>

    </motion.section>

    {/* CTA */}
    <motion.section {...fadeUp} id="contact" className="min-h-screen snap-start flex flex-col items-center justify-center text-center px-6">
      <h2 className="text-[80px] text-[color:var(--gold)] mb-6">
        Step Into Your Best Look
      </h2>
      <p className="text-white/50 mb-8 max-w-md text-lg">
        Your next look isn’t just a booking — it’s a statement.
      </p>
      <button className="px-14 py-5 rounded-full bg-[color:var(--gold)] text-black">
        Book Appointment
      </button>
    </motion.section>

    {/* FOOTER */}
    <footer className="snap-start py-16 text-center">
      <p className="text-white/40 text-sm">
        Looks By Slim © {new Date().getFullYear()}
      </p>
    </footer>

  </motion.div>
</main>

);
}
