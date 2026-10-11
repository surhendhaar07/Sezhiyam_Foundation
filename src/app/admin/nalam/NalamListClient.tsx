// src/app/admin/nalam/NalamListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteNalam, toggleNalamPublish } from "./actions";
import { formatDate, formatINR } from "@/lib/utils";

interface Nalam {
  id: string;
  slug: string;
  title: string;
  occasion: string;
  year: number;
  coverImage: string | null;
  date: Date;
  location: string;
  beneficiaries: number;
  fundsUsed: number;
  published: boolean;
}

export default function NalamListClient({
  initialEvents,
}: {
  initialEvents: Nalam[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [deleteTarget, setDeleteTarget] = useState<Nalam | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteNalam(deleteTarget.id);
        setEvents((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        toast.success(`Deleted "${deleteTarget.title}"`);
        setDeleteTarget(null);
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  const handleToggle = (id: string, next: boolean) => {
    startTransition(async () => {
      try {
        await toggleNalamPublish(id, next);
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? { ...e, published: next } : e))
        );
        toast.success(next ? "Published" : "Hidden from site");
      } catch {
        toast.error("Could not update.");
      }
    });
  };

  const columns: Column<Nalam>[] = [
    {
      key: "coverImage",
      header: "Cover",
      className: "w-20",
      render: (e) =>
        e.coverImage ? (
          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-neutral-100">
            <Image src={e.coverImage} alt={e.title} fill sizes="64px" className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-16 rounded-md bg-neutral-100" />
        ),
    },
    {
      key: "title",
      header: "Title",
      render: (e) => (
        <div>
          <p className="font-semibold text-neutral-900 line-clamp-1">{e.title}</p>
          <p className="text-xs text-neutral-500">{e.location}</p>
        </div>
      ),
    },
    {
      key: "occasion",
      header: "Occasion",
      className: "w-32",
      render: (e) => (
        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-orange-soft text-brand-orange-dark">
          {e.occasion}
        </span>
      ),
    },
    {
      key: "year",
      header: "Year",
      className: "w-20",
      render: (e) => (
        <span className="text-xs text-neutral-600 font-semibold">{e.year}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "hidden md:table-cell w-32",
      render: (e) => (
        <span className="text-xs text-neutral-600">
          {formatDate(e.date.toISOString())}
        </span>
      ),
    },
    {
      key: "beneficiaries",
      header: "Beneficiaries",
      className: "hidden lg:table-cell w-32",
      render: (e) => (
        <span className="text-xs text-neutral-600">
          {e.beneficiaries.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "fundsUsed",
      header: "Funds Used",
      className: "hidden xl:table-cell w-32",
      render: (e) => (
        <span className="text-xs text-neutral-600">{formatINR(e.fundsUsed)}</span>
      ),
    },
    {
      key: "published",
      header: "Status",
      className: "w-32",
      render: (e) => (
        <button
          onClick={() => handleToggle(e.id, !e.published)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            e.published
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {e.published ? (
            <>
              <Eye className="h-3 w-3" /> Live
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" /> Draft
            </>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-24",
      render: (e) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/nalam/${e.id}`}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(e)}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-red-50 text-red-500"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={events}
        columns={columns}
        searchKeys={["title", "occasion", "location"]}
        emptyMessage="No NALAM events yet. Click 'Add NALAM Event' to get started."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete NALAM event?"
        message={`This will permanently delete "${deleteTarget?.title}" and its gallery images. This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}