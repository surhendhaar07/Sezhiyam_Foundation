// src/app/admin/enquiries/EnquiriesListClient.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Trash2,
  CheckCircle2,
  Circle,
  MessageSquare,
  Search,
} from "lucide-react";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { markEnquiryStatus, deleteEnquiry } from "./actions";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: Date;
}

const STATUS_FILTERS = ["all", "new", "read", "responded"] as const;

export default function EnquiriesListClient({
  initialEnquiries,
}: {
  initialEnquiries: Enquiry[];
}) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Enquiry | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesStatus = filter === "all" || e.status === filter;
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [enquiries, filter, query]);

  const counts = useMemo(() => {
    return {
      all: enquiries.length,
      new: enquiries.filter((e) => e.status === "new").length,
      read: enquiries.filter((e) => e.status === "read").length,
      responded: enquiries.filter((e) => e.status === "responded").length,
    };
  }, [enquiries]);

  const handleOpen = (e: Enquiry) => {
    setSelected(e);
    // Auto-mark as read when opened
    if (e.status === "new") {
      handleStatusChange(e.id, "read");
    }
  };

  const handleStatusChange = (id: string, status: "new" | "read" | "responded") => {
    startTransition(async () => {
      try {
        await markEnquiryStatus(id, status);
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status } : e))
        );
        if (selected?.id === id) {
          setSelected({ ...selected, status });
        }
      } catch {
        toast.error("Could not update status.");
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteEnquiry(deleteTarget.id);
        setEnquiries((prev) => prev.filter((e) => e.id !== deleteTarget.id));
        toast.success("Enquiry deleted");
        setDeleteTarget(null);
        if (selected?.id === deleteTarget.id) setSelected(null);
      } catch {
        toast.error("Could not delete.");
      }
    });
  };

  const formatDate = (d: Date) =>
    new Date(d).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <>
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Search + filters */}
          <div className="p-4 border-b border-neutral-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search enquiries…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    filter === s
                      ? "bg-brand-green text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                  <span className="ml-1 opacity-70">({counts[s as keyof typeof counts]})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 text-sm">
              {enquiries.length === 0
                ? "No enquiries yet."
                : "No enquiries match your filters."}
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100 max-h-[70vh] overflow-y-auto">
              {filtered.map((e) => (
                <li
                  key={e.id}
                  onClick={() => handleOpen(e)}
                  className={`p-4 cursor-pointer hover:bg-neutral-50 transition-colors ${
                    selected?.id === e.id ? "bg-brand-green-soft/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 mt-1">
                      {e.status === "new" ? (
                        <Circle className="h-3 w-3 fill-brand-orange text-brand-orange" />
                      ) : e.status === "responded" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                      ) : (
                        <Circle className="h-3 w-3 text-neutral-300" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p
                          className={`text-sm truncate ${
                            e.status === "new" ? "font-bold text-neutral-900" : "font-medium text-neutral-800"
                          }`}
                        >
                          {e.name}
                        </p>
                        <span className="text-[10px] text-neutral-500 shrink-0">
                          {formatDate(e.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{e.email}</p>
                      <p className="text-xs text-neutral-700 line-clamp-2 mt-1">
                        {e.message}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24 h-fit">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-heading text-xl font-bold text-brand-green">
                    {selected.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="grid place-items-center h-8 w-8 rounded-md hover:bg-red-50 text-red-500 shrink-0"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 mb-5">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 text-sm text-neutral-700 hover:text-brand-orange"
                >
                  <Mail className="h-4 w-4" />
                  {selected.email}
                </a>
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-2 text-sm text-neutral-700 hover:text-brand-orange"
                >
                  <Phone className="h-4 w-4" />
                  {selected.phone}
                </a>
              </div>

              <div className="mb-5">
                <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold mb-2">
                  Message
                </p>
                <div className="p-4 rounded-xl bg-neutral-50 text-sm text-neutral-800 leading-relaxed whitespace-pre-line">
                  {selected.message}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold mb-2">
                  Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["new", "read", "responded"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      disabled={isPending}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        selected.status === s
                          ? "bg-brand-green text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`mailto:${selected.email}?subject=Re: Your enquiry to SEZHIYAM FOUNDATION`}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Reply via Email
              </a>
            </>
          ) : (
            <div className="text-center py-16 text-neutral-500 text-sm">
              <Mail className="h-10 w-10 mx-auto mb-3 text-neutral-300" />
              Select an enquiry to view details
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete enquiry?"
        message={`Permanently delete the enquiry from ${deleteTarget?.name}? This action cannot be undone.`}
        loading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}