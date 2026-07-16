"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const galleryItems = [
  { src: "style1", caption: "Look 1 includes: Braided Ponytail" },
  { src: "style2", caption: "Look 2 includes: Braided Cornrow" },
  { src: "style3", caption: "Look 3 includes: Braided Cornrow (simple)" },
  { src: "style4", caption: "Look 4 includes: Stylish Braided Cornrow" },
  { src: "style5", caption: "Look 5 includes: Knotless Braids" },
  { src: "style6", caption: "Look 6 includes: Retwist with two-strand style" },
  { src: "style7", caption: "Look 7 includes: Boho Braids (red)" },
  { src: "style8", caption: "Look 8 includes: Simple Cornrow" },
  { src: "style9", caption: "Look 9 includes: Boho Braids (Blonde)" },
];

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75 },
  },
};

export default function GalleryContent() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleryItems.map((item, index) => (
        <motion.div
          key={item.src}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariant}
          transition={{ delay: index * 0.05 }}
          className="group overflow-hidden rounded-[32px] bg-white/5 border border-white/10 shadow-xl"
        >
          <div className="relative h-96 overflow-hidden">
            <Image
              src={`/hair/${item.src}.png`}
              alt={item.caption}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-6 space-y-3">
            <p className="text-sm uppercase text-white/40 tracking-[0.25em]">Signature Style</p>
            <h2 className="text-2xl text-white">{`Look ${index + 1}`}</h2>
            <p className="text-sm text-white/60">{item.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
