"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

function toDateKey(dateValue: Date) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, "0");
  const day = String(dateValue.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toReadableDateLabel(dateValue: Date) {
  return dateValue.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toLongDateLabel(dateKey: string) {
  if (!dateKey) return "Not selected";

  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    return dateKey;
  }

  const value = new Date(year, month - 1, day);
  return value.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhoneNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const services = [
    "Knotless Braids",
    "Boho Braids",
    "Cornrows",
    "Stitch Braids",
    "Retwist",
    "Starter Locs",
    "Wash & Blow Dry",
    "Consultation",
  ];

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];

  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [bookedSlotsByDate, setBookedSlotsByDate] = useState<Record<string, string[]>>({});

  const calendarDates = useMemo(() => {
    const dates: Array<{ key: string; label: string }> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 45; i += 1) {
      const candidate = new Date(today);
      candidate.setDate(today.getDate() + i);
      const key = toDateKey(candidate);
      dates.push({
        key,
        label: toReadableDateLabel(candidate),
      });
    }

    return dates;
  }, []);

  const fullyBookedDates = useMemo(() => {
    return new Set(
      Object.entries(bookedSlotsByDate)
        .filter(([, slots]) => slots.length >= timeSlots.length)
        .map(([dateKey]) => dateKey)
    );
  }, [bookedSlotsByDate, timeSlots.length]);

  useEffect(() => {
    async function fetchAvailability() {
      setLoadingAvailability(true);
      setAvailabilityError("");

      try {
        const response = await fetch("/api/appointments");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "Unable to load appointment availability");
        }

        setBookedSlotsByDate(payload.bookedSlotsByDate || {});
      } catch (error) {
        console.error(error);
        setAvailabilityError("We could not load live availability. Please refresh and try again.");
      } finally {
        setLoadingAvailability(false);
      }
    }

    fetchAvailability();
  }, []);

  useEffect(() => {
    if (!date) {
      return;
    }

    if (fullyBookedDates.has(date)) {
      setDate("");
      setTime("");
      setAvailabilityError("That date is fully booked. Please choose another date.");
      return;
    }

    const bookedTimesForDate = bookedSlotsByDate[date] || [];
    if (time && bookedTimesForDate.includes(time)) {
      setTime("");
    }
  }, [date, time, bookedSlotsByDate, fullyBookedDates]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    notes: "",
  });
  const [fieldTouched, setFieldTouched] = useState({
    phone: false,
    email: false,
  });
  const [attemptedStepThreeContinue, setAttemptedStepThreeContinue] = useState(false);

  const phoneIsValid = isValidPhoneNumber(form.phone);
  const emailIsValid = isValidEmail(form.email);
  const showPhoneError = (fieldTouched.phone || attemptedStepThreeContinue) && !phoneIsValid;
  const showEmailError = (fieldTouched.email || attemptedStepThreeContinue) && !emailIsValid;
  const stepThreeCanContinue =
    form.name.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.email.trim().length > 0 &&
    phoneIsValid &&
    emailIsValid;

  async function submitAppointment() {

    setSubmitting(true);
    setAvailabilityError("");

    try {

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

          service,
          date,
          time,

          fullName: form.name,
          phone: form.phone,
          email: form.email,
          instagram: form.instagram,
          notes: form.notes,

        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAvailabilityError(result?.message || "Unable to book this appointment.");
        setSubmitting(false);
        return;
      }

      if (response.ok) {

        setConfirmed(true);

        confetti({
          particleCount: 150,
          spread: 90,
          colors: ["#e6c28b", "#f3d9a4", "#ff4d8d", "#ff8fb8"],
          origin: {
            y: 0.6
          }
        });

        setBookedSlotsByDate((current) => {
          const slots = current[date] || [];
          if (slots.includes(time)) {
            return current;
          }

          return {
            ...current,
            [date]: [...slots, time],
          };
        });

      }

    } catch (error) {

      console.error(error);
      setAvailabilityError("Unable to book this appointment right now. Please try again.");

    }

    setSubmitting(false);

  }

  if (confirmed) {

    return (

      <div className="min-h-[600px] flex items-center justify-center text-center">

        <motion.div
          initial={{ opacity: 0, scale: .8 }}
          animate={{ opacity: 1, scale: 1 }}
        >

          <div className="text-6xl mb-8">
            ✨
          </div>

          <h1 className="text-5xl text-[color:var(--gold)]">
            Appointment Requested
          </h1>

          <p className="text-white/60 mt-6 max-w-lg">
            Thank you for choosing Looks By Slim.
            Your appointment request has been received.
            We will contact you shortly to confirm your appointment.
          </p>

          <p className="text-[color:var(--gold)] mt-4 max-w-lg mx-auto">
            A non-refundable deposit is required to secure your booking.
            Check your email for payment instructions.
          </p>

        </motion.div>

      </div>

    );

  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* HERO */}

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl text-[color:var(--gold)] mt-5">
          Book Your Appointment
        </h1>

        <p className="text-white/60 mt-8 max-w-2xl mx-auto leading-8">
          Every appointment begins with intention.
          Select your service, choose your preferred time,
          and reserve your next luxury experience.
        </p>
      </motion.div>

      {/* PROGRESS */}

      <div className="mb-16">

        <div className="flex justify-between text-sm text-white/50 mb-4">
          <span>Step {step} of 4</span>
          <span>{Math.round((step / 4) * 100)}%</span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: .4 }}
            className="h-full bg-[color:var(--gold)]"
          />
        </div>

      </div>

      <AnimatePresence mode="wait">

        {/* STEP ONE */}

        {step === 1 && (

          <motion.div
            key="one"
            initial={{ opacity:0,y:40 }}
            animate={{ opacity:1,y:0 }}
            exit={{ opacity:0,y:-40 }}
          >

            <h2 className="text-4xl text-[color:var(--gold)] mb-10">
              Choose Your Service
            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              {services.map((item)=>(
                <button
                  key={item}
                  onClick={()=>setService(item)}
                  className={`p-8 rounded-3xl border transition-all text-left ${
                    service===item
                    ? "border-[color:var(--gold)] bg-[color:var(--gold)]/10"
                    : "border-white/10 hover:border-[color:var(--gold)]/40"
                  }`}
                >
                  <h3 className="text-2xl">
                    {item}
                  </h3>

                </button>
              ))}

            </div>

            <div className="flex justify-end mt-16">

              <button
                disabled={!service}
                onClick={()=>setStep(2)}
                className="px-10 py-4 rounded-full bg-[color:var(--gold)] text-black disabled:opacity-30"
              >
                Continue →
              </button>

            </div>

          </motion.div>

        )}

        {/* STEP TWO */}

        {step===2 &&(

          <motion.div
            key="two"
            initial={{opacity:0,y:40}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-40}}
          >

            <h2 className="text-4xl text-[color:var(--gold)] mb-10">
              Choose Date & Time
            </h2>

            <div className="grid md:grid-cols-2 gap-10">

              <div>

                <label className="text-white/60 block mb-3">
                  Appointment Date
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[300px] overflow-auto pr-1">
                  {calendarDates.map((calendarDate) => {
                    const isSelected = date === calendarDate.key;
                    const isDisabled = fullyBookedDates.has(calendarDate.key);

                    return (
                      <button
                        key={calendarDate.key}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          setAvailabilityError("");
                          setDate(calendarDate.key);
                          setTime("");
                        }}
                        className={`rounded-xl border px-3 py-3 text-sm transition-all ${
                          isSelected
                            ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                            : isDisabled
                              ? "border-white/10 bg-black/20 text-white/35 cursor-not-allowed"
                              : "border-white/10 bg-black/30 text-white/80 hover:border-[color:var(--gold)]/40"
                        }`}
                      >
                        {calendarDate.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs text-white/50 mt-3">
                  Fully booked dates are disabled.
                </p>

              </div>

              <div>

                <label className="text-white/60 block mb-3">
                  Appointment Time
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => {
                    const isUnavailable = !date || (bookedSlotsByDate[date] || []).includes(slot);

                    return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setTime(slot)}
                      className={`rounded-xl border px-4 py-3 text-sm transition-all ${
                        time === slot
                          ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
                          : isUnavailable
                            ? "border-white/10 bg-black/20 text-white/35 cursor-not-allowed"
                            : "border-white/10 bg-black/30 text-white/80 hover:border-[color:var(--gold)]/40"
                      }`}
                    >
                      {slot}
                    </button>
                    );
                  })}
                </div>

                {!date && (
                  <p className="text-xs text-white/50 mt-3">
                    Select a date first to view available times.
                  </p>
                )}

              </div>

            </div>

            {(availabilityError || loadingAvailability) && (
              <p className="mt-6 text-sm text-[#ffb4b4]">
                {loadingAvailability ? "Loading real-time availability..." : availabilityError}
              </p>
            )}

            <div className="flex justify-between mt-16">

              <button
                onClick={()=>setStep(1)}
                className="text-white/60"
              >
                ← Back
              </button>

              <button
                disabled={!date || !time}
                onClick={()=>setStep(3)}
                className="px-10 py-4 rounded-full bg-[color:var(--gold)] text-black disabled:opacity-30"
              >
                Continue →
              </button>

            </div>

          </motion.div>

        )}

        {/* STEP THREE */}

        {step===3 &&(

          <motion.div
            key="three"
            initial={{opacity:0,y:40}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-40}}
          >

            <h2 className="text-4xl text-[color:var(--gold)] mb-10">
              Your Information
            </h2>

            <div className="grid gap-10 md:grid-cols-[1fr_1.6fr] md:items-start">
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]/70">
                  Step 3 Details
                </p>

                <h3 className="text-3xl leading-tight text-[color:var(--gold-soft)]">
                  Tell Us Who Is Booking
                </h3>

                <p className="text-white/55 leading-8">
                  We use this to confirm your booking request and send your deposit instructions.
                </p>

                <div className="h-px w-32 bg-[linear-gradient(90deg,rgba(230,194,139,0.85),rgba(230,194,139,0))]" />
              </div>

              <div className="space-y-6 rounded-[28px] border border-white/10 bg-black/25 p-6 md:p-8">
                <div className="grid gap-5 md:grid-cols-2">
                  {[
                    ["Full Name", "name", "text"],
                    ["Phone Number", "phone", "tel"],
                    ["Email Address", "email", "email"],
                    ["Instagram", "instagram", "text"],
                  ].map(([label, key, type]) => {
                    const k = key as keyof typeof form;
                    const isPhoneField = k === "phone";
                    const isEmailField = k === "email";
                    const hasError = (isPhoneField && showPhoneError) || (isEmailField && showEmailError);

                    return (
                      <label key={key} className="block">
                        <span className="block text-[11px] uppercase tracking-[0.22em] text-white/45 mb-2">
                          {label}
                        </span>

                        <input
                          type={type}
                          placeholder={label}
                          value={form[k]}
                          onBlur={() => {
                            if (isPhoneField) {
                              setFieldTouched((current) => ({ ...current, phone: true }));
                            }

                            if (isEmailField) {
                              setFieldTouched((current) => ({ ...current, email: true }));
                            }
                          }}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              [k]: e.target.value,
                            })
                          }
                          className={`w-full border-0 border-b bg-transparent px-0 pb-3 pt-1 text-white/95 outline-none placeholder:text-white/30 transition ${
                            hasError
                              ? "border-[#ff6a6a] focus:border-[#ff6a6a]"
                              : "border-white/20 focus:border-[color:var(--gold)]/70"
                          }`}
                        />

                        {isPhoneField && showPhoneError && (
                          <span className="mt-2 block text-xs text-[#ff8f8f]">
                            Enter a valid phone number (10-15 digits).
                          </span>
                        )}

                        {isEmailField && showEmailError && (
                          <span className="mt-2 block text-xs text-[#ff8f8f]">
                            Enter a valid email address.
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <label className="block">
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-white/45 mb-2">
                    Stylist Notes
                  </span>

                  <textarea
                    placeholder="Anything you'd like your stylist to know..."
                    rows={5}
                    value={form.notes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-white/15 bg-black/20 p-4 resize-none text-white/95 outline-none placeholder:text-white/30 focus:border-[color:var(--gold)]/60 transition"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-between mt-16">

              <button
                onClick={()=>setStep(2)}
                className="text-white/60"
              >
                ← Back
              </button>

              <button
                onClick={() => {
                  setAttemptedStepThreeContinue(true);
                  if (!stepThreeCanContinue) {
                    return;
                  }

                  setStep(4);
                }}
                className="px-10 py-4 rounded-full bg-[color:var(--gold)] text-black"
              >
                Continue →
              </button>

            </div>

          </motion.div>

        )}

        {/* STEP FOUR */}

        {step===4 &&(

          <motion.div
            key="four"
            initial={{opacity:0,y:40}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-40}}
          >

            <h2 className="text-4xl text-[color:var(--gold)] mb-10">
              Review Booking
            </h2>

            <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--gold)]/25 bg-[radial-gradient(circle_at_top,_rgba(230,194,139,0.14),_rgba(0,0,0,0.7)_55%)] p-8 md:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />

              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl leading-tight mb-4">
                  Your Session Details Are Ready
                </h3>

                <p className="text-white/60 max-w-2xl leading-7">
                  Review your details below. Once submitted, your appointment request is received and deposit instructions will be sent to secure your slot.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    ["Service", service],
                    ["Date", toLongDateLabel(date)],
                    ["Time", time],
                    ["Client", form.name],
                    ["Email", form.email],
                    ["Phone", form.phone],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-2">
                        {label}
                      </p>
                      <p className="text-lg text-white/95 break-words">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>

                {(form.instagram || form.notes) && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-5 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-2">Instagram</p>
                      <p className="text-white/90">{form.instagram || "Not provided"}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-2">Stylist Notes</p>
                      <p className="text-white/90 leading-7">{form.notes || "No additional notes"}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-[color:var(--gold)]/30 bg-[color:var(--gold)]/8 px-5 py-4 text-sm text-[color:var(--gold-soft)]">
                  Non-refundable deposit required. Your slot is confirmed after deposit completion.
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-16">

              <button
                onClick={()=>setStep(3)}
                className="text-white/60"
              >
                ← Back
              </button>

              <button
                onClick={submitAppointment}
                disabled={submitting}
                className="group relative overflow-hidden px-12 py-5 rounded-full border border-[color:var(--gold-soft)]/80 bg-[linear-gradient(135deg,_#f4dbad_0%,_#e6c28b_48%,_#c9964f_100%)] text-black text-lg font-semibold tracking-[0.06em] uppercase shadow-[0_18px_44px_rgba(230,194,139,0.36)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_26px_62px_rgba(230,194,139,0.5)] disabled:opacity-55 disabled:cursor-not-allowed disabled:hover:scale-100"
              >

                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,_transparent_30%,_rgba(255,255,255,0.55)_50%,_transparent_70%)] transition-transform duration-700 group-hover:translate-x-full" />

                <span className="relative z-10">

                {
                  submitting
                    ? "Submitting..."
                    : "Book Appointment"
                }

                </span>

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}