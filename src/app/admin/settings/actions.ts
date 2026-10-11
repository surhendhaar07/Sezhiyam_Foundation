// src/app/admin/settings/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const SettingsSchema = z.object({
  foundationName: z.string().min(1).max(120),
  tagline: z.string().max(200).optional().or(z.literal("")),
  welcomeMessage: z.string().max(200).optional().or(z.literal("")),
  heroQuote: z.string().max(500).optional().or(z.literal("")),
  heroDescription: z.string().max(500).optional().or(z.literal("")),
  aboutContent: z.string().max(2000).optional().or(z.literal("")),
  visionText: z.string().max(1000).optional().or(z.literal("")),
  missionText: z.string().max(1000).optional().or(z.literal("")),
  valuesText: z.string().max(1000).optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  socialFacebook: z.string().url().optional().or(z.literal("")),
  socialInstagram: z.string().url().optional().or(z.literal("")),
  socialYoutube: z.string().url().optional().or(z.literal("")),
  socialTwitter: z.string().url().optional().or(z.literal("")),
});

export type SettingsInput = z.infer<typeof SettingsSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function updateSiteSettings(input: SettingsInput) {
  const admin = await requireAdmin();
  const data = SettingsSchema.parse(input);

  await prisma.siteSetting.upsert({
    where: { id: "main" },
    update: {
      ...data,
      logoUrl: data.logoUrl || null,
      socialFacebook: data.socialFacebook || null,
      socialInstagram: data.socialInstagram || null,
      socialYoutube: data.socialYoutube || null,
      socialTwitter: data.socialTwitter || null,
    },
    create: {
      id: "main",
      ...data,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_SITE_SETTINGS",
      targetType: "SiteSetting",
      targetId: "main",
      details: "Updated site-wide settings",
    },
  });

  // Revalidate every public page that shows settings
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return { success: true };
}