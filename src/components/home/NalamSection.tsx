// src/components/home/NalamSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, PartyPopper, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { formatDate } from "@/lib/utils";

interface NalamEvent {
  id: string;
  slug: string;
  title: string;
  occasion: string;
  description: string;
  coverImage: string | null;
  date: Date;
  location: string;
  beneficiaries: number;
}

export default function NalamSection({ events }: { events: NalamEvent[] }) {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-brand-orange-soft to-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Special Category" title="NALAM — Festival & Community Service" subtitle="Celebrating festivals with those who need it most — Pongal, Diwali, Labour Day, New Year, and more." />
        {events.length === 0 ? (
          <p className="text-center text-neutral-500 mt-12">NALAM events will appear here.</p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.1}>
                <article className="group h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                    {event.coverImage && (
                      <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-orange text-white text-xs font-semibold shadow">
                      <PartyPopper className="h-3.5 w-3.5" />{event.occasion}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-brand-green">{event.title}</h3>
                    <p className="mt-2 text-neutral-700 text-sm leading-relaxed">{event.description}</p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-600">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand-orange" />{formatDate(event.date.toISOString())}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-orange" />{event.location}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-brand-orange" />{event.beneficiaries.toLocaleString("en-IN")} reached</span>
                    </div>
                    <Link href={`/nalam/${event.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark">
                      View More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal delay={0.3} className="mt-12 text-center">
          <Link href="/nalam" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-orange text-white text-sm md:text-base font-semibold hover:bg-brand-orange-dark transition-colors shadow-lg">
            View All NALAM Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}