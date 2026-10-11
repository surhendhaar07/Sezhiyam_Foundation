// src/components/ui/PageHero.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb: string; // e.g. "About Us"
}

export default function PageHero({ eyebrow, title, subtitle, breadcrumb }: Props) {
  return (
    <section className="relative bg-brand-green text-white overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-brand-orange/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-white/70 mb-6">
          <Link href="/" className="hover:text-brand-orange transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-brand-orange font-medium">{breadcrumb}</span>
        </nav>

        {eyebrow && (
          <span className="inline-block px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-semibold tracking-widest uppercase">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-4 font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-white/85 text-base md:text-lg max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}