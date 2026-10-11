// src/components/home/HeroSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Info } from "lucide-react";

const HERO_IMAGES = [
  { image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&q=80", alt: "Community volunteering" },
  { image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=1600&q=80", alt: "Children learning" },
  { image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1600&q=80", alt: "Hands together" },
];

interface HeroSettings {
  welcomeMessage?: string | null;
  heroQuote?: string | null;
  heroDescription?: string | null;
}

export default function HeroSection({ settings }: { settings: HeroSettings | null }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), 6000);
    return () => clearInterval(id);
  }, []);

  const welcome = settings?.welcomeMessage ?? "Welcome to SEZHIYAM FOUNDATION";
  const quote = settings?.heroQuote ?? "Service to humanity is the best work of life.";
  const description = settings?.heroDescription ?? "A grassroots NGO working across Tamil Nadu.";

  return (
    <section className="relative min-h-[85vh] md:min-h-[92vh] w-full overflow-hidden">
      {HERO_IMAGES.map((slide, i) => (
        <div key={slide.image} className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}>
          <Image src={slide.image} alt={slide.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-green/85 via-brand-green/70 to-brand-green-dark/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 min-h-[85vh] md:min-h-[92vh] flex flex-col justify-center">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-orange text-white text-xs font-semibold tracking-widest uppercase shadow">
            {welcome}
          </span>
          <h1 className="mt-6 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1]">
            Together, we build{" "}
            <span className="text-brand-orange">stronger communities</span>.
          </h1>
          <p className="mt-6 text-white/90 text-base md:text-xl italic border-l-4 border-brand-orange pl-4">
            &ldquo;{quote}&rdquo;
          </p>
          <p className="mt-6 text-white/80 text-sm md:text-base max-w-2xl leading-relaxed">
            {description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-orange text-white text-sm md:text-base font-semibold shadow-lg hover:bg-brand-orange-dark transition-all">
              Explore Our Projects <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur border border-white/40 text-white text-sm md:text-base font-semibold hover:bg-white/20 transition-all">
              <Info className="h-4 w-4" /> About Us
            </Link>
            <Link href="/donate" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-brand-green text-sm md:text-base font-semibold hover:bg-brand-cream transition-all">
              <Heart className="h-4 w-4" /> Donate Now
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-brand-orange" : "w-2 bg-white/50 hover:bg-white/80"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}