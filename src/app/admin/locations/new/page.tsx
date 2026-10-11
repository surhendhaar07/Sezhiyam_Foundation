// src/app/admin/locations/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import LocationForm from "../LocationForm";

export const metadata = { title: "Add Location" };

export default async function NewLocationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Add Working Location"
      description="Add a new location to the Tamil Nadu operations map."
    >
      <LocationForm />
    </AdminLayout>
  );
}