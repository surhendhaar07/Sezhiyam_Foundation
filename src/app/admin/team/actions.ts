// src/app/admin/team/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

/* ---- Validation schema ---- */
const TeamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  designation: z.string().min(1, "Designation is required").max(120),
  bio: z.string().max(600).optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(true),
});

export type TeamMemberInput = z.infer<typeof TeamMemberSchema>;

/* ---- Auth helper ---- */
async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

/* ---- Actions ---- */

export async function createTeamMember(input: TeamMemberInput) {
  const admin = await requireAdmin();
  const data = TeamMemberSchema.parse(input);

  const member = await prisma.teamMember.create({
    data: {
      name: data.name,
      designation: data.designation,
      bio: data.bio || null,
      photoUrl: data.photoUrl || null,
      order: data.order,
      published: data.published,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "CREATE_TEAM_MEMBER",
      targetType: "TeamMember",
      targetId: member.id,
      details: `Created team member: ${member.name}`,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true, id: member.id };
}

export async function updateTeamMember(id: string, input: TeamMemberInput) {
  const admin = await requireAdmin();
  const data = TeamMemberSchema.parse(input);

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      name: data.name,
      designation: data.designation,
      bio: data.bio || null,
      photoUrl: data.photoUrl || null,
      order: data.order,
      published: data.published,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_TEAM_MEMBER",
      targetType: "TeamMember",
      targetId: id,
      details: `Updated team member: ${member.name}`,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true };
}

export async function deleteTeamMember(id: string) {
  const admin = await requireAdmin();

  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) throw new Error("Member not found");

  await prisma.teamMember.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_TEAM_MEMBER",
      targetType: "TeamMember",
      targetId: id,
      details: `Deleted team member: ${member.name}`,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true };
}

export async function moveTeamMember(id: string, direction: "up" | "down") {
  const admin = await requireAdmin();

  const all = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  const index = all.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Member not found");

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= all.length) return { success: true };

  const a = all[index];
  const b = all[swapWith];

  await prisma.$transaction([
    prisma.teamMember.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.teamMember.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "REORDER_TEAM_MEMBER",
      targetType: "TeamMember",
      targetId: id,
      details: `Moved ${direction}`,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true };
}

export async function togglePublish(id: string, published: boolean) {
  const admin = await requireAdmin();

  await prisma.teamMember.update({ where: { id }, data: { published } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: published ? "PUBLISH_TEAM_MEMBER" : "UNPUBLISH_TEAM_MEMBER",
      targetType: "TeamMember",
      targetId: id,
    },
  });

  revalidatePath("/admin/team");
  revalidatePath("/");
  revalidatePath("/about");

  return { success: true };
}