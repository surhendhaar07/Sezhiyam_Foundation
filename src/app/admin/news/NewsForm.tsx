// src/app/admin/news/NewsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  InputField,
  TextAreaField,
  ToggleField,
  FormSection,
} from "@/components/admin/ui/FormField";
import { createNews, updateNews, NewsInput } from "./actions";

interface Props {
  initialData?: NewsInput & { id: string };
}

export default function NewsForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [eventDate, setEventDate] = useState(
    initialData?.eventDate
      ? new Date(initialData.eventDate).toISOString().slice(0, 10)
      : ""
  );
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [isEvent, setIsEvent] = useState(initialData?.isEvent ?? false);
  const [isImportant, setIsImportant] = useState(initialData?.isImportant ?? false);
  const [published, setPublished] = useState(initialData?.published ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (isEvent && !eventDate) {
      newErrors.eventDate = "Event date is required when this is an event";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        const payload: NewsInput = {
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          publishedAt: new Date(publishedAt).toISOString(),
          eventDate: eventDate ? new Date(eventDate).toISOString() : "",
          location: location.trim(),
          isEvent,
          isImportant,
          published,
        };

        if (initialData?.id) {
          await updateNews(initialData.id, payload);
          toast.success("News post updated");
        } else {
          await createNews(payload);
          toast.success("News post created");
        }
        router.push("/admin/news");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Content">
          <InputField
            label="Title"
            name="title"
            value={title}
            onChange={setTitle}
            required
            error={errors.title}
            placeholder="Annual Health Camp in Madurai District"
          />
          <TextAreaField
            label="Description"
            name="description"
            value={description}
            onChange={setDescription}
            rows={3}
            required
            error={errors.description}
            hint="Max 500 characters. Shown on cards."
          />
          <InputField
            label="Image URL"
            name="imageUrl"
            value={imageUrl}
            onChange={setImageUrl}
            type="url"
            placeholder="https://…"
          />
          {imageUrl && (
            <div className="rounded-xl overflow-hidden bg-neutral-100 h-44 w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </FormSection>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Dates & Location">
          <InputField
            label="Publish Date"
            name="publishedAt"
            value={publishedAt}
            onChange={setPublishedAt}
            required
            hint="Format: YYYY-MM-DD"
          />
          <ToggleField
            label="This is an upcoming event"
            name="isEvent"
            checked={isEvent}
            onChange={(v) => {
              setIsEvent(v);
              if (!v) setEventDate("");
            }}
            hint="Events show a special badge and are grouped separately."
          />
          {isEvent && (
            <>
              <InputField
                label="Event Date"
                name="eventDate"
                value={eventDate}
                onChange={setEventDate}
                required
                error={errors.eventDate}
                hint="Format: YYYY-MM-DD"
              />
              <InputField
                label="Event Location"
                name="location"
                value={location}
                onChange={setLocation}
                placeholder="Madurai, Tamil Nadu"
              />
            </>
          )}
        </FormSection>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Visibility & Priority">
          <ToggleField
            label="Mark as important"
            name="isImportant"
            checked={isImportant}
            onChange={setIsImportant}
            hint="Important posts get a red badge and appear first."
          />
          <ToggleField
            label="Published"
            name="published"
            checked={published}
            onChange={setPublished}
            hint="Unpublished posts won't appear on the public site."
          />
        </FormSection>
      </div>

      <div className="flex justify-end gap-3">
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/news")}
          disabled={isPending}
        >
          Cancel
        </AdminButton>
        <AdminButton variant="primary" onClick={handleSubmit} loading={isPending}>
          {initialData ? "Save Changes" : "Create News Post"}
        </AdminButton>
      </div>
    </div>
  );
}