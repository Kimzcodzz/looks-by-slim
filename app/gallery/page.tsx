import Image from "next/image";
import Link from "next/link";
import GalleryContent from "./GalleryContent";

export const metadata = {
  title: "Gallery | Looks By Slim",
  description: "Gallery of luxury hair transformations by Looks By Slim.",
};

const galleryImages = [
  "style1",
  "style2",
  "style3",
  "style4",
  "style5",
  "style6",
  "style7",
  "style8",
  "style9",
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen text-white px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase text-white/40 tracking-[0.35em]">Gallery</p>
          <h1 className="text-[42px] sm:text-[56px] md:text-[72px] text-[color:var(--gold)] font-semibold">
            Hair Stories That Speak For Themselves
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto leading-8">
            Explore a refined collection of signature looks, transformation details, and finishes that make every appointment feel elevated.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/#gallery" className="text-white/70 hover:text-white transition">
              Back to Home Gallery
            </Link>
            <Link href="/book" className="rounded-full bg-[color:var(--gold)] px-5 py-2 text-black transition hover:opacity-90">
              Book Appointment
            </Link>
          </div>
        </div>

          <GalleryContent />
      </div>
    </main>
  );
}
