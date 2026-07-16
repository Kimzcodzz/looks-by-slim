"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

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

  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    instagram: "",
    notes: "",
  });

  async function submitAppointment() {

    setSubmitting(true);

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

      if (response.ok) {

        setConfirmed(true);

        confetti({
          particleCount: 150,
          spread: 90,
          origin: {
            y: 0.6
          }
        });

      }

    } catch (error) {

      console.error(error);

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

                <input
                  type="date"
                  value={date}
                  onChange={(e)=>setDate(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 p-5"
                />

              </div>

              <div>

                <label className="text-white/60 block mb-3">
                  Appointment Time
                </label>

                <input
                  type="time"
                  value={time}
                  onChange={(e)=>setTime(e.target.value)}
                  className="w-full rounded-xl bg-black/30 border border-white/10 p-5"
                />

              </div>

            </div>

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

            <div className="grid gap-6">

              {[
                ["Full Name","name"],
                ["Phone Number","phone"],
                ["Email Address","email"],
                ["Instagram","instagram"]
              ].map(([label,key])=>{
                const k = key as keyof typeof form;
                return (
                  <input
                    key={key}
                    placeholder={label}
                    value={form[k]}
                    onChange={(e)=>
                      setForm({
                        ...form,
                        [k]:e.target.value
                      })
                    }
                    className="p-5 rounded-xl bg-black/30 border border-white/10"
                  />
                )
              })}

              <textarea
                placeholder="Anything you'd like your stylist to know..."
                rows={5}
                value={form.notes}
                onChange={(e)=>
                  setForm({
                    ...form,
                    notes:e.target.value
                  })
                }
                className="p-5 rounded-xl bg-black/30 border border-white/10"
              />

            </div>

            <div className="flex justify-between mt-16">

              <button
                onClick={()=>setStep(2)}
                className="text-white/60"
              >
                ← Back
              </button>

              <button
                onClick={()=>setStep(4)}
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

            <div className="rounded-3xl border border-white/10 p-10 space-y-6 bg-black/20">

              <div className="flex justify-between">
                <span className="text-white/50">Service</span>
                <span>{service}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">Date</span>
                <span>{date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">Time</span>
                <span>{time}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-white/50">Client</span>
                <span>{form.name}</span>
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
                className="px-12 py-5 rounded-full bg-[color:var(--gold)] text-black text-lg hover:scale-105 transition disabled:opacity-50"
              >

                {
                  submitting
                    ? "Submitting..."
                    : "Book Appointment"
                }

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}