// src/app/nalam/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, PartyPopper } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { nalamDetail } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function NalamPage() {
  const occasions = useMemo(
    () => ["All", ...Array.from(new Set(nalamDetail.map((n) => n.occasion)))],
    []
  );
  const years = useMemo(
    () => ["All", ...Array.from(new Set(nalamDetail.map((n) => String(n.year)))).sort().reverse()],
    []
  );

  const [occasion, setOccasion] = useState("All");
  const [year, setYear] = useState("All");

  const filtered = useMemo(() => {
    return nalamDetail.filter((n) => {
      const matchesOccasion = occasion === "All" || n.occasion === occasion;
      const matchesYear = year === "All" || String(n.year) === year;
      return matchesOccasion && matchesYear;
    });
  }, [occasion, year]);

  return (
    <>
      <PageHero
        eyebrow="Special Category"
        title="NALAM"
        subtitle="Festival & community service activities — celebrating with those who need it most."
        breadcrumb="NALAM"
      />

      <section className="py-14 bg-gradient-to-b from-brand-orange-soft to-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-neutral-600 mb-2">
                Occasion
              </p>
              <div className="flex flex-wrap gap-2">
                {occasions.map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      occasion === o
                        ? "bg-brand-orange text-white shadow"
                        : "bg-white text-neutral-700 border border-brand-cream-dark hover:bg-brand-orange-soft"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-neutral-600 mb-2">
                Year
              </p>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      year === y
                        ? "bg-brand-green text-white shadow"
                        : "bg-white text-neutral-700 border border-brand-cream-dark hover:bg-brand-green-soft"
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-500">No NALAM events match your filters.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((n, i) => (
                <Reveal key={n.slug} delay={i * 0.05}>
                  <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={n.image}
                        alt={n.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold shadow">
                        <PartyPopper className="h-3.5 w-3.5" />
                        {n.occasion}
                      </span>
                      <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/95 text-brand-green text-xs font-semibold">
                        {n.year}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-lg font-bold text-brand-green leading-snug">
                        {n.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-700 leading-relaxed flex-1 line-clamp-3">
                        {n.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-orange" />
                          {formatDate(n.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                          {n.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-brand-orange" />
                          {n.beneficiaries.toLocaleString("en-IN")} reached
                        </span>
                      </div>
                      <Link
                        href={`/nalam/${n.slug}`}
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark"
                      >
                        View More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}