// src/app/donate/actions.ts
"use server";

import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const RazorpayKeyId = process.env.RAZORPAY_KEY_ID!;
const RazorpayKeySecret = process.env.RAZORPAY_KEY_SECRET!;

if (!RazorpayKeyId || !RazorpayKeySecret) {
  console.warn(
    "⚠️  Razorpay keys missing. Donation page will show a demo notice."
  );
}

/* -------- Auth header helper -------- */
function razorpayAuthHeader() {
  return (
    "Basic " +
    Buffer.from(`${RazorpayKeyId}:${RazorpayKeySecret}`).toString("base64")
  );
}

/* -------- Schemas -------- */
const CreateOrderSchema = z.object({
  amount: z.coerce.number().int().min(1).max(10000000), // in rupees
  donorName: z.string().min(2).max(120),
  donorEmail: z.string().email(),
  donorPhone: z.string().min(7).max(20),
  projectId: z.string().optional().or(z.literal("")),
});

const VerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type VerifyInput = z.infer<typeof VerifySchema>;

/* -------- 1. Create Razorpay order -------- */
export async function createDonationOrder(input: CreateOrderInput) {
  const data = CreateOrderSchema.parse(input);

  // Razorpay expects amount in paise (smallest unit)
  const amountPaise = data.amount * 100;

  // Create order via Razorpay REST API
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: razorpayAuthHeader(),
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        projectId: data.projectId || "",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Razorpay order creation failed:", errText);
    throw new Error("Could not create payment order. Please try again.");
  }

  const order = await res.json();

  // Record a pending donation
  await prisma.donation.create({
    data: {
      donorName: data.donorName.trim(),
      donorEmail: data.donorEmail.toLowerCase().trim(),
      donorPhone: data.donorPhone.trim(),
      amount: data.amount,
      currency: "INR",
      status: "pending",
      paymentReference: order.id, // razorpay_order_id — unique
      projectId: data.projectId || null,
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: RazorpayKeyId,
  };
}

/* -------- 2. Verify signature + mark success -------- */
export async function verifyDonationPayment(input: VerifyInput) {
  const data = VerifySchema.parse(input);

  // Signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret)
  const expectedSignature = crypto
    .createHmac("sha256", RazorpayKeySecret)
    .update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== data.razorpay_signature) {
    // Mark the donation as failed
    await prisma.donation.updateMany({
      where: { paymentReference: data.razorpay_order_id },
      data: { status: "failed" },
    });
    throw new Error("Payment verification failed");
  }

  // Fetch the payment from Razorpay to confirm status = captured
  const paymentRes = await fetch(
    `https://api.razorpay.com/v1/payments/${data.razorpay_payment_id}`,
    {
      headers: { Authorization: razorpayAuthHeader() },
    }
  );

  if (!paymentRes.ok) {
    throw new Error("Could not verify payment with Razorpay");
  }

  const payment = await paymentRes.json();

  if (payment.status !== "captured" && payment.status !== "authorized") {
    await prisma.donation.updateMany({
      where: { paymentReference: data.razorpay_order_id },
      data: { status: "failed" },
    });
    throw new Error(`Payment status: ${payment.status}`);
  }

  // Mark donation as success
  await prisma.donation.updateMany({
    where: { paymentReference: data.razorpay_order_id },
    data: {
      status: "success",
      paymentReference: data.razorpay_payment_id, // swap to payment_id (proof of capture)
    },
  });

  return {
    success: true,
    paymentId: data.razorpay_payment_id,
  };
}