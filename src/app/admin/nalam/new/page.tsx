// src/app/admin/nalam/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import NalamForm from "../NalamForm";

export const metadata = { title: "Add NALAM Event" };

export default async function NewNalamPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Add NALAM Event"
      description="Create a new festival or community service event."
    >
      <NalamForm />
    </AdminLayout>
  );
}