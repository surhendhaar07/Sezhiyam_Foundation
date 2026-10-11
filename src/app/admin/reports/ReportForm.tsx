// src/app/admin/reports/ReportForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, FileText, X } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  InputField,
  TextAreaField,
  FormSection,
} from "@/components/admin/ui/FormField";
import { uploadReport, updateReportMeta, ReportMetaInput } from "./actions";

interface Project {
  id: string;
  title: string;
}
interface Nalam {
  id: string;
  title: string;
}

interface Props {
  projects: Project[];
  nalams: Nalam[];
  initialData?: ReportMetaInput & { id: string; fileName?: string };
  mode: "create" | "edit";
}

export default function ReportForm({ projects, nalams, initialData, mode }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [projectId, setProjectId] = useState(initialData?.projectId ?? "");
  const [nalamId, setNalamId] = useState(initialData?.nalamId ?? "");
  const [eventDate, setEventDate] = useState(
    initialData?.eventDate
      ? new Date(initialData.eventDate).toISOString().slice(0, 10)
      : ""
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [internalNotes, setInternalNotes] = useState(initialData?.internalNotes ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (mode === "create" && !file) newErrors.file = "PDF file is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        if (mode === "create") {
          const fd = new FormData();
          fd.append("file", file as File);
          fd.append("title", title.trim());
          fd.append("description", description.trim());
          fd.append("projectId", projectId);
          fd.append("nalamId", nalamId);
          fd.append("eventDate", eventDate);
          fd.append("location", location.trim());
          fd.append("internalNotes", internalNotes.trim());

          await uploadReport(fd);
          toast.success("Report uploaded");
        } else {
          await updateReportMeta(initialData!.id, {
            title: title.trim(),
            description: description.trim(),
            projectId,
            nalamId,
            eventDate,
            location: location.trim(),
            internalNotes: internalNotes.trim(),
          });
          toast.success("Report updated");
        }
        router.push("/admin/reports");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Report Details">
          <InputField
            label="Report Title"
            name="title"
            value={title}
            onChange={setTitle}
            required
            error={errors.title}
            placeholder="Q3 Health Camp — Internal Summary"
          />
          <TextAreaField
            label="Short Description"
            name="description"
            value={description}
            onChange={setDescription}
            rows={2}
            hint="Shown in the admin list only."
          />
        </FormSection>
      </div>

      {/* File upload — only on create */}
      {mode === "create" && (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
          <FormSection title="PDF File">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Upload PDF <span className="text-red-500">*</span>
              </label>

              {file ? (
                <div className="flex items-center gap-3 p-4 rounded-lg border border-brand-green-soft bg-brand-green-soft/30">
                  <FileText className="h-5 w-5 text-brand-green shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="grid place-items-center h-8 w-8 rounded-full hover:bg-white text-neutral-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 p-8 rounded-lg border-2 border-dashed border-neutral-300 hover:border-brand-orange cursor-pointer transition-colors">
                  <Upload className="h-8 w-8 text-neutral-400" />
                  <span className="text-sm text-neutral-600 font-medium">
                    Click to select a PDF file
                  </span>
                  <span className="text-xs text-neutral-400">
                    Max 15 MB · PDF only
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setFile(f);
                    }}
                    className="hidden"
                  />
                </label>
              )}
              {errors.file && (
                <p className="mt-1 text-xs text-red-600">{errors.file}</p>
              )}
            </div>
          </FormSection>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Association & Metadata">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Linked Project (optional)
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white text-sm"
              >
                <option value="">— None —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                Linked NALAM Event (optional)
              </label>
              <select
                value={nalamId}
                onChange={(e) => setNalamId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white text-sm"
              >
                <option value="">— None —</option>
                {nalams.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InputField
            label="Event Date"
            name="eventDate"
            type="text"
            value={eventDate}
            onChange={setEventDate}
            hint="Format: YYYY-MM-DD"
          />
          <InputField
            label="Location"
            name="location"
            value={location}
            onChange={setLocation}
            placeholder="Madurai District"
          />
          <TextAreaField
            label="Internal Notes"
            name="internalNotes"
            value={internalNotes}
            onChange={setInternalNotes}
            rows={3}
            hint="Only visible to administrators."
          />
        </FormSection>
      </div>

      <div className="flex justify-end gap-3">
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/reports")}
          disabled={isPending}
        >
          Cancel
        </AdminButton>
        <AdminButton variant="primary" onClick={handleSubmit} loading={isPending}>
          {mode === "create" ? "Upload Report" : "Save Changes"}
        </AdminButton>
      </div>
    </div>
  );
}