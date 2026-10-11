// src/app/admin/team/MemberForm.tsx
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
import { createTeamMember, updateTeamMember, TeamMemberInput } from "./actions";

interface Props {
  initialData?: TeamMemberInput & { id: string };
}

export default function MemberForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name ?? "");
  const [designation, setDesignation] = useState(initialData?.designation ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl ?? "");
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    setErrors({});

    // Client-side pre-validation
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!designation.trim()) newErrors.designation = "Designation is required";
    if (photoUrl && !photoUrl.startsWith("http")) {
      newErrors.photoUrl = "Photo URL must start with http:// or https://";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        const payload: TeamMemberInput = {
          name: name.trim(),
          designation: designation.trim(),
          bio: bio.trim(),
          photoUrl: photoUrl.trim(),
          order: Number(order),
          published,
        };

        if (initialData?.id) {
          await updateTeamMember(initialData.id, payload);
          toast.success("Team member updated");
        } else {
          await createTeamMember(payload);
          toast.success("Team member created");
        }
        router.push("/admin/team");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6 max-w-2xl">
      <FormSection title="Basic Information">
        <InputField
          label="Name"
          name="name"
          value={name}
          onChange={setName}
          required
          error={errors.name}
          placeholder="Dr. Rajesh Kumar"
        />
        <InputField
          label="Designation"
          name="designation"
          value={designation}
          onChange={setDesignation}
          required
          error={errors.designation}
          placeholder="Founder & Chairman"
        />
        <TextAreaField
          label="Short Bio"
          name="bio"
          value={bio}
          onChange={setBio}
          rows={3}
          placeholder="A short introduction…"
          hint="Optional. Max 600 characters."
        />
      </FormSection>

      <FormSection title="Photo & Display">
        <InputField
          label="Photo URL"
          name="photoUrl"
          value={photoUrl}
          onChange={setPhotoUrl}
          type="url"
          error={errors.photoUrl}
          placeholder="https://…"
          hint="Paste an image URL. File upload will be available in a later stage."
        />
        {photoUrl && (
          <div className="rounded-xl overflow-hidden bg-neutral-100 h-40 w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.opacity = "0.3";
              }}
            />
          </div>
        )}

        <InputField
          label="Display Order"
          name="order"
          value={order}
          onChange={(v) => setOrder(Number(v) || 0)}
          type="number"
          hint="Lower numbers appear first."
        />

        <ToggleField
          label="Published"
          name="published"
          checked={published}
          onChange={setPublished}
          hint="Hidden members won't appear on the public site."
        />
      </FormSection>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/team")}
          disabled={isPending}
        >
          Cancel
        </AdminButton>
        <AdminButton
          variant="primary"
          onClick={handleSubmit}
          loading={isPending}
        >
          {initialData ? "Save Changes" : "Create Team Member"}
        </AdminButton>
      </div>
    </div>
  );
}