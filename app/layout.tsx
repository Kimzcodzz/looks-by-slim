import "./globals.css";
import Background from "./components/Background";
import Cursor from "./components/Cursor";
import Link from "next/link";
import Image from "next/image";
import { Bodoni_Moda, Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  weight: ["500", "600"],
  display: "swap",
});

export const metadata = {
  title: "Looks By Slim",
  description: "Luxury hair styling experience",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} ${bodoniModa.variable} bg-black text-white`}>

        {/* BACKGROUND */}
        <Background />

        {/* Cinematic scroll temporarily disabled to restore native scrolling */}

        {/* CURSOR (disable on mobile for performance) */}
        <div className="hidden md:block">
          <Cursor />
        </div>

        {/* 🔥 GLOBAL NAVBAR */}
        <div className="header-shell fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none px-3 md:px-4">
          <div className="header-inner main-navbar mt-3 md:mt-4 flex items-center w-full max-w-[1120px] px-3 md:px-7 py-2.5 md:py-3.5 rounded-full glass pointer-events-auto">

            {/* LOGO */}
            <Link href="/" className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-[color:var(--gold)]/45 relative flex-shrink-0">
              <Image
                src="/logo/Looksbyslimlogo.png"
                alt="Looks By Slim"
                fill
                className="object-cover"
              />
            </Link>

            {/* NAV LINKS */}
            <div className="flex-1 flex justify-center min-w-0 px-2 md:px-0">
              <div className="flex items-center gap-2 md:gap-8 text-[10px] sm:text-xs md:text-sm whitespace-nowrap overflow-x-auto">
                <Link href="/#services" className="nav-premium-link">
                  Services
                </Link>

                <Link href="/#stylist" className="nav-premium-link">
                  Stylist
                </Link>

                <Link href="/#gallery" className="nav-premium-link">
                  Gallery
                </Link>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="ml-2 md:ml-auto flex items-center gap-2 md:gap-5 flex-shrink-0">

              <Link
                href="/contact"
                className="hidden md:inline-flex nav-premium-link nav-mobile-pill"
              >
                Contact
              </Link>

              <Link
                href="/policy"
                className="nav-premium-cta"
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