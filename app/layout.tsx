import "./globals.css";
import Cursor from "./components/Cursor";
import Background from "./components/Background";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Looks By Slim",
  description: "Luxury hair styling experience",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent text-white">

        {/* BACKGROUND */}
        <Background />

        {/* CURSOR (disable on mobile for performance) */}
        <div className="hidden md:block">
          <Cursor />
        </div>

        {/* 🔥 GLOBAL NAVBAR */}
        <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none px-4">
          <div className="mt-4 flex items-center justify-between w-full max-w-5xl gap-4 md:gap-8 px-4 md:px-6 py-3 rounded-full glass pointer-events-auto">

            {/* LOGO */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-[color:var(--gold)]/40 relative flex-shrink-0">
              <Image
                src="/logo/Looksbyslimlogo.png"
                alt="Looks By Slim"
                fill
                className="object-cover"
              />
            </div>

            {/* NAV LINKS (desktop only stays) */}
            <div className="hidden md:flex gap-6 text-sm text-white/70">
              <a href="#services" className="hover:text-white transition">
                Services
              </a>

              <a href="#stylist" className="hover:text-white transition">
                Stylist
              </a>

              <a href="#work" className="hover:text-white transition">
                Work
              </a>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 md:gap-4">

              <Link
                href="/contact"
                className="text-white/70 text-xs md:text-sm hover:text-white transition"
              >
                Contact
              </Link>

              <Link
                href="/book"
                className="px-4 md:px-5 py-2 text-xs md:text-sm rounded-full border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black transition"
              >
                Book
              </Link>

            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}

      </body>
    </html>
  );
}