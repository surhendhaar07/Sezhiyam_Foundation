// src/app/admin/reports/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import ReportForm from "../ReportForm";

export const metadata = { title: "Edit Report" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditReportPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const report = await prisma.report.findUnique({ where: { id } });
  if (!report) notFound();

  const [projects, nalams] = await Promise.all([
    prisma.project.findMany({ orderBy: { title: "asc" } }),
    prisma.nalamEvent.findMany({ orderBy: { title: "asc" } }),
  ]);

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit Report"
      description={report.title}
    >
      <ReportForm
        projects={projects.map((p) => ({ id: p.id, title: p.title }))}
        nalams={nalams.map((n) => ({ id: n.id, title: n.title }))}
        initialData={{
          id: report.id,
          title: report.title,
          description: report.description ?? "",
          projectId: report.projectId ?? "",
          nalamId: report.nalamId ?? "",
          eventDate: report.eventDate ? report.eventDate.toISOString() : "",
          location: report.location ?? "",
          internalNotes: report.internalNotes ?? "",
          fileName: report.fileName,
        }}
        mode="edit"
      />
    </AdminLayout>
  );
}