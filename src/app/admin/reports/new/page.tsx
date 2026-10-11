// src/app/admin/reports/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import ReportForm from "../ReportForm";

export const metadata = { title: "Upload Report" };

export default async function NewReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [projects, nalams] = await Promise.all([
    prisma.project.findMany({ orderBy: { title: "asc" } }),
    prisma.nalamEvent.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Upload Report"
      description="Store a private PDF report in the admin vault."
    >
      <ReportForm
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
        nalams={nalams.map((n) => ({ id: n.id, title: n.title }))}
        mode="create"
      />
    </AdminLayout>
  );
}