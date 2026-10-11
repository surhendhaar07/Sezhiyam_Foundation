// src/app/admin/locations/LocationForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  InputField,
  TextAreaField,
  ToggleField,
  FormSection,
} from "@/components/admin/ui/FormField";
import { createLocation, updateLocation, LocationInput } from "./actions";

const LocationMapPicker = dynamic(() => import("./LocationMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl bg-neutral-100 animate-pulse grid place-items-center text-neutral-500" style={{ height: "380px" }}>
      Loading map…
    </div>
  ),
});

interface Props {
  initialData?: LocationInput & { id: string };
}

const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi",
  "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
  "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur",
  "Vellore", "Viluppuram", "Virudhunagar",
];

export default function LocationForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(initialData?.name ?? "");
  const [district, setDistrict] = useState(initialData?.district ?? "Chennai");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [latitude, setLatitude] = useState<number>(initialData?.latitude ?? 10.9);
  const [longitude, setLongitude] = useState<number>(initialData?.longitude ?? 78.5);
  const [active, setActive] = useState(initialData?.active ?? true);
  const [published, setPublished] = useState(initialData?.published ?? true);
  const [order, setOrder] = useState<number>(initialData?.order ?? 0);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleMapChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!district.trim()) newErrors.district = "District is required";
    if (latitude < 8 || latitude > 14) {
      newErrors.latitude = "Latitude must be within Tamil Nadu (8 to 14)";
    }
    if (longitude < 76 || longitude > 81) {
      newErrors.longitude = "Longitude must be within Tamil Nadu (76 to 81)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        const payload: LocationInput = {
          name: name.trim(),
          district: district.trim(),
          description: description.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          active,
          published,
          order: Number(order) || 0,
        };

        if (initialData?.id) {
          await updateLocation(initialData.id, payload);
          toast.success("Location updated");
        } else {
          await createLocation(payload);
          toast.success("Location created");
        }
        router.push("/admin/locations");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Location Details">
          <InputField
            label="Location Name"
            name="name"
            value={name}
            onChange={setName}
            required
            error={errors.name}
            placeholder="Madurai"
          />
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
              District <span className="text-red-500">*</span>
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.district ? "border-red-400" : "border-neutral-200"
              } focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white text-sm`}
            >
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && (
              <p className="mt-1 text-xs text-red-600">{errors.district}</p>
            )}
          </div>
          <TextAreaField
            label="Short Description"
            name="description"
            value={description}
            onChange={setDescription}
            rows={2}
            placeholder="HQ & primary operations"
            hint="Optional. Shown when visitors click the map pin."
          />
          <InputField
            label="Display Order"
            name="order"
            type="number"
            value={order}
            onChange={(v) => setOrder(Number(v) || 0)}
            hint="Lower numbers appear first in the list."
          />
        </FormSection>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Location on Map">
          <p className="text-sm text-neutral-600">
            Click on the map to place the pin, or drag the marker to fine-tune.
          </p>

          <LocationMapPicker
            latitude={latitude}
            longitude={longitude}
            onChange={handleMapChange}
          />

          <div className="grid md:grid-cols-2 gap-5">
            <InputField
              label="Latitude"
              name="latitude"
              type="number"
              value={latitude}
              onChange={(v) => setLatitude(Number(v) || 0)}
              error={errors.latitude}
              hint="Tamil Nadu range: 8 to 14"
            />
            <InputField
              label="Longitude"
              name="longitude"
              type="number"
              value={longitude}
              onChange={(v) => setLongitude(Number(v) || 0)}
              error={errors.longitude}
              hint="Tamil Nadu range: 76 to 81"
            />
          </div>
        </FormSection>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Visibility">
          <ToggleField
            label="Currently active"
            name="active"
            checked={active}
            onChange={setActive}
            hint="Uncheck if operations have paused at this location."
          />
          <ToggleField
            label="Published"
            name="published"
            checked={published}
            onChange={setPublished}
            hint="Hidden locations won't appear on the public map."
          />
        </FormSection>
      </div>

      <div className="flex justify-end gap-3">
        <AdminButton
          variant="ghost"
          onClick={() => router.push("/admin/locations")}
          disabled={isPending}
        >
          Cancel
        </AdminButton>
        <AdminButton variant="primary" onClick={handleSubmit} loading={isPending}>
          {initialData ? "Save Changes" : "Create Location"}
        </AdminButton>
      </div>
    </div>
  );
}