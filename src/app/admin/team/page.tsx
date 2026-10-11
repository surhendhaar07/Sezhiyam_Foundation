// src/app/admin/team/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import TeamListClient from "./TeamListClient";

export const metadata = { title: "Team Management" };

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const members = await prisma.teamMember.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Team Management"
      description={`${members.length} team ${members.length === 1 ? "member" : "members"}`}
      action={
        <Link
          href="/admin/team/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Team Member
        </Link>
      }
    >
      <TeamListClient initialMembers={members} />
    </AdminLayout>
  );
}