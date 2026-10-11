// src/components/home/TeamCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface Member {
  id: string;
  name: string;
  designation: string;
  bio: string | null;
  photoUrl: string | null;
}

export default function TeamCarousel({ members }: { members: Member[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || members.length === 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % members.length), 5000);
    return () => clearInterval(id);
  }, [paused, members.length]);

  if (members.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-brand-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our People" title="Meet Our Team" />
          <p className="text-center text-neutral-500 mt-8">Team members will appear here.</p>
        </div>
      </section>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + members.length) % members.length);
  const next = () => setIndex((i) => (i + 1) % members.length);
  const member = members[index];

  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Our People" title="Meet Our Team" subtitle="The dedicated individuals leading SEZHIYAM FOUNDATION's mission." />
        <Reveal className="mt-14">
          <div className="relative max-w-5xl mx-auto rounded-3xl bg-white shadow-xl overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto md:min-h-[500px] bg-neutral-100">
                {member.photoUrl ? (
                  <Image key={member.photoUrl} src={member.photoUrl} alt={member.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-opacity duration-500" />
                ) : (
                  <div className="grid place-items-center h-full text-neutral-400">No photo</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/40 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                <span className="inline-block w-fit px-3 py-1 rounded-full bg-brand-orange-soft text-brand-orange-dark text-xs font-semibold tracking-widest uppercase">{member.designation}</span>
                <h3 className="mt-4 font-heading text-3xl md:text-4xl font-extrabold text-brand-green">{member.name}</h3>
                {member.bio && <p className="mt-4 text-neutral-700 leading-relaxed">{member.bio}</p>}
                <div className="mt-8 flex items-center gap-3">
                  <button onClick={prev} aria-label="Previous" className="grid place-items-center h-11 w-11 rounded-full bg-brand-green text-white hover:bg-brand-orange transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                  <button onClick={next} aria-label="Next" className="grid place-items-center h-11 w-11 rounded-full bg-brand-green text-white hover:bg-brand-orange transition-colors"><ChevronRight className="h-5 w-5" /></button>
                  <span className="ml-4 text-sm text-neutral-500">{index + 1} / {members.length}</span>
                </div>
                <div className="mt-6 flex items-center gap-2">
                  {members.map((_, i) => (
                    <button key={i} onClick={() => setIndex(i)} aria-label={`Member ${i + 1}`} className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-brand-orange" : "w-2 bg-neutral-300 hover:bg-neutral-400"}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}