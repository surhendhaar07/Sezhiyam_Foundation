// src/app/admin/nalam/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import NalamListClient from "./NalamListClient";

export const metadata = { title: "NALAM Management" };

export default async function NalamPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const events = await prisma.nalamEvent.findMany({
    orderBy: { date: "desc" },
    include: { gallery: { orderBy: { order: "asc" } } },
  });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="NALAM Management"
      description={`${events.length} ${events.length === 1 ? "event" : "events"}`}
      action={
        <Link
          href="/admin/nalam/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add NALAM Event
        </Link>
      }
    >
      <NalamListClient initialEvents={events} />
    </AdminLayout>
  );
}