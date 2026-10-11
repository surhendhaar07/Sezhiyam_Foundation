// src/components/home/WhereWeWork.tsx
import { MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TamilNaduMapWrapper from "./TamilNaduMapWrapper";

interface Location {
  id: string;
  name: string;
  district: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export default function WhereWeWork({ locations }: { locations: Location[] }) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Footprint" title="Where We Work — Tamil Nadu" subtitle="Click any pin to see our activities in that location." />
        <div className="mt-14 grid lg:grid-cols-5 gap-8 items-start">
          <Reveal className="lg:col-span-3">
            <TamilNaduMapWrapper locations={locations} />
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-2">
            <div className="rounded-3xl bg-brand-cream border border-brand-cream-dark p-6 md:p-8">
              <h3 className="font-heading text-xl font-bold text-brand-green flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-orange" /> Working Locations
              </h3>
              {locations.length === 0 ? (
                <p className="mt-5 text-sm text-neutral-500">Locations will appear here.</p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {locations.map((loc) => (
                    <li key={loc.id} className="flex items-start gap-3 pb-4 border-b border-brand-cream-dark last:border-0 last:pb-0">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-brand-orange shrink-0" />
                      <div>
                        <p className="font-semibold text-brand-green">{loc.name}</p>
                        <p className="text-xs uppercase tracking-wide text-neutral-500 font-semibold">{loc.district} District</p>
                        {loc.description && <p className="mt-1 text-sm text-neutral-700">{loc.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}