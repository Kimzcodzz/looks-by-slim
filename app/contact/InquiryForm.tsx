"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function InquiryForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      instagram: String(formData.get("instagram") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to send inquiry right now.");
      }

      setState("success");
      setMessage("Inquiry sent. We received your message and will reply soon.");
      form.reset();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unable to send inquiry right now.";
      setState("error");
      setMessage(text);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        required
        className="w-full rounded-xl bg-black/30 border border-white/10 p-4"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        className="w-full rounded-xl bg-black/30 border border-white/10 p-4"
      />

      <input
        type="text"
        name="instagram"
        placeholder="Instagram (optional)"
        className="w-full rounded-xl bg-black/30 border border-white/10 p-4"
      />

      <textarea
        rows={6}
        name="message"
        placeholder="Tell us what service you're interested in..."
        required
        className="w-full rounded-xl bg-black/30 border border-white/10 p-4"
      />

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-[color:var(--gold)] px-8 py-3 text-black font-medium hover:opacity-90 transition disabled:opacity-60"
      >
        {state === "submitting" ? "Sending..." : "Send Inquiry"}
      </button>

      {message ? (
        <p className={state === "success" ? "text-sm text-emerald-300" : "text-sm text-red-300"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
