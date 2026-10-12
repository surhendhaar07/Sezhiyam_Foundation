// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import { prisma } from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "SEZHIYAM FOUNDATION", template: "%s | SEZHIYAM FOUNDATION" },
  description:
    "SEZHIYAM FOUNDATION — Serving humanity through community development across Tamil Nadu.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  let settings = null;
  try {
    settings = await prisma.siteSetting.findUnique({ where: { id: "main" } });
  } catch (error) {
    console.warn("Could not load site settings from database, falling back to defaults.", error);
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Header
            foundationName={settings?.foundationName ?? "SEZHIYAM FOUNDATION"}
            logoUrl={settings?.logoUrl ?? null}
          />
          <main className="flex-1">{children}</main>
          <Footer
            foundationName={settings?.foundationName ?? "SEZHIYAM FOUNDATION"}
            logoUrl={settings?.logoUrl ?? null}
            description={settings?.heroDescription ?? ""}
            phone={settings?.phone ?? ""}
            email={settings?.email ?? ""}
            address={settings?.address ?? ""}
            socialFacebook={settings?.socialFacebook ?? null}
            socialInstagram={settings?.socialInstagram ?? null}
            socialYoutube={settings?.socialYoutube ?? null}
            socialTwitter={settings?.socialTwitter ?? null}
          />
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}