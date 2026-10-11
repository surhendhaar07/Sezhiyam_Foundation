// src/components/home/AboutPreview.tsx
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const BULLETS = [
  "Rooted in Tamil Nadu, serving Tamil Nadu",
  "100% volunteer-driven at the field level",
  "Transparent about every rupee we spend",
];

interface AboutSettings {
  aboutContent?: string | null;
  foundationName?: string | null;
}

export default function AboutPreview({ settings }: { settings: AboutSettings | null }) {
  const heading = `About ${settings?.foundationName ?? "SEZHIYAM FOUNDATION"}`;
  const paragraph =
    settings?.aboutContent && settings.aboutContent.length > 20
      ? settings.aboutContent
      : "Founded on the belief that every person deserves dignity and opportunity, SEZHIYAM FOUNDATION works at the grassroots level to empower underserved communities across Tamil Nadu.";

  return (
    <section className="bg-brand-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80" alt="SEZHIYAM volunteers at work" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-4 md:-right-6 bg-brand-green text-white rounded-2xl px-6 py-4 shadow-xl">
              <p className="font-heading text-3xl font-extrabold">10+</p>
              <p className="text-xs tracking-widest uppercase text-brand-orange font-semibold">Years of Service</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <SectionHeading eyebrow="Who We Are" title={heading} align="left" />
            <p className="mt-6 text-neutral-700 leading-relaxed">{paragraph}</p>
            <ul className="mt-6 space-y-3">
              {BULLETS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-800">{point}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark transition-colors">
              Read More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}