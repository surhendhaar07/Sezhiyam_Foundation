// src/components/admin/ui/DataTable.tsx
"use client";

import { ReactNode, useMemo, useState } from "react";
import { Search } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKeys = [],
  emptyMessage = "No records yet.",
  onRowClick,
}: Props<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim() || searchKeys.length === 0) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const v = (row as any)[key];
        return v && String(v).toLowerCase().includes(q);
      })
    );
  }, [query, data, searchKeys]);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {searchKeys.length > 0 && (
        <div className="p-4 border-b border-neutral-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-neutral-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={`text-left text-xs uppercase tracking-wide text-neutral-500 font-semibold px-4 py-3 ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-neutral-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-4 py-3 text-sm text-neutral-800 align-middle ${col.className ?? ""}`}
                    >
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="px-4 py-3 border-t border-neutral-100 text-xs text-neutral-500">
        {filtered.length} of {data.length} {data.length === 1 ? "entry" : "entries"}
      </div>
    </div>
  );
}