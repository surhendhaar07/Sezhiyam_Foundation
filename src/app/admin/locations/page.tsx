// src/app/admin/locations/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import LocationsListClient from "./LocationsListClient";

export const metadata = { title: "Working Locations" };

export default async function LocationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const locations = await prisma.workingLocation.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Working Locations"
      description={`${locations.length} ${locations.length === 1 ? "location" : "locations"} shown on the Tamil Nadu map`}
      action={
        <Link
          href="/admin/locations/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Location
        </Link>
      }
    >
      <LocationsListClient initialLocations={locations} />
    </AdminLayout>
  );
}