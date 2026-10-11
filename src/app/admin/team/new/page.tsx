// src/app/admin/team/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import MemberForm from "../MemberForm";

export const metadata = { title: "Add Team Member" };

export default async function NewMemberPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Add Team Member"
      description="Create a new team member profile."
    >
      <MemberForm />
    </AdminLayout>
  );
}