// src/app/admin/enquiries/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import EnquiriesListClient from "./EnquiriesListClient";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = enquiries.filter((e) => e.status === "new").length;

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Enquiries"
      description={`${enquiries.length} total · ${unread} unread`}
    >
      <EnquiriesListClient initialEnquiries={enquiries} />
    </AdminLayout>
  );
}