// src/app/api/reports/[id]/download/route.ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify authenticated session
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // 2. Look up the report
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) {
    return new NextResponse("Not found", { status: 404 });
  }

  // 3. Build the safe path — CRITICAL: reject any path traversal
  const filename = report.fileUrl;
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return new NextResponse("Invalid file", { status: 400 });
  }

  const filePath = path.join(process.cwd(), "storage", "reports", filename);

  // 4. Read file and stream
  try {
    const fileBuffer = await fs.readFile(filePath);

    const safeDownloadName = report.fileName.replace(/[^\w\s.\-]/g, "_");

    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeDownloadName}"`,
        "Content-Length": String(fileBuffer.length),
        "Cache-Control": "private, no-store",
      },
    });
  } catch (e) {
    console.error("Report download failed:", e);
    return new NextResponse("File not available", { status: 404 });
  }
}