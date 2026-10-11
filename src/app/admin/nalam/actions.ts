// src/app/admin/nalam/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const NalamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  occasion: z.string().min(1).max(80),
  year: z.coerce.number().int().min(2000).max(2100),
  description: z.string().min(1).max(500),
  longDescription: z.string().max(5000).optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  date: z.string().min(1),
  location: z.string().min(1).max(200),
  beneficiaries: z.coerce.number().int().min(0),
  fundsReceived: z.coerce.number().min(0),
  fundsUsed: z.coerce.number().min(0),
  published: z.coerce.boolean(),
  gallery: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().max(200).optional().or(z.literal("")),
      })
    )
    .max(20),
});

export type NalamInput = z.infer<typeof NalamSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createNalam(input: NalamInput) {
  const admin = await requireAdmin();
  const data = NalamSchema.parse(input);

  // Auto-suffix slug if duplicate
  let slug = data.slug || slugify(data.title);
  let suffix = 1;
  while (await prisma.nalamEvent.findUnique({ where: { slug } })) {
    slug = `${data.slug || slugify(data.title)}-${suffix++}`;
  }

  const event = await prisma.nalamEvent.create({
    data: {
      slug,
      title: data.title,
      occasion: data.occasion,
      year: data.year,
      description: data.description,
      longDescription: data.longDescription || null,
      coverImage: data.coverImage || null,
      date: new Date(data.date),
      location: data.location,
      beneficiaries: data.beneficiaries,
      fundsReceived: data.fundsReceived,
      fundsUsed: data.fundsUsed,
      published: data.published,
      gallery: {
        create: data.gallery.map((g, i) => ({
          url: g.url,
          caption: g.caption || null,
          order: i,
        })),
      },
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "CREATE_NALAM",
      targetType: "NalamEvent",
      targetId: event.id,
      details: `Created NALAM event: ${event.title}`,
    },
  });

  revalidatePath("/admin/nalam");
  revalidatePath("/nalam");
  revalidatePath("/");
  revalidatePath(`/nalam/${slug}`);

  return { success: true, id: event.id, slug };
}

export async function updateNalam(id: string, input: NalamInput) {
  const admin = await requireAdmin();
  const data = NalamSchema.parse(input);

  // Check slug conflict with OTHER events
  const existing = await prisma.nalamEvent.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    throw new Error("Another NALAM event already uses this slug");
  }

  // Delete old gallery, recreate
  await prisma.nalamImage.deleteMany({ where: { nalamEventId: id } });

  const event = await prisma.nalamEvent.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      occasion: data.occasion,
      year: data.year,
      description: data.description,
      longDescription: data.longDescription || null,
      coverImage: data.coverImage || null,
      date: new Date(data.date),
      location: data.location,
      beneficiaries: data.beneficiaries,
      fundsReceived: data.fundsReceived,
      fundsUsed: data.fundsUsed,
      published: data.published,
      gallery: {
        create: data.gallery.map((g, i) => ({
          url: g.url,
          caption: g.caption || null,
          order: i,
        })),
      },
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_NALAM",
      targetType: "NalamEvent",
      targetId: id,
      details: `Updated NALAM event: ${event.title}`,
    },
  });

  revalidatePath("/admin/nalam");
  revalidatePath("/nalam");
  revalidatePath("/");
  revalidatePath(`/nalam/${event.slug}`);

  return { success: true };
}

export async function deleteNalam(id: string) {
  const admin = await requireAdmin();
  const event = await prisma.nalamEvent.findUnique({ where: { id } });
  if (!event) throw new Error("NALAM event not found");

  await prisma.nalamEvent.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_NALAM",
      targetType: "NalamEvent",
      targetId: id,
      details: `Deleted NALAM event: ${event.title}`,
    },
  });

  revalidatePath("/admin/nalam");
  revalidatePath("/nalam");
  revalidatePath("/");
  revalidatePath(`/nalam/${event.slug}`);

  return { success: true };
}

export async function toggleNalamPublish(id: string, published: boolean) {
  const admin = await requireAdmin();
  await prisma.nalamEvent.update({ where: { id }, data: { published } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: published ? "PUBLISH_NALAM" : "UNPUBLISH_NALAM",
      targetType: "NalamEvent",
      targetId: id,
    },
  });

  revalidatePath("/admin/nalam");
  revalidatePath("/nalam");
  revalidatePath("/");
  return { success: true };
}