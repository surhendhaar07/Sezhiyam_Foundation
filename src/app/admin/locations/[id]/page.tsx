// src/app/admin/locations/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import LocationForm from "../LocationForm";

export const metadata = { title: "Edit Location" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLocationPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const location = await prisma.workingLocation.findUnique({ where: { id } });
  if (!location) notFound();

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit Working Location"
      description={location.name}
    >
      <LocationForm
        initialData={{
          id: location.id,
          name: location.name,
          district: location.district,
          description: location.description ?? "",
          latitude: location.latitude,
          longitude: location.longitude,
          active: location.active,
          published: location.published,
          order: location.order,
        }}
      />
    </AdminLayout>
  );
}