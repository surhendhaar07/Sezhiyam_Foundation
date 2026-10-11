// src/app/admin/team/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import MemberForm from "../MemberForm";

export const metadata = { title: "Edit Team Member" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemberPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit Team Member"
      description={member.name}
    >
      <MemberForm
        initialData={{
          id: member.id,
          name: member.name,
          designation: member.designation,
          bio: member.bio ?? "",
          photoUrl: member.photoUrl ?? "",
          order: member.order,
          published: member.published,
        }}
      />
    </AdminLayout>
  );
}