// src/app/admin/locations/LocationsListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, MapPin } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteLocation, toggleLocationPublish } from "./actions";

interface Location {
  id: string;
  name: string;
  district: string;
  description: string | null;
  latitude: number;
  longitude: number;
  active: boolean;
  published: boolean;
  order: number;
}

export default function LocationsListClient({
  initialLocations,
}: {
  initialLocations: Location[];
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteLocation(deleteTarget.id);
        setLocations((prev) => prev.filter((l) => l.id !== deleteTarget.id));
        toast.success(`Deleted "${deleteTarget.name}"`);
        setDeleteTarget(null);
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  const handleToggle = (id: string, next: boolean) => {
    startTransition(async () => {
      try {
        await toggleLocationPublish(id, next);
        setLocations((prev) =>
          prev.map((l) => (l.id === id ? { ...l, published: next } : l))
        );
        toast.success(next ? "Published" : "Hidden from map");
      } catch {
        toast.error("Could not update.");
      }
    });
  };

  const columns: Column<Location>[] = [
    {
      key: "name",
      header: "Location",
      render: (l) => (
        <div className="flex items-start gap-3">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green text-white shrink-0">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-neutral-900">{l.name}</p>
            <p className="text-xs text-neutral-500">{l.district} District</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      className: "hidden lg:table-cell max-w-md",
      render: (l) => (
        <p className="text-xs text-neutral-600 line-clamp-2">
          {l.description || "—"}
        </p>
      ),
    },
    {
      key: "coordinates",
      header: "Coordinates",
      className: "hidden md:table-cell w-48",
      render: (l) => (
        <span className="text-xs text-neutral-500 font-mono">
          {l.latitude.toFixed(4)}, {l.longitude.toFixed(4)}
        </span>
      ),
    },
    {
      key: "active",
      header: "Active",
      className: "w-24",
      render: (l) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
            l.active
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {l.active ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "published",
      header: "Visibility",
      className: "w-32",
      render: (l) => (
        <button
          onClick={() => handleToggle(l.id, !l.published)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            l.published
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {l.published ? (
            <>
              <Eye className="h-3 w-3" /> Live
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3" /> Hidden
            </>
          )}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-24",
      render: (l) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/locations/${l.id}`}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(l)}
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
        data={locations}
        columns={columns}
        searchKeys={["name", "district", "description"]}
        emptyMessage="No locations yet. Click 'Add Location' to get started."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete location?"
        message={`This will remove "${deleteTarget?.name}" from the public Tamil Nadu map. This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}