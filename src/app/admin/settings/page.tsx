// src/app/admin/settings/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import SettingsForm from "./SettingsForm";

export const metadata = { title: "Site Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const settings = await prisma.siteSetting.findUnique({ where: { id: "main" } });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Site Settings"
      description="Configure foundation name, tagline, contact details, and social links."
    >
      <SettingsForm
        initialData={{
          foundationName: settings?.foundationName ?? "SEZHIYAM FOUNDATION",
          tagline: settings?.tagline ?? "",
          welcomeMessage: settings?.welcomeMessage ?? "",
          heroQuote: settings?.heroQuote ?? "",
          heroDescription: settings?.heroDescription ?? "",
          aboutContent: settings?.aboutContent ?? "",
          visionText: settings?.visionText ?? "",
          missionText: settings?.missionText ?? "",
          valuesText: settings?.valuesText ?? "",
          logoUrl: settings?.logoUrl ?? "",
          phone: settings?.phone ?? "",
          email: settings?.email ?? "",
          address: settings?.address ?? "",
          socialFacebook: settings?.socialFacebook ?? "",
          socialInstagram: settings?.socialInstagram ?? "",
          socialYoutube: settings?.socialYoutube ?? "",
          socialTwitter: settings?.socialTwitter ?? "",
        }}
      />
    </AdminLayout>
  );
}