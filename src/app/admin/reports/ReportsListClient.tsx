// src/app/admin/reports/ReportsListClient.tsx
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FileText, Download, Pencil, Trash2, ShieldCheck } from "lucide-react";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { deleteReport } from "./actions";

interface Report {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  projectId: string | null;
  nalamId: string | null;
  projectTitle: string | null;
  nalamTitle: string | null;
  eventDate: Date | null;
  location: string | null;
  internalNotes: string | null;
  createdAt: Date;
}

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  if (kb < 1000) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export default function ReportsListClient({
  initialReports,
}: {
  initialReports: Report[];
}) {
  const [reports, setReports] = useState(initialReports);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteReport(deleteTarget.id);
        setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        toast.success(`Deleted "${deleteTarget.title}"`);
        setDeleteTarget(null);
      } catch {
        toast.error("Failed to delete.");
      }
    });
  };

  const formatDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
        <ShieldCheck className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-600 font-medium">No reports uploaded yet</p>
        <p className="text-sm text-neutral-500 mt-1">
          Click &ldquo;Upload Report&rdquo; to add your first internal PDF.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3">
                  Report
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3 hidden md:table-cell">
                  Linked To
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3 hidden lg:table-cell">
                  Event Date
                </th>
                <th className="text-left text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3 hidden lg:table-cell">
                  Size
                </th>
                <th className="text-right text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3 w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-start gap-3">
                      <span className="grid place-items-center h-10 w-10 rounded-lg bg-red-50 text-red-600 shrink-0">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-neutral-900 line-clamp-1">
                          {r.title}
                        </p>
                        {r.description && (
                          <p className="text-xs text-neutral-500 line-clamp-1">
                            {r.description}
                          </p>
                        )}
                        {r.internalNotes && (
                          <p className="text-[10px] text-amber-700 mt-1 line-clamp-1">
                            📝 {r.internalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top hidden md:table-cell">
                    {r.projectTitle ? (
                      <span className="inline-block px-2 py-1 rounded-md bg-brand-green-soft text-brand-green text-xs font-medium">
                        Project: {r.projectTitle}
                      </span>
                    ) : r.nalamTitle ? (
                      <span className="inline-block px-2 py-1 rounded-md bg-brand-orange-soft text-brand-orange-dark text-xs font-medium">
                        NALAM: {r.nalamTitle}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top hidden lg:table-cell">
                    <span className="text-xs text-neutral-600">
                      {formatDate(r.eventDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top hidden lg:table-cell">
                    <span className="text-xs text-neutral-600">
                      {formatSize(r.fileSize)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex items-center gap-1">
                      <a
                        href={`/api/reports/${r.id}/download`}
                        className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-600"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <Link
                        href={`/admin/reports/${r.id}`}
                        className="grid place-items-center h-8 w-8 rounded-md hover:bg-neutral-100 text-neutral-600"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(r)}
                        className="grid place-items-center h-8 w-8 rounded-md hover:bg-red-50 text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete report?"
        message={`Permanently delete "${deleteTarget?.title}" and its PDF file? This cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}