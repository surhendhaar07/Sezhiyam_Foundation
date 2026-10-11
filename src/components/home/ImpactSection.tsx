// src/components/home/ImpactSection.tsx
import { ShieldCheck } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

interface Stat {
  id: string;
  label: string;
  value: number;
  prefix: string | null;
  suffix: string | null;
  isYear: boolean;
}

interface Governance {
  heading: string;
  description: string;
  points: string; // pipe-separated
}

export default function ImpactSection({ stats, governance }: { stats: Stat[]; governance: Governance | null }) {
  const govPoints = governance?.points ? governance.points.split("|").filter(Boolean) : [];

  return (
    <section className="relative py-20 md:py-28 bg-brand-green text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-orange/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Impact" title="Ground Impacts & Milestones"
          subtitle={<span className="text-white/85">Numbers that reflect years of community service. <em className="text-brand-orange not-italic font-semibold">(Placeholder values — admin will update.)</em></span>} />

        {stats.length > 0 && (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat, i) => (
              <Reveal key={stat.id} delay={i * 0.08}>
                <div className="rounded-3xl bg-white/5 backdrop-blur border border-white/15 p-6 text-center hover:bg-white/10 transition-colors">
                  <p className="font-heading text-4xl md:text-5xl font-extrabold text-brand-orange">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix ?? ""} suffix={stat.suffix ?? ""} isYear={stat.isYear} formatIndian={stat.label === "Funds Mobilized"} />
                  </p>
                  <p className="mt-3 text-xs md:text-sm uppercase tracking-widest text-white/80 font-semibold">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {governance && (
          <Reveal delay={0.2}>
            <div className="mt-14 rounded-3xl bg-white/5 backdrop-blur border border-white/15 p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="grid place-items-center h-12 w-12 rounded-2xl bg-brand-orange text-white shrink-0">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white">{governance.heading}</h3>
                  <p className="mt-2 text-white/80 leading-relaxed">{governance.description}</p>
                  {govPoints.length > 0 && (
                    <ul className="mt-5 grid sm:grid-cols-2 gap-3">
                      {govPoints.map((p) => (
                        <li key={p} className="text-sm text-white/90 flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />{p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}