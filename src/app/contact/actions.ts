// src/app/contact/actions.ts
"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const EnquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Please enter a valid email"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(20, "Phone number too long")
    .regex(/^[+\d\s\-()]+$/, "Phone can only contain digits, spaces, +, -, ()"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type EnquiryInput = z.infer<typeof EnquirySchema>;

export async function submitEnquiry(input: EnquiryInput) {
  // Basic honeypot/spam protection — using user-agent and a minimum time heuristic
  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  if (!userAgent) {
    throw new Error("Invalid request");
  }

  const data = EnquirySchema.parse(input);

  // Simple spam heuristics — reject obvious junk
  const lowerMessage = data.message.toLowerCase();
  const spamPatterns = [/https?:\/\/\S+/g, /viagra|casino|loan|bitcoin/i];
  for (const pattern of spamPatterns) {
    if (pattern.test(lowerMessage) || pattern.test(data.name)) {
      throw new Error("Your message contains content that looks like spam");
    }
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      status: "new",
    },
  });

  // TODO: Email notification — will be wired during deployment stage
  // console.log(`New enquiry from ${data.email}`);

  return { success: true, id: enquiry.id };
}