// src/app/donate/page.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Heart,
  ShieldCheck,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { createDonationOrder, verifyDonationPayment } from "./actions";

const PRESETS = [100, 500, 1000, 5000, 10000];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonatePage() {
  const [amount, setAmount] = useState<number>(500);
  const [custom, setCustom] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<
    "idle" | "creating" | "processing" | "success" | "failed"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [isPending, startTransition] = useTransition();

  // Load Razorpay checkout script once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("razorpay-checkout-js")) return;

    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const effectiveAmount = custom ? Number(custom) || 0 : amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (effectiveAmount < 1) {
      setErrorMsg("Please enter a valid donation amount.");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      try {
        setStatus("creating");

        // 1. Create Razorpay order on the server
        const order = await createDonationOrder({
          amount: effectiveAmount,
          donorName: form.name,
          donorEmail: form.email,
          donorPhone: form.phone,
          projectId: "",
        });

        // 2. Open Razorpay checkout
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey || !window.Razorpay) {
          throw new Error(
            "Payment system not ready. Please refresh and try again."
          );
        }

        const rzp = new window.Razorpay({
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: "SEZHIYAM FOUNDATION",
          description: "Donation",
          order_id: order.orderId,
          prefill: {
            name: form.name,
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#F57C00" },
          handler: (response: any) => {
            setStatus("processing");
            // 3. Verify signature server-side
            startTransition(async () => {
              try {
                const res = await verifyDonationPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });
                if (res.success) {
                  setPaymentId(res.paymentId);
                  setStatus("success");
                } else {
                  setErrorMsg("Payment could not be verified.");
                  setStatus("failed");
                }
              } catch (err: any) {
                setErrorMsg(err?.message || "Verification failed.");
                setStatus("failed");
              }
            });
          },
          modal: {
            ondismiss: () => {
              if (status !== "success") setStatus("idle");
            },
          },
        });

        rzp.open();
      } catch (err: any) {
        setErrorMsg(err?.message || "Something went wrong.");
        setStatus("failed");
      }
    });
  };

  const resetForm = () => {
    setStatus("idle");
    setForm({ name: "", email: "", phone: "" });
    setCustom("");
    setErrorMsg("");
    setPaymentId("");
  };

  return (
    <>
      <PageHero
        eyebrow="Support Our Mission"
        title="Donate Now"
        subtitle="Your contribution fuels our work. Every rupee counts."
        breadcrumb="Donate"
      />

      <section className="py-14 bg-brand-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Reveal className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
                {/* Success state */}
                {status === "success" ? (
                  <div className="text-center py-12">
                    <div className="grid place-items-center h-20 w-20 rounded-full bg-brand-green-soft text-brand-green mx-auto">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h2 className="mt-6 font-heading text-3xl font-bold text-brand-green">
                      Thank you for your donation!
                    </h2>
                    <p className="mt-3 text-neutral-700">
                      Your contribution of{" "}
                      <strong>₹{effectiveAmount.toLocaleString("en-IN")}</strong>{" "}
                      has been received successfully.
                    </p>
                    <p className="mt-2 text-xs text-neutral-500 break-all">
                      Payment ID: {paymentId}
                    </p>
                    <div className="mt-8 p-4 rounded-2xl bg-brand-cream text-sm text-neutral-700 max-w-md mx-auto">
                      A receipt will be emailed to{" "}
                      <strong>{form.email || "your email"}</strong> within 24 hours.
                    </div>
                    <button
                      onClick={resetForm}
                      className="mt-8 px-6 py-3 rounded-full bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors"
                    >
                      Make Another Donation
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-heading text-2xl font-bold text-brand-green">
                      Make a Donation
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600">
                      Choose an amount to support our work across Tamil Nadu.
                    </p>

                    {errorMsg && (
                      <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-red-50 text-red-700 text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-3">
                          Select Amount
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                          {PRESETS.map((amt) => (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => {
                                setAmount(amt);
                                setCustom("");
                              }}
                              className={`px-3 py-3 rounded-xl font-semibold text-sm transition-all ${
                                amount === amt && !custom
                                  ? "bg-brand-orange text-white shadow"
                                  : "bg-brand-cream border border-brand-cream-dark text-brand-green hover:bg-brand-orange-soft"
                              }`}
                            >
                              ₹{amt.toLocaleString("en-IN")}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="custom"
                          className="block text-sm font-semibold text-neutral-700 mb-1.5"
                        >
                          Or enter a custom amount
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            id="custom"
                            type="number"
                            min="1"
                            value={custom}
                            onChange={(e) => setCustom(e.target.value)}
                            placeholder="Custom amount"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        <div>
                          <label
                            htmlFor="dname"
                            className="block text-sm font-semibold text-neutral-700 mb-1.5"
                          >
                            Full Name
                          </label>
                          <input
                            id="dname"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="dphone"
                            className="block text-sm font-semibold text-neutral-700 mb-1.5"
                          >
                            Phone
                          </label>
                          <input
                            id="dphone"
                            type="tel"
                            required
                            value={form.phone}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="demail"
                          className="block text-sm font-semibold text-neutral-700 mb-1.5"
                        >
                          Email Address
                        </label>
                        <input
                          id="demail"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                        />
                      </div>

                      <div className="pt-6 border-t border-neutral-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-neutral-600">
                            You&apos;re donating:
                          </span>
                          <span className="font-heading text-2xl font-bold text-brand-green">
                            ₹{effectiveAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={isPending || status === "creating" || status === "processing"}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-orange text-white font-semibold hover:bg-brand-orange-dark transition-colors shadow-md disabled:opacity-60"
                        >
                          {status === "creating" || status === "processing" || isPending ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>
                              <Heart className="h-5 w-5" />
                              Proceed to Pay ₹{effectiveAmount.toLocaleString("en-IN")}
                            </>
                          )}
                        </button>
                        <p className="mt-3 text-xs text-neutral-500 text-center">
                          🔒 Secure payment via Razorpay (Test Mode)
                        </p>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="space-y-6">
                <div className="bg-brand-green text-white rounded-3xl p-6">
                  <ShieldCheck className="h-8 w-8 text-brand-orange" />
                  <h3 className="mt-4 font-heading text-lg font-bold">
                    Your donation is safe
                  </h3>
                  <p className="mt-2 text-sm text-white/85 leading-relaxed">
                    All transactions are processed through Razorpay, a PCI-DSS
                    certified payment gateway. We never store your card details.
                  </p>
                </div>

                <div className="bg-brand-orange-soft rounded-3xl p-6">
                  <h3 className="font-heading text-lg font-bold text-brand-orange-dark">
                    Where your money goes
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                      70% — Direct program costs
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                      20% — Field operations
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                      10% — Administration
                    </li>
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}