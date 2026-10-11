// src/app/nalam/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, IndianRupee, ArrowLeft, PartyPopper } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { nalamDetail } from "@/lib/mock-data";
import { formatDate, formatINR } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const event = nalamDetail.find((n) => n.slug === slug);
  if (!event) return { title: "NALAM event not found" };
  return { title: event.title, description: event.description };
}

export default async function NalamDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = nalamDetail.find((n) => n.slug === slug);

  if (!event) notFound();

  return (
    <>
      <PageHero
        eyebrow={`NALAM · ${event.occasion}`}
        title={event.title}
        subtitle={event.description}
        breadcrumb="NALAM Event"
      />

      <section className="py-14 bg-brand-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/nalam"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all NALAM events
          </Link>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <PartyPopper className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Occasion</p>
              <p className="mt-1 font-bold text-brand-green">{event.occasion}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <Calendar className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Date</p>
              <p className="mt-1 font-bold text-brand-green">{formatDate(event.date)}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <MapPin className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Location</p>
              <p className="mt-1 font-bold text-brand-green text-sm">{event.location}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <Users className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">Beneficiaries</p>
              <p className="mt-1 font-bold text-brand-green">{event.beneficiaries.toLocaleString("en-IN")}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-brand-green">
              About this celebration
            </h2>
            <p className="mt-4 text-neutral-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Financials */}
          <div className="mt-8 bg-brand-orange text-white rounded-3xl p-8 md:p-10">
            <h2 className="font-heading text-2xl font-bold">Financial Summary</h2>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                <IndianRupee className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs uppercase tracking-wide text-white/80 font-semibold">Funds Received</p>
                <p className="mt-1 font-heading text-2xl font-bold">{formatINR(event.fundsReceived)}</p>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 border border-white/20">
                <IndianRupee className="h-5 w-5 text-white" />
                <p className="mt-3 text-xs uppercase tracking-wide text-white/80 font-semibold">Funds Used</p>
                <p className="mt-1 font-heading text-2xl font-bold">{formatINR(event.fundsUsed)}</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {event.gallery.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-brand-green mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery.map((src, i) => (
                  <div key={src + i} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                    <Image
                      src={src}
                      alt={`${event.title} — photo ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}