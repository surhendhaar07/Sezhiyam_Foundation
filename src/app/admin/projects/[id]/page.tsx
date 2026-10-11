// src/app/admin/projects/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "Edit Project" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit Project"
      description={project.title}
    >
      <ProjectForm
        initialData={{
          id: project.id,
          slug: project.slug,
          title: project.title,
          description: project.description,
          longDescription: project.longDescription ?? "",
          coverImage: project.coverImage ?? "",
          date: project.date.toISOString(),
          duration: project.duration ?? "",
          location: project.location,
          beneficiaries: project.beneficiaries,
          fundsReceived: project.fundsReceived,
          fundsUsed: project.fundsUsed,
          category: project.category,
          status: project.status as "Upcoming" | "Ongoing" | "Completed",
          showFinancials: project.showFinancials,
          published: project.published,
          isFeatured: project.isFeatured,
          gallery: project.gallery.map((g) => ({
            url: g.url,
            caption: g.caption ?? "",
          })),
        }}
      />
    </AdminLayout>
  );
}