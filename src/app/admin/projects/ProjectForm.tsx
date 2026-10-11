// src/app/admin/projects/ProjectForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X, GripVertical } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  InputField,
  TextAreaField,
  SelectField,
  ToggleField,
  FormSection,
} from "@/components/admin/ui/FormField";
import { createProject, updateProject, ProjectInput } from "./actions";

interface GalleryItem {
  url: string;
  caption: string;
}

interface Props {
  initialData?: ProjectInput & { id: string };
}

const STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
];

const CATEGORY_OPTIONS = [
  { value: "Health", label: "Health" },
  { value: "Education", label: "Education" },
  { value: "Women Empowerment", label: "Women Empowerment" },
  { value: "Disaster Relief", label: "Disaster Relief" },
  { value: "Community Development", label: "Community Development" },
  { value: "General", label: "General" },
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProjectForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [longDescription, setLongDescription] = useState(initialData?.longDescription ?? "");
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "");
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [duration, setDuration] = useState(initialData?.duration ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [beneficiaries, setBeneficiaries] = useState<number>(initialData?.beneficiaries ?? 0);
  const [fundsReceived, setFundsReceived] = useState<number>(initialData?.fundsReceived ?? 0);
  const [fundsUsed, setFundsUsed] = useState<number>(initialData?.fundsUsed ?? 0);
  const [category, setCategory] = useState(initialData?.category ?? "General");
  const [status, setStatus] = useState<string>(initialData?.status ?? "Completed");
  const [showFinancials, setShowFinancials] = useState(initialData?.showFinancials ?? true);
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [gallery, setGallery] = useState<GalleryItem[]>(
    (initialData?.gallery as GalleryItem[]) ?? []
  );

  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageCaption, setNewImageCaption] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addGalleryImage = () => {
    if (!newImageUrl.trim() || !newImageUrl.startsWith("http")) {
      toast.error("Enter a valid image URL starting with http(s)://");
      return;
    }
    setGallery([...gallery, { url: newImageUrl.trim(), caption: newImageCaption.trim() }]);
    setNewImageUrl("");
    setNewImageCaption("");
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Short description is required";
    if (!location.trim()) newErrors.location = "Location is required";

    const finalSlug = (slug || slugify(title)).trim();
    if (finalSlug && !/^[a-z0-9-]+$/.test(finalSlug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        const payload: ProjectInput = {
          slug: finalSlug,
          title: title.trim(),
          description: description.trim(),
          longDescription: longDescription.trim(),
          coverImage: coverImage.trim(),
          date: new Date(date).toISOString(),
          duration: duration.trim(),
          location: location.trim(),
          beneficiaries: Number(beneficiaries) || 0,
          fundsReceived: Number(fundsReceived) || 0,
          fundsUsed: Number(fundsUsed) || 0,
          category,
          status: status as "Upcoming" | "Ongoing" | "Completed",
          showFinancials,
          published,
          isFeatured,
          gallery,
        };

        if (initialData?.id) {
          await updateProject(initialData.id, payload);
          toast.success("Project updated");
        } else {
          await createProject(payload);
          toast.success("Project created");
        }
        router.push("/admin/projects");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Basic info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Basic Information">
          <InputField
            label="Title"
            name="title"
            value={title}
            onChange={(v) => {
              setTitle(v);
              if (!initialData && !slug) setSlug(slugify(v));
            }}
            required
            error={errors.title}
            placeholder="Free Medical Camp at Madurai Village"
          />
          <InputField
            label="Slug (URL)"
            name="slug"
            value={slug}
            onChange={setSlug}
            error={errors.slug}
            hint="Used in the URL: /projects/your-slug"
            required
          />
          <TextAreaField
            label="Short Description"
            name="description"
            value={description}
            onChange={setDescription}
            rows={2}
            required
            error={errors.description}
            hint="Max 500 characters. Shown on cards."
          />
          <TextAreaField
            label="Full Description"
            name="longDescription"
            value={longDescription}
            onChange={setLongDescription}
            rows={6}
            hint="Optional. Shown on the detail page."
          />
        </FormSection>
      </div>

      {/* Cover & Gallery */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Images">
          <InputField
            label="Cover Image URL"
            name="coverImage"
            value={coverImage}
            onChange={setCoverImage}
            type="url"
            placeholder="https://…"
          />
          {coverImage && (
            <div className="rounded-xl overflow-hidden bg-neutral-100 h-48 w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}

          <div className="pt-4 border-t border-neutral-100">
            <p className="text-sm font-semibold text-neutral-700 mb-3">
              Gallery Images ({gallery.length})
            </p>

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {gallery.map((img, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden bg-neutral-100 aspect-video group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.caption || `Image ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 grid place-items-center h-7 w-7 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {img.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] px-2 py-1 truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <InputField
                label="Image URL"
                name="newImageUrl"
                value={newImageUrl}
                onChange={setNewImageUrl}
                type="url"
                placeholder="https://…"
              />
              <InputField
                label="Caption (optional)"
                name="newImageCaption"
                value={newImageCaption}
                onChange={setNewImageCaption}
                placeholder="Short caption"
              />
              <AdminButton variant="secondary" onClick={addGalleryImage} size="sm" icon={<Plus className="h-4 w-4" />}>
                Add to Gallery
              </AdminButton>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Event Details">
          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              label="Event Date"
              name="date"
              type="text"
              value={date}
              onChange={setDate}
              required
              hint="Format: YYYY-MM-DD"
            />
            <InputField
              label="Duration"
              name="duration"
              value={duration}
              onChange={setDuration}
              placeholder="3 days / 6 months / Ongoing"
            />
          </div>
          <InputField
            label="Location"
            name="location"
            value={location}
            onChange={setLocation}
            required
            error={errors.location}
            placeholder="Madurai, Tamil Nadu"
          />
          <div className="grid md:grid-cols-2 gap-5">
            <SelectField
              label="Category"
              name="category"
              value={category}
              onChange={setCategory}
              options={CATEGORY_OPTIONS}
            />
            <SelectField
              label="Status"
              name="status"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
          </div>
        </FormSection>
      </div>

      {/* Impact */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Impact & Financials">
          <InputField
            label="Beneficiaries Reached"
            name="beneficiaries"
            type="number"
            value={beneficiaries}
            onChange={(v) => setBeneficiaries(Number(v) || 0)}
          />
          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              label="Funds Received (₹)"
              name="fundsReceived"
              type="number"
              value={fundsReceived}
              onChange={(v) => setFundsReceived(Number(v) || 0)}
            />
            <InputField
              label="Funds Used (₹)"
              name="fundsUsed"
              type="number"
              value={fundsUsed}
              onChange={(v) => setFundsUsed(Number(v) || 0)}
            />
          </div>
          <ToggleField
            label="Show financials publicly"
            name="showFinancials"
            checked={showFinancials}
            onChange={setShowFinancials}
            hint="If off, ₹ figures won't appear on the public detail page."
          />
        </FormSection>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Visibility">
          <ToggleField
            label="Published"
            name="published"
            checked={published}
            onChange={setPublished}
            hint="Unpublished projects won't appear on the public site."
          />
          <ToggleField
            label="Featured on homepage"
            name="isFeatured"
            checked={isFeatured}
            onChange={setIsFeatured}
            hint="Featured projects can be prioritized on the homepage."
          />
        </FormSection>
      </div>

      <div className="flex justify-end gap-3">
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/projects")}
          disabled={isPending}
        >
          Cancel
        </AdminButton>
        <AdminButton variant="primary" onClick={handleSubmit} loading={isPending}>
          {initialData ? "Save Changes" : "Create Project"}
        </AdminButton>
      </div>
    </div>
  );
}