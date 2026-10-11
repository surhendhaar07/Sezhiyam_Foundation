// src/app/admin/reports/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import ReportsListClient from "./ReportsListClient";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Enrich with project/nalam titles
  const projectIds = reports.map((r) => r.projectId).filter(Boolean) as string[];
  const nalamIds = reports.map((r) => r.nalamId).filter(Boolean) as string[];

  const [projects, nalams] = await Promise.all([
    projectIds.length
      ? prisma.project.findMany({ where: { id: { in: projectIds } } })
      : [],
    nalamIds.length
      ? prisma.nalamEvent.findMany({ where: { id: { in: nalamIds } } })
      : [],
  ]);

  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.title]));
  const nalamMap = Object.fromEntries(nalams.map((n) => [n.id, n.title]));

  const enriched = reports.map((r) => ({
    ...r,
    projectTitle: r.projectId ? projectMap[r.projectId] ?? null : null,
    nalamTitle: r.nalamId ? nalamMap[r.nalamId] ?? null : null,
  }));

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Private Reports"
      description={`${reports.length} internal ${reports.length === 1 ? "report" : "reports"} — admin-only`}
      action={
        <Link
          href="/admin/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Upload Report
        </Link>
      }
    >
      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
        🔒 <strong>Confidential.</strong> These reports are only accessible to logged-in
        administrators. Files are stored privately and served through a protected route.
      </div>

      <ReportsListClient initialReports={enriched} />
    </AdminLayout>
  );
}