// src/app/projects/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight, Search } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { projectsDetail } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const STATUSES = ["All", "Completed", "Ongoing", "Upcoming"] as const;

export default function ProjectsPage() {
  const [status, setStatus] = useState<string>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return projectsDetail.filter((p) => {
      const matchesStatus = status === "All" || p.status === status;
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.location.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [status, query]);

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Our Projects"
        subtitle="Every project is a story of community, compassion, and change."
        breadcrumb="Projects"
      />

      <section className="py-14 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search projects…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-brand-cream-dark focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    status === s
                      ? "bg-brand-green text-white shadow"
                      : "bg-white text-neutral-700 border border-brand-cream-dark hover:bg-brand-green-soft"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-neutral-500">No projects match your search.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-brand-green text-white text-xs font-semibold shadow">
                        {p.category}
                      </span>
                      <span
                        className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold shadow ${
                          p.status === "Completed"
                            ? "bg-white/95 text-brand-green"
                            : p.status === "Ongoing"
                            ? "bg-brand-orange text-white"
                            : "bg-yellow-400 text-neutral-900"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="font-heading text-lg font-bold text-brand-green leading-snug">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-700 leading-relaxed flex-1 line-clamp-3">
                        {p.description}
                      </p>
                      <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-neutral-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-brand-orange" />
                          {formatDate(p.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                          {p.location.split(",")[0]}
                        </span>
                        <span className="inline-flex items-center gap-1.5 col-span-2">
                          <Users className="h-3.5 w-3.5 text-brand-orange" />
                          {p.beneficiaries.toLocaleString("en-IN")} reached
                        </span>
                      </div>
                      <Link
                        href={`/projects/${p.slug}`}
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