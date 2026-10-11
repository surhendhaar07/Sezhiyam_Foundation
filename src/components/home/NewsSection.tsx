// src/components/home/NewsSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Megaphone } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { formatDate } from "@/lib/utils";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  publishedAt: Date;
  eventDate: Date | null;
  location: string | null;
  isEvent: boolean;
}

export default function NewsSection({ items }: { items: NewsItem[] }) {
  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Stay Updated" title="News & Upcoming Events" subtitle="The latest from our field work and what's coming next." />
        {items.length === 0 ? (
          <p className="text-center text-neutral-500 mt-12">No news yet.</p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.1}>
                <article className="group h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    {item.imageUrl && (
                      <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    {item.isEvent && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold shadow">
                        <Megaphone className="h-3.5 w-3.5" /> Upcoming Event
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />{formatDate(item.publishedAt.toISOString())}
                      </span>
                      {item.isEvent && item.eventDate && (
                        <span className="inline-flex items-center gap-1 text-brand-orange font-semibold">
                          <Calendar className="h-3.5 w-3.5" />Event: {formatDate(item.eventDate.toISOString())}
                        </span>
                      )}
                      {item.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />{item.location}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-heading text-lg font-bold text-brand-green leading-snug">{item.title}</h3>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{item.description}</p>
                    <Link href="/news" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark">
                      Read More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}