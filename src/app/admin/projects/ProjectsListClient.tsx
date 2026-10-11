// src/app/admin/projects/ProjectsListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteProject, toggleProjectPublish } from "./actions";
import { formatDate, formatINR } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  date: Date;
  location: string;
  category: string;
  status: string;
  beneficiaries: number;
  fundsUsed: number;
  published: boolean;
}

export default function ProjectsListClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteProject(deleteTarget.id);
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
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
        await toggleProjectPublish(id, next);
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: next } : p))
        );
        toast.success(next ? "Published" : "Hidden from site");
      } catch {
        toast.error("Could not update.");
      }
    });
  };

  const statusColor = (status: string) =>
    status === "Completed"
      ? "bg-green-100 text-green-700"
      : status === "Ongoing"
      ? "bg-orange-100 text-orange-700"
      : "bg-yellow-100 text-yellow-700";

  const columns: Column<Project>[] = [
    {
      key: "coverImage",
      header: "Cover",
      className: "w-20",
      render: (p) =>
        p.coverImage ? (
          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-neutral-100">
            <Image src={p.coverImage} alt={p.title} fill sizes="64px" className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-16 rounded-md bg-neutral-100" />
        ),
    },
    {
      key: "title",
      header: "Title",
      render: (p) => (
        <div>
          <p className="font-semibold text-neutral-900 line-clamp-1">{p.title}</p>
          <p className="text-xs text-neutral-500">{p.category}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      className: "hidden md:table-cell w-32",
      render: (p) => (
        <span className="text-xs text-neutral-600">
          {formatDate(p.date.toISOString())}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-28",
      render: (p) => (
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor(
            p.status
          )}`}
        >
          {p.status}
        </span>
      ),
    },
    {
      key: "beneficiaries",
      header: "Beneficiaries",
      className: "hidden lg:table-cell w-32",
      render: (p) => (
        <span className="text-xs text-neutral-600">
          {p.beneficiaries.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      key: "fundsUsed",
      header: "Funds Used",
      className: "hidden lg:table-cell w-32",
      render: (p) => (
        <span className="text-xs text-neutral-600">{formatINR(p.fundsUsed)}</span>
      ),
    },
    {
      key: "published",
      header: "Status",
      className: "w-32",
      render: (p) => (
        <button
          onClick={() => handleToggle(p.id, !p.published)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            p.published
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {p.published ? (
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
      render: (p) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/admin/projects/${p.id}`}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(p)}
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
        data={projects}
        columns={columns}
        searchKeys={["title", "location", "category"]}
        emptyMessage="No projects yet. Click 'Add Project' to get started."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        message={`This will permanently delete "${deleteTarget?.title}" and its gallery images. This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}