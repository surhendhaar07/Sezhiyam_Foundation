// src/app/contact/page.tsx
"use client";

import { useState, useTransition } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { submitEnquiry } from "./actions";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await submitEnquiry(form);
        setSubmitted(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } catch (err: any) {
        setError(err?.message || "Could not send your message. Please try again.");
      }
    });
  };

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you — whether you want to volunteer, donate, or partner with us."
        breadcrumb="Contact Us"
      />

      <section className="py-14 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <Reveal className="lg:col-span-2">
            <div className="bg-brand-green text-white rounded-3xl p-8 h-full">
              <h2 className="font-heading text-2xl font-bold">Reach Us</h2>
              <p className="mt-2 text-white/80 text-sm">
                We typically respond within 24 hours.
              </p>

              <ul className="mt-8 space-y-6">
                <li className="flex items-start gap-4">
                  <div className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-orange shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">
                      Address
                    </p>
                    <p className="mt-1">Tamil Nadu, India</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-orange shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">
                      Phone
                    </p>
                    <p className="mt-1">+91 90000 00000</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-orange shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">
                      Email
                    </p>
                    <p className="mt-1 break-all">info@sezhiyam.org</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="grid place-items-center h-11 w-11 rounded-2xl bg-brand-orange shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/70 font-semibold">
                      Office Hours
                    </p>
                    <p className="mt-1">Mon – Sat, 9:00 AM – 6:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.15} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="grid place-items-center h-16 w-16 rounded-full bg-brand-green-soft text-brand-green mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-bold text-brand-green">
                    Thank you!
                  </h3>
                  <p className="mt-2 text-neutral-700">
                    Your message has been received. We&apos;ll get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-heading text-2xl font-bold text-brand-green">
                    Send us a message
                  </h2>
                  <p className="mt-2 text-neutral-600 text-sm">
                    All fields are required.
                  </p>

                  {error && (
                    <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 text-red-700 text-sm">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          placeholder="+91 90000 00000"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-1.5">
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors shadow-md disabled:opacity-60"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}