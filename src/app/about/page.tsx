// src/app/about/page.tsx
import Image from "next/image";
import { Eye, Target, Heart, CheckCircle2, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import {
  visionMissionValues,
  teamMembers,
  wings,
  governanceInfo,
  aboutPreview,
} from "@/lib/mock-data";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Who We Are"
        title="About SEZHIYAM FOUNDATION"
        subtitle="A grassroots movement rooted in Tamil Nadu, driven by compassion and transparency."
        breadcrumb="About Us"
      />

      {/* Introduction */}
      <section className="py-20 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&q=80"
                alt="SEZHIYAM FOUNDATION at work"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <SectionHeading
              eyebrow="Our Story"
              title="Founded on the belief that every person deserves dignity"
              align="left"
            />
            <p className="mt-6 text-neutral-700 leading-relaxed">
              {aboutPreview.paragraph}
            </p>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Since our founding, SEZHIYAM FOUNDATION has grown from a small group
              of volunteers into a structured organization with dedicated wings
              for education, health, women's empowerment, and disaster relief. Our
              work spans multiple districts of Tamil Nadu, touching thousands of
              lives every year.
            </p>
            <ul className="mt-6 space-y-3">
              {aboutPreview.bulletPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-neutral-800">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What Drives Us"
            title="Vision, Mission & Values"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {visionMissionValues.map((item, i) => {
              const Icon =
                item.icon === "eye" ? Eye : item.icon === "target" ? Target : Heart;
              return (
                <Reveal key={item.type} delay={i * 0.1}>
                  <div className="h-full rounded-3xl bg-brand-cream border border-brand-cream-dark p-8 hover:shadow-xl transition-all">
                    <div className="grid place-items-center h-16 w-16 rounded-2xl bg-brand-green text-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="mt-6 font-heading text-2xl font-bold text-brand-green">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-neutral-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our People" title="Meet Our Team" />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.08}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative aspect-square">
                    <Image
                      src={m.image}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-brand-green">
                      {m.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-brand-orange font-semibold mt-1">
                      {m.designation}
                    </p>
                    <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                      {m.bio}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wings */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our Divisions" title="Our Wings" />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {wings.map((w, i) => (
              <Reveal key={w.name} delay={i * 0.08}>
                <div className="rounded-3xl bg-brand-cream border border-brand-cream-dark p-8">
                  <h3 className="font-heading text-xl font-bold text-brand-green">
                    {w.name}
                  </h3>
                  <p className="mt-3 text-neutral-700 leading-relaxed">
                    {w.description}
                  </p>
                  <div className="mt-5 pt-5 border-t border-brand-cream-dark">
                    <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">
                      {w.inCharge.designation}
                    </p>
                    <p className="text-sm font-semibold text-brand-green mt-0.5">
                      {w.inCharge.name}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-20 bg-brand-green text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="flex items-start gap-5">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-brand-orange shrink-0">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold">
                  {governanceInfo.heading}
                </h2>
                <p className="mt-4 text-white/85 leading-relaxed">
                  {governanceInfo.description}
                </p>
                <ul className="mt-6 grid sm:grid-cols-2 gap-3">
                  {governanceInfo.points.map((p) => (
                    <li key={p} className="text-sm text-white/90 flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-orange shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}