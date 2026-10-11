// src/components/home/VisionMissionValues.tsx
import { Eye, Target, Heart } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface Settings {
  visionText?: string | null;
  missionText?: string | null;
  valuesText?: string | null;
}

export default function VisionMissionValues({ settings }: { settings: Settings | null }) {
  const items = [
    {
      type: "vision",
      title: "Our Vision",
      description: settings?.visionText || "A just and equitable society where every individual has access to education, healthcare, and the opportunity to lead a life of dignity.",
      Icon: Eye,
    },
    {
      type: "mission",
      title: "Our Mission",
      description: settings?.missionText || "To empower underprivileged communities through sustainable programs in education, health, livelihood, and disaster response.",
      Icon: Target,
    },
    {
      type: "values",
      title: "Our Core Values",
      description: settings?.valuesText || "Compassion. Integrity. Transparency. Community-first. Sustainability.",
      Icon: Heart,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our Foundation" title="Vision, Mission & Values" subtitle="The principles that guide every project we undertake." />
        <div className="mt-14 grid gap-6 md:gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.type} delay={i * 0.1}>
              <div className="group h-full rounded-3xl bg-brand-cream border border-brand-cream-dark p-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-green text-white shadow-lg group-hover:bg-brand-orange transition-colors">
                  <item.Icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-brand-green">{item.title}</h3>
                <p className="mt-3 text-neutral-700 leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}