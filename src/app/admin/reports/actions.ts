// src/app/admin/reports/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const MAX_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_TYPES = ["application/pdf"];

const ReportMetaSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().or(z.literal("")),
  projectId: z.string().optional().or(z.literal("")),
  nalamId: z.string().optional().or(z.literal("")),
  eventDate: z.string().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  internalNotes: z.string().max(1000).optional().or(z.literal("")),
});

export type ReportMetaInput = z.infer<typeof ReportMetaSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

/**
 * Upload a report PDF + save metadata.
 * Called from the form with a FormData object containing:
 *  - file: the PDF file
 *  - title, description, projectId, nalamId, eventDate, location, internalNotes
 */
export async function uploadReport(formData: FormData) {
  const admin = await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  if (file.size > MAX_SIZE) {
    throw new Error("File too large (max 15 MB)");
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF files are allowed");
  }

  const meta = ReportMetaSchema.parse({
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    projectId: (formData.get("projectId") as string) || "",
    nalamId: (formData.get("nalamId") as string) || "",
    eventDate: (formData.get("eventDate") as string) || "",
    location: (formData.get("location") as string) || "",
    internalNotes: (formData.get("internalNotes") as string) || "",
  });

  // Generate a safe, unguessable filename
  const ext = ".pdf";
  const rand = Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
  const storedName = `${Date.now()}-${rand}${ext}`;
  const storagePath = path.join(process.cwd(), "storage", "reports");
  const filePath = path.join(storagePath, storedName);

  // Ensure folder exists
  await fs.mkdir(storagePath, { recursive: true });

  // Write file to disk
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  // Save metadata (store only the stored filename, NOT a full path or public URL)
  const report = await prisma.report.create({
    data: {
      title: meta.title,
      description: meta.description || null,
      fileUrl: storedName, // just the filename
      fileName: file.name, // original name for display/download
      fileSize: file.size,
      projectId: meta.projectId || null,
      nalamId: meta.nalamId || null,
      eventDate: meta.eventDate ? new Date(meta.eventDate) : null,
      location: meta.location || null,
      internalNotes: meta.internalNotes || null,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPLOAD_REPORT",
      targetType: "Report",
      targetId: report.id,
      details: `Uploaded report: ${report.title}`,
    },
  });

  revalidatePath("/admin/reports");

  return { success: true, id: report.id };
}

export async function updateReportMeta(id: string, input: ReportMetaInput) {
  const admin = await requireAdmin();
  const data = ReportMetaSchema.parse(input);

  await prisma.report.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      projectId: data.projectId || null,
      nalamId: data.nalamId || null,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      location: data.location || null,
      internalNotes: data.internalNotes || null,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_REPORT",
      targetType: "Report",
      targetId: id,
      details: `Updated report metadata`,
    },
  });

  revalidatePath("/admin/reports");
  return { success: true };
}

export async function deleteReport(id: string) {
  const admin = await requireAdmin();
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) throw new Error("Report not found");

  // Delete file from disk
  try {
    const filePath = path.join(process.cwd(), "storage", "reports", report.fileUrl);
    await fs.unlink(filePath);
  } catch (e) {
    // File may already be gone; log but don't block deletion
    console.warn("Could not delete report file:", e);
  }

  await prisma.report.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_REPORT",
      targetType: "Report",
      targetId: id,
      details: `Deleted report: ${report.title}`,
    },
  });

  revalidatePath("/admin/reports");
  return { success: true };
}