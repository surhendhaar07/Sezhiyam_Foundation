// src/app/admin/news/NewsListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Megaphone } from "lucide-react";
import DataTable, { Column } from "@/components/admin/ui/DataTable";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteNews, toggleNewsPublish } from "./actions";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  publishedAt: Date;
  eventDate: Date | null;
  location: string | null;
  isEvent: boolean;
  isImportant: boolean;
  published: boolean;
}

export default function NewsListClient({
  initialPosts,
}: {
  initialPosts: Post[];
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteNews(deleteTarget.id);
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
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
        await toggleNewsPublish(id, next);
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: next } : p))
        );
        toast.success(next ? "Published" : "Hidden from site");
      } catch {
        toast.error("Could not update.");
      }
    });
  };

  const columns: Column<Post>[] = [
    {
      key: "imageUrl",
      header: "Image",
      className: "w-20",
      render: (p) =>
        p.imageUrl ? (
          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-neutral-100">
            <Image src={p.imageUrl} alt={p.title} fill sizes="64px" className="object-cover" />
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
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-neutral-900 line-clamp-1">{p.title}</p>
            {p.isImportant && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                Important
              </span>
            )}
            {p.isEvent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-orange-soft text-brand-orange-dark text-[10px] font-bold uppercase">
                <Megaphone className="h-3 w-3" /> Event
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 line-clamp-1">{p.description}</p>
        </div>
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      className: "hidden md:table-cell w-32",
      render: (p) => (
        <span className="text-xs text-neutral-600">
          {formatDate(p.publishedAt.toISOString())}
        </span>
      ),
    },
    {
      key: "eventDate",
      header: "Event Date",
      className: "hidden lg:table-cell w-32",
      render: (p) =>
        p.eventDate ? (
          <span className="text-xs text-brand-orange font-semibold">
            {formatDate(p.eventDate.toISOString())}
          </span>
        ) : (
          <span className="text-xs text-neutral-400">—</span>
        ),
    },
    {
      key: "location",
      header: "Location",
      className: "hidden xl:table-cell w-40",
      render: (p) => (
        <span className="text-xs text-neutral-600">{p.location || "—"}</span>
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
            href={`/admin/news/${p.id}`}
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
        data={posts}
        columns={columns}
        searchKeys={["title", "description", "location"]}
        emptyMessage="No news yet. Click 'Add News' to get started."
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete news post?"
        message={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}