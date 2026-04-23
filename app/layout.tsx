import "./globals.css";
import Cursor from "./components/Cursor";
import Background from "./components/Background"; // ✅ USE THIS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-transparent text-white">

        {/* ✅ SAFE BACKGROUND (CLIENT COMPONENT) */}
        <Background />

        {/* CURSOR */}
        <Cursor />

        {children}

      </body>
    </html>
  );
}