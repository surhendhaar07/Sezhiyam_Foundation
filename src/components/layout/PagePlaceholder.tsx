// src/components/layout/PagePlaceholder.tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function PagePlaceholder({ title, description }: Props) {
  return (
    <section className="min-h-[70vh] grid place-items-center bg-brand-cream px-6 py-20">
      <div className="max-w-2xl text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-green-soft text-brand-green text-xs font-semibold tracking-widest">
          COMING SOON
        </span>
        <h1 className="mt-4 font-heading text-4xl md:text-5xl font-extrabold text-brand-green">
          {title}
        </h1>
        <p className="mt-4 text-neutral-700 text-lg leading-relaxed">
          {description}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-brand-green text-white text-sm font-semibold hover:bg-brand-green-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </section>
  );
}