// src/app/projects/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Clock,
  ArrowLeft,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { projectsDetail } from "@/lib/mock-data";
import { formatDate, formatINR } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = projectsDetail.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projectsDetail.find((p) => p.slug === slug);

  if (!project) notFound();

  const hasFinancials =
    project.showFinancials &&
    (project.fundsReceived > 0 || project.fundsUsed > 0);

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        subtitle={project.description}
        breadcrumb="Project Details"
      />

      <section className="py-14 bg-brand-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-orange transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all projects
          </Link>

          {/* Meta cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <Calendar className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Date
              </p>
              <p className="mt-1 font-bold text-brand-green">
                {formatDate(project.date)}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <Clock className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Duration
              </p>
              <p className="mt-1 font-bold text-brand-green">
                {project.duration}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <MapPin className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Location
              </p>
              <p className="mt-1 font-bold text-brand-green text-sm">
                {project.location}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <Users className="h-5 w-5 text-brand-orange" />
              <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                Beneficiaries
              </p>
              <p className="mt-1 font-bold text-brand-green">
                {project.beneficiaries.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
            <h2 className="font-heading text-2xl font-bold text-brand-green">
              About this project
            </h2>
            <p className="mt-4 text-neutral-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Financials */}
          {hasFinancials && (
            <div className="mt-8 bg-brand-green text-white rounded-3xl p-8 md:p-10">
              <h2 className="font-heading text-2xl font-bold">
                Financial Transparency
              </h2>
              <p className="mt-2 text-white/80 text-sm">
                Every rupee is accounted for and reported to our donors.
              </p>
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                  <IndianRupee className="h-5 w-5 text-brand-orange" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-white/70 font-semibold">
                    Funds Received
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-brand-orange">
                    {formatINR(project.fundsReceived)}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                  <IndianRupee className="h-5 w-5 text-brand-orange" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-white/70 font-semibold">
                    Funds Used
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-brand-orange">
                    {formatINR(project.fundsUsed)}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-5 border border-white/15">
                  <IndianRupee className="h-5 w-5 text-brand-orange" />
                  <p className="mt-3 text-xs uppercase tracking-wide text-white/70 font-semibold">
                    Utilized
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-brand-orange">
                    {Math.round((project.fundsUsed / project.fundsReceived) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Gallery */}
          {project.gallery.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-2xl font-bold text-brand-green mb-6">
                Photo Gallery
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {project.gallery.map((src, i) => (
                  <div
                    key={src + i}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                  >
                    <Image
                      src={src}
                      alt={`${project.title} — photo ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 bg-brand-orange text-white rounded-3xl p-8 text-center">
            <h3 className="font-heading text-2xl font-bold">
              Want to support projects like this?
            </h3>
            <p className="mt-2 text-white/90">
              Your contribution keeps our work going.
            </p>
            <Link
              href="/donate"
              className="mt-6 inline-block px-7 py-3.5 rounded-full bg-white text-brand-orange font-semibold hover:bg-brand-cream transition-colors shadow"
            >
              Donate Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}