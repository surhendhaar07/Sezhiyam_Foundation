// src/app/admin/nalam/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import NalamForm from "../NalamForm";

export const metadata = { title: "Edit NALAM Event" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNalamPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const event = await prisma.nalamEvent.findUnique({
    where: { id },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
  if (!event) notFound();

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit NALAM Event"
      description={event.title}
    >
      <NalamForm
        initialData={{
          id: event.id,
          slug: event.slug,
          title: event.title,
          occasion: event.occasion,
          year: event.year,
          description: event.description,
          longDescription: event.longDescription ?? "",
          coverImage: event.coverImage ?? "",
          date: event.date.toISOString(),
          location: event.location,
          beneficiaries: event.beneficiaries,
          fundsReceived: event.fundsReceived,
          fundsUsed: event.fundsUsed,
          published: event.published,
          gallery: event.gallery.map((g) => ({
            url: g.url,
            caption: g.caption ?? "",
          })),
        }}
      />
    </AdminLayout>
  );
}