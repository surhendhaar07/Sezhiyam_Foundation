// src/components/home/RecentProjects.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, IndianRupee, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { formatDate, formatINR } from "@/lib/utils";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  date: Date;
  location: string;
  beneficiaries: number;
  fundsUsed: number;
  category: string;
  status: string;
}

export default function RecentProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Latest Work" title="Recent Projects" subtitle="Snapshots of the impact we've recently created on the ground." />
        {projects.length === 0 ? (
          <p className="text-center text-neutral-500 mt-12">Projects will appear here.</p>
        ) : (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1}>
                <article className="group h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    {project.coverImage && (
                      <Image src={project.coverImage} alt={project.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-brand-green text-white text-xs font-semibold shadow">{project.category}</span>
                    <span className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-brand-green text-xs font-semibold">{project.status}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-lg font-bold text-brand-green leading-snug">{project.title}</h3>
                    <p className="mt-2 text-sm text-neutral-700 leading-relaxed flex-1">{project.description}</p>
                    <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-neutral-600">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-brand-orange" />{formatDate(project.date.toISOString())}</span>
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-orange" />{project.location.split(",")[0]}</span>
                      <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-brand-orange" />{project.beneficiaries.toLocaleString("en-IN")} reached</span>
                      <span className="inline-flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-brand-orange" />{formatINR(project.fundsUsed)} used</span>
                    </div>
                    <Link href={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange hover:text-brand-orange-dark">
                      View More <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
        <Reveal delay={0.3} className="mt-12 text-center">
          <Link href="/projects" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-green text-white text-sm md:text-base font-semibold hover:bg-brand-green-dark transition-colors shadow-lg">
            View All Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}