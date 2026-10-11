// src/app/admin/locations/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const LocationSchema = z.object({
  name: z.string().min(1).max(120),
  district: z.string().min(1).max(120),
  description: z.string().max(300).optional().or(z.literal("")),
  latitude: z.coerce.number().min(8).max(14), // Tamil Nadu bounds roughly
  longitude: z.coerce.number().min(76).max(81),
  active: z.coerce.boolean(),
  published: z.coerce.boolean(),
  order: z.coerce.number().int().min(0),
});

export type LocationInput = z.infer<typeof LocationSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function createLocation(input: LocationInput) {
  const admin = await requireAdmin();
  const data = LocationSchema.parse(input);

  const loc = await prisma.workingLocation.create({ data });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "CREATE_LOCATION",
      targetType: "WorkingLocation",
      targetId: loc.id,
      details: `Created location: ${loc.name}`,
    },
  });

  revalidatePath("/admin/locations");
  revalidatePath("/");
  return { success: true, id: loc.id };
}

export async function updateLocation(id: string, input: LocationInput) {
  const admin = await requireAdmin();
  const data = LocationSchema.parse(input);

  const loc = await prisma.workingLocation.update({
    where: { id },
    data,
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_LOCATION",
      targetType: "WorkingLocation",
      targetId: id,
      details: `Updated location: ${loc.name}`,
    },
  });

  revalidatePath("/admin/locations");
  revalidatePath("/");
  return { success: true };
}

export async function deleteLocation(id: string) {
  const admin = await requireAdmin();
  const loc = await prisma.workingLocation.findUnique({ where: { id } });
  if (!loc) throw new Error("Location not found");

  await prisma.workingLocation.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_LOCATION",
      targetType: "WorkingLocation",
      targetId: id,
      details: `Deleted location: ${loc.name}`,
    },
  });

  revalidatePath("/admin/locations");
  revalidatePath("/");
  return { success: true };
}

export async function toggleLocationPublish(id: string, published: boolean) {
  const admin = await requireAdmin();
  await prisma.workingLocation.update({ where: { id }, data: { published } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: published ? "PUBLISH_LOCATION" : "UNPUBLISH_LOCATION",
      targetType: "WorkingLocation",
      targetId: id,
    },
  });

  revalidatePath("/admin/locations");
  revalidatePath("/");
  return { success: true };
}