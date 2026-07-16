"use client";

import BookingWizard from "./BookingWizard";

export default function BookPage() {
  return (
    <main className="min-h-screen bg-transparent text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <BookingWizard />
      </div>
    </main>
  );
}