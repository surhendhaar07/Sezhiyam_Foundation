// src/components/home/WingsSection.tsx
import { BookOpen, HeartPulse, Users, Shield, LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface Wing {
  id: string;
  name: string;
  description: string;
  iconName: string | null;
  inChargeName: string | null;
  inChargeDesignation: string | null;
}

const iconMap: Record<string, LucideIcon> = {
  book: BookOpen,
  health: HeartPulse,
  users: Users,
  shield: Shield,
};

export default function WingsSection({ wings }: { wings: Wing[] }) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Divisions" title="Our Wings" subtitle="Specialized teams focused on different areas of community development." />
        {wings.length === 0 ? (
          <p className="text-center text-neutral-500 mt-12">Wings will appear here.</p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {wings.map((wing, i) => {
              const Icon = iconMap[wing.iconName ?? ""] ?? Shield;
              return (
                <Reveal key={wing.id} delay={i * 0.08}>
                  <div className="group h-full rounded-3xl bg-brand-cream border border-brand-cream-dark p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="grid place-items-center h-14 w-14 rounded-2xl bg-brand-orange text-white shadow group-hover:bg-brand-green transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-brand-green">{wing.name}</h3>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed flex-1">{wing.description}</p>
                    {(wing.inChargeName || wing.inChargeDesignation) && (
                      <div className="mt-5 pt-5 border-t border-brand-cream-dark">
                        {wing.inChargeDesignation && (
                          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">{wing.inChargeDesignation}</p>
                        )}
                        {wing.inChargeName && (
                          <p className="text-sm font-semibold text-brand-green mt-0.5">{wing.inChargeName}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}