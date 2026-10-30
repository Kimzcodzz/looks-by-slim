"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const POLICY_COOKIE = "lbs_policy_accepted";

type PolicyAcceptanceProps = {
  nextPath: string;
};

export default function PolicyAcceptance({ nextPath }: PolicyAcceptanceProps) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeNextPath = useMemo(() => {
    if (!nextPath.startsWith("/")) {
      return "/book";
    }

    if (nextPath.startsWith("//")) {
      return "/book";
    }

    return nextPath;
  }, [nextPath]);

  const handleContinue = () => {
    if (!accepted || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const maxAge = 60 * 60 * 24 * 180;
    document.cookie = `${POLICY_COOKIE}=1; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;

    try {
      window.localStorage.setItem(POLICY_COOKIE, "1");
    } catch {
      // Ignore localStorage write errors (private mode, disabled storage, etc.)
    }

    router.push(safeNextPath);
  };

  return (
    <div className="space-y-8 rounded-[30px] border border-white/15 bg-black/50 p-7 md:p-10">
      <div className="space-y-4">
        <h1 className="text-[36px] sm:text-[48px] md:text-[62px] leading-[1.02] text-[color:var(--gold)]">
          Booking Policy
        </h1>
        <p className="max-w-3xl text-white/65 leading-8">
          Please review and accept these policies before continuing to your appointment request.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg text-[color:var(--gold)] mb-2">Deposits</h2>
          <p className="text-white/65 leading-7 text-sm">
            Select services may require a non-refundable deposit to secure your appointment time.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg text-[color:var(--gold)] mb-2">Late Arrivals</h2>
          <p className="text-white/65 leading-7 text-sm">
            Arriving more than 15 minutes late may require shortening or rescheduling your service.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg text-[color:var(--gold)] mb-2">Cancellations</h2>
          <p className="text-white/65 leading-7 text-sm">
            Please cancel or reschedule at least 24 hours in advance to avoid cancellation fees.
          </p>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg text-[color:var(--gold)] mb-2">No-Show Policy</h2>
          <p className="text-white/65 leading-7 text-sm">
            Missed appointments without notice may require full prepayment for future bookings.
          </p>
        </article>
      </div>

      <div className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--gold)]/10 p-5">
        <p className="text-sm leading-7 text-white/75">
          By continuing, you confirm you have read and agree to the policies above.
        </p>
      </div>

      <label className="flex items-start gap-3 text-sm text-white/80">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-white/30 bg-black text-[color:var(--gold)]"
        />
        <span>
          I have read and agree to the booking policy.
        </span>
      </label>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!accepted || isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-[color:var(--gold)] px-7 py-3 text-black transition disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
      >
        Continue to Booking
      </button>
    </div>
  );
}
