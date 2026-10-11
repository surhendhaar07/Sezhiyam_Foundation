// src/app/admin/enquiries/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function markEnquiryStatus(
  id: string,
  status: "new" | "read" | "responded"
) {
  const admin = await requireAdmin();
  await prisma.enquiry.update({ where: { id }, data: { status } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_ENQUIRY_STATUS",
      targetType: "Enquiry",
      targetId: id,
      details: `Marked as ${status}`,
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteEnquiry(id: string) {
  const admin = await requireAdmin();
  const enquiry = await prisma.enquiry.findUnique({ where: { id } });
  if (!enquiry) throw new Error("Enquiry not found");

  await prisma.enquiry.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_ENQUIRY",
      targetType: "Enquiry",
      targetId: id,
      details: `Deleted enquiry from ${enquiry.email}`,
    },
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { success: true };
}