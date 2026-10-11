// src/app/admin/donations/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import DonationsListClient from "./DonationsListClient";

export const metadata = { title: "Donations" };

export default async function DonationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const donations = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Summary
  const successful = donations.filter((d) => d.status === "success");
  const totalRaised = successful.reduce((sum, d) => sum + d.amount, 0);
  const pendingCount = donations.filter((d) => d.status === "pending").length;
  const failedCount = donations.filter((d) => d.status === "failed").length;

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Donations"
      description={`${donations.length} transactions · ${successful.length} successful`}
    >
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            Total Raised
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-brand-green">
            ₹{totalRaised.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            From {successful.length} successful{" "}
            {successful.length === 1 ? "donation" : "donations"}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            Pending
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-brand-orange">
            {pendingCount}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Awaiting payment completion
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">
            Failed
          </p>
          <p className="mt-2 font-heading text-3xl font-extrabold text-red-500">
            {failedCount}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Could not be processed
          </p>
        </div>
      </div>

      <DonationsListClient initialDonations={donations} />
    </AdminLayout>
  );
}