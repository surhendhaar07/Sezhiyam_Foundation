// src/app/admin/team/TeamListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import {
  deleteTeamMember,
  moveTeamMember,
  togglePublish,
} from "./actions";

interface Member {
  id: string;
  name: string;
  designation: string;
  bio: string | null;
  photoUrl: string | null;
  order: number;
  published: boolean;
}

export default function TeamListClient({
  initialMembers,
}: {
  initialMembers: Member[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteTeamMember(deleteTarget.id);
        setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        toast.success(`Deleted "${deleteTarget.name}"`);
        setDeleteTarget(null);
      } catch {
        toast.error("Failed to delete. Please try again.");
      }
    });
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      try {
        await moveTeamMember(id, direction);
        setMembers((prev) => {
          const arr = [...prev];
          const i = arr.findIndex((m) => m.id === id);
          const swap = direction === "up" ? i - 1 : i + 1;
          if (swap < 0 || swap >= arr.length) return prev;
          [arr[i], arr[swap]] = [arr[swap], arr[i]];
          return arr;
        });
      } catch {
        toast.error("Could not reorder.");
      }
    });
  };

  const handleTogglePublish = (id: string, next: boolean) => {
    startTransition(async () => {
      try {
        await togglePublish(id, next);
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, published: next } : m))
        );
        toast.success(next ? "Published" : "Hidden from site");
      } catch {
        toast.error("Could not update.");
      }
    });
  };

  const columns: Column<Member>[] = [
    {
      key: "photoUrl",
      header: "Photo",
      className: "w-20",
      render: (m) =>
        m.photoUrl ? (
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-100">
            <Image src={m.photoUrl} alt={m.name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="grid place-items-center h-12 w-12 rounded-full bg-neutral-100 text-neutral-400 text-xs">
            —
          </div>
        ),
    },
    {
      key: "name",
      header: "Name",
      render: (m) => (
        <div>
          <p className="font-semibold text-neutral-900">{m.name}</p>
          <p className="text-xs text-neutral-500">{m.designation}</p>
        </div>
      ),
    },
    {
      key: "bio",
      header: "Bio",
      className: "hidden lg:table-cell max-w-md",
      render: (m) => (
        <p className="text-xs text-neutral-600 line-clamp-2">{m.bio || "—"}</p>
      ),
    },
    {
      key: "published",
      header: "Status",
      className: "w-32",
      render: (m) => (
        <button
          onClick={() => handleTogglePublish(m.id, !m.published)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            m.published
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {m.published ? (
            <>
              <Eye className="h-3 w-3" /> Published
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
      className: "w-48",
      render: (m) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleMove(m.id, "up")}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleMove(m.id, "down")}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <Link
            href={`/admin/team/${m.id}`}
            className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-500"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(m)}
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
        data={members}
        columns={columns}
        searchKeys={["name", "designation"]}
        emptyMessage="No team members yet. Click 'Add Team Member' to get started."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete team member?"
        message={`This will permanently remove "${deleteTarget?.name}" from the team. This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}