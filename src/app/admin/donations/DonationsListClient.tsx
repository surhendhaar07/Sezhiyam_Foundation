// src/app/admin/donations/DonationsListClient.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, IndianRupee, Mail, Phone } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";

interface Donation {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string | null;
  amount: number;
  currency: string;
  status: string;
  paymentReference: string | null;
  projectId: string | null;
  createdAt: Date;
}

const STATUS_FILTERS = ["all", "success", "pending", "failed"] as const;

export default function DonationsListClient({
  initialDonations,
}: {
  initialDonations: Donation[];
}) {
  const [donations] = useState(initialDonations);
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return donations;
    return donations.filter((d) => d.status === filter);
  }, [donations, filter]);

  const counts = useMemo(
    () => ({
      all: donations.length,
      success: donations.filter((d) => d.status === "success").length,
      pending: donations.filter((d) => d.status === "pending").length,
      failed: donations.filter((d) => d.status === "failed").length,
    }),
    [donations]
  );

  const statusColor = (status: string) =>
    status === "success"
      ? "bg-green-100 text-green-700"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  const columns: Column<Donation>[] = [
    {
      key: "donorName",
      header: "Donor",
      render: (d) => (
        <div>
          <p className="font-semibold text-neutral-900">{d.donorName}</p>
          <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {d.donorEmail}
            </span>
            {d.donorPhone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {d.donorPhone}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      className: "w-32",
      render: (d) => (
        <span className="inline-flex items-center gap-1 font-bold text-brand-green">
          <IndianRupee className="h-3.5 w-3.5" />
          {d.amount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-28",
      render: (d) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(
            d.status
          )}`}
        >
          {d.status}
        </span>
      ),
    },
    {
      key: "paymentReference",
      header: "Reference",
      className: "hidden lg:table-cell max-w-xs",
      render: (d) => (
        <span className="text-[11px] text-neutral-500 font-mono break-all">
          {d.paymentReference || "—"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      className: "w-40",
      render: (d) => (
        <span className="text-xs text-neutral-600">
          {new Date(d.createdAt).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === s
                ? "bg-brand-green text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1 opacity-70">
              ({counts[s as keyof typeof counts]})
            </span>
          </button>
        ))}
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["donorName", "donorEmail", "paymentReference"]}
        emptyMessage="No donations match your filters."
      />
    </>
  );
}