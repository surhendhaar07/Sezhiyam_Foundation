// src/app/admin/settings/SettingsForm.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import AdminButton from "@/components/admin/ui/AdminButton";
import {
  InputField,
  TextAreaField,
  FormSection,
} from "@/components/admin/ui/FormField";
import { updateSiteSettings, SettingsInput } from "./actions";

interface Props {
  initialData: SettingsInput;
}

export default function SettingsForm({ initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [foundationName, setFoundationName] = useState(initialData.foundationName);
  const [tagline, setTagline] = useState(initialData.tagline ?? "");
  const [welcomeMessage, setWelcomeMessage] = useState(initialData.welcomeMessage ?? "");
  const [heroQuote, setHeroQuote] = useState(initialData.heroQuote ?? "");
  const [heroDescription, setHeroDescription] = useState(initialData.heroDescription ?? "");
  const [aboutContent, setAboutContent] = useState(initialData.aboutContent ?? "");
  const [visionText, setVisionText] = useState(initialData.visionText ?? "");
  const [missionText, setMissionText] = useState(initialData.missionText ?? "");
  const [valuesText, setValuesText] = useState(initialData.valuesText ?? "");
  const [logoUrl, setLogoUrl] = useState(initialData.logoUrl ?? "");
  const [phone, setPhone] = useState(initialData.phone ?? "");
  const [email, setEmail] = useState(initialData.email ?? "");
  const [address, setAddress] = useState(initialData.address ?? "");
  const [socialFacebook, setSocialFacebook] = useState(initialData.socialFacebook ?? "");
  const [socialInstagram, setSocialInstagram] = useState(initialData.socialInstagram ?? "");
  const [socialYoutube, setSocialYoutube] = useState(initialData.socialYoutube ?? "");
  const [socialTwitter, setSocialTwitter] = useState(initialData.socialTwitter ?? "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!foundationName.trim()) newErrors.foundationName = "Foundation name is required";
    if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors above.");
      return;
    }

    startTransition(async () => {
      try {
        await updateSiteSettings({
          foundationName: foundationName.trim(),
          tagline: tagline.trim(),
          welcomeMessage: welcomeMessage.trim(),
          heroQuote: heroQuote.trim(),
          heroDescription: heroDescription.trim(),
          aboutContent: aboutContent.trim(),
          visionText: visionText.trim(),
          missionText: missionText.trim(),
          valuesText: valuesText.trim(),
          logoUrl: logoUrl.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
          socialFacebook: socialFacebook.trim(),
          socialInstagram: socialInstagram.trim(),
          socialYoutube: socialYoutube.trim(),
          socialTwitter: socialTwitter.trim(),
        });

        toast.success("Settings saved");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Something went wrong");
      }
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Brand */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Brand Identity">
          <InputField
            label="Foundation Name"
            name="foundationName"
            value={foundationName}
            onChange={setFoundationName}
            required
            error={errors.foundationName}
          />
          <InputField
            label="Tagline"
            name="tagline"
            value={tagline}
            onChange={setTagline}
            hint="Short phrase shown with the logo."
          />
          <InputField
            label="Logo URL"
            name="logoUrl"
            type="url"
            value={logoUrl}
            onChange={setLogoUrl}
            hint="Paste a hosted image URL. File upload arrives later."
          />
          {logoUrl && (
            <div className="rounded-xl bg-neutral-100 p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo preview" className="h-16 w-auto object-contain" />
            </div>
          )}
        </FormSection>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Hero Section (Home Page)">
          <InputField
            label="Welcome Message"
            name="welcomeMessage"
            value={welcomeMessage}
            onChange={setWelcomeMessage}
            placeholder="Welcome to SEZHIYAM FOUNDATION"
          />
          <TextAreaField
            label="Hero Quote"
            name="heroQuote"
            value={heroQuote}
            onChange={setHeroQuote}
            rows={2}
            hint="Displayed as an inspiring quote in the hero section."
          />
          <TextAreaField
            label="Hero Description"
            name="heroDescription"
            value={heroDescription}
            onChange={setHeroDescription}
            rows={3}
            hint="Short paragraph below the quote."
          />
        </FormSection>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="About & Values">
          <TextAreaField
            label="About Content"
            name="aboutContent"
            value={aboutContent}
            onChange={setAboutContent}
            rows={5}
            hint="Shown on the About page and about preview section."
          />
          <TextAreaField
            label="Vision"
            name="visionText"
            value={visionText}
            onChange={setVisionText}
            rows={3}
          />
          <TextAreaField
            label="Mission"
            name="missionText"
            value={missionText}
            onChange={setMissionText}
            rows={3}
          />
          <TextAreaField
            label="Core Values"
            name="valuesText"
            value={valuesText}
            onChange={setValuesText}
            rows={3}
          />
        </FormSection>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Contact Information">
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="+91 90000 00000"
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            error={errors.email}
            placeholder="info@sezhiyam.org"
          />
          <TextAreaField
            label="Office Address"
            name="address"
            value={address}
            onChange={setAddress}
            rows={2}
            placeholder="Tamil Nadu, India"
          />
        </FormSection>
      </div>

      {/* Social */}
      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-5">
        <FormSection title="Social Media Links">
          <InputField
            label="Facebook"
            name="socialFacebook"
            type="url"
            value={socialFacebook}
            onChange={setSocialFacebook}
            placeholder="https://facebook.com/…"
          />
          <InputField
            label="Instagram"
            name="socialInstagram"
            type="url"
            value={socialInstagram}
            onChange={setSocialInstagram}
            placeholder="https://instagram.com/…"
          />
          <InputField
            label="YouTube"
            name="socialYoutube"
            type="url"
            value={socialYoutube}
            onChange={setSocialYoutube}
            placeholder="https://youtube.com/…"
          />
          <InputField
            label="Twitter / X"
            name="socialTwitter"
            type="url"
            value={socialTwitter}
            onChange={setSocialTwitter}
            placeholder="https://twitter.com/…"
          />
        </FormSection>
      </div>

      <div className="sticky bottom-4 bg-white/95 backdrop-blur rounded-2xl shadow-lg p-4 flex justify-end gap-3 border border-neutral-100">
        <AdminButton variant="primary" onClick={handleSubmit} loading={isPending}>
          Save Settings
        </AdminButton>
      </div>
    </div>
  );
}