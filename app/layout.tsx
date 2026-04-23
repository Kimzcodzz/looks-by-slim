import "./globals.css";
import Cursor from "./components/Cursor";
import Background from "./components/Background";
import Link from "next/link";
import Image from "next/image";

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

        {/* CURSOR */}
        <Cursor />

        {/* 🔥 GLOBAL NAVBAR */}
        <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
          <div className="mt-4 flex items-center gap-8 px-6 py-3 rounded-full glass pointer-events-auto">

            {/* LOGO */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[color:var(--gold)]/40 relative">
              <Image
                src="/logo/Looksbyslimlogo.png"
                alt="Looks By Slim"
                fill
                className="object-cover"
              />
            </div>

            {/* NAV LINKS */}
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

            {/* ROUTE LINKS */}
            <Link href="/contact" className="text-white/70 text-sm hover:text-white transition">
              Contact
            </Link>

            <Link
              href="/book"
              className="px-5 py-2 rounded-full border border-[color:var(--gold)] text-[color:var(--gold)] hover:bg-[color:var(--gold)] hover:text-black transition"
            >
              Book
            </Link>

          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}

      </body>
    </html>
  );
}