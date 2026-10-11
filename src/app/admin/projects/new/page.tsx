// src/app/admin/projects/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "Add Project" };

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Add Project"
      description="Create a new project or completed event."
    >
      <ProjectForm />
    </AdminLayout>
  );
}