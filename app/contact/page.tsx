import Link from "next/link";
import InquiryForm from "./InquiryForm";

export const metadata = {
  title: "Contact | Looks By Slim",
  description: "Get in touch with Looks By Slim for luxury hair services and booking support.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen text-white px-6 py-24 md:py-32">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-16">

        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-[42px] sm:text-[56px] md:text-[72px] text-[color:var(--gold)] font-semibold leading-[1.02]">
              Let&apos;s Plan Your Next Look
            </h1>

            <p className="text-white/60 max-w-xl leading-8">
              Reach out with questions, appointment requests, or custom styling needs.
              We reply as quickly as possible and guide you through the best service for your vision.
            </p>
          </div>

          <div className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-7 md:p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Email</p>
              <a href="mailto:info@looksbyslim.com" className="text-xl text-[color:var(--gold)] hover:opacity-80 transition">
                info@looksbyslim.com
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Instagram</p>
              <a href="https://instagram.com/looksbyslim" target="_blank" rel="noreferrer" className="text-xl text-white hover:text-[color:var(--gold)] transition">
                @looksbyslim
              </a>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2">Business Hours</p>
              <p className="text-white/70 leading-7">
                Monday - Saturday: 9:00 AM - 6:00 PM
                <br />
                Sunday: By request only
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link href="/policy" className="rounded-full bg-[color:var(--gold)] px-6 py-3 text-black transition hover:opacity-90">
              Book Appointment
            </Link>
            <Link href="/gallery" className="rounded-full border border-white/20 px-6 py-3 text-white/80 hover:text-white hover:border-white/40 transition">
              View Gallery
            </Link>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/10 bg-black/30 p-7 md:p-10">
          <h2 className="text-3xl md:text-4xl text-[color:var(--gold)] mb-3">Send An Inquiry</h2>
          <p className="text-white/55 mb-8">
            Share what you&apos;re looking for and we will reach out with next steps.
          </p>
          <InquiryForm />
        </section>

      </div>
    </main>
  );
}
