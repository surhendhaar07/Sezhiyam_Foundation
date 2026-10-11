// src/app/admin/projects/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import ProjectsListClient from "./ProjectsListClient";

export const metadata = { title: "Projects Management" };

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const projects = await prisma.project.findMany({
    orderBy: { date: "desc" },
    include: { gallery: { orderBy: { order: "asc" } } },
  });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Projects Management"
      description={`${projects.length} ${projects.length === 1 ? "project" : "projects"}`}
      action={
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      }
    >
      <ProjectsListClient initialProjects={projects} />
    </AdminLayout>
  );
}