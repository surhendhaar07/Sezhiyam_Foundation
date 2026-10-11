// src/components/home/SocialSection.tsx
import { Share2, Camera, Video, MessageCircle, LucideIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

interface Settings {
  socialFacebook?: string | null;
  socialInstagram?: string | null;
  socialYoutube?: string | null;
  socialTwitter?: string | null;
}

export default function SocialSection({ settings }: { settings: Settings | null }) {
  const links: { label: string; url: string | null | undefined; Icon: LucideIcon }[] = [
    { label: "Facebook", url: settings?.socialFacebook, Icon: Share2 },
    { label: "Instagram", url: settings?.socialInstagram, Icon: Camera },
    { label: "YouTube", url: settings?.socialYoutube, Icon: Video },
    { label: "Twitter", url: settings?.socialTwitter, Icon: MessageCircle },
  ].filter((l) => l.url);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Stay Connected" title="Follow Our Journey" subtitle="Get the latest updates from the field on social media." />
        {links.length === 0 ? (
          <p className="text-center text-neutral-500 mt-12">Social links will appear here.</p>
        ) : (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {links.map((post, i) => (
              <Reveal key={post.label} delay={i * 0.08}>
                <a href={post.url!} target="_blank" rel="noopener noreferrer"
                   className="group flex flex-col items-center justify-center gap-3 rounded-3xl bg-brand-cream border border-brand-cream-dark p-6 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all duration-300 hover:-translate-y-1">
                  <span className="grid place-items-center h-14 w-14 rounded-2xl bg-brand-orange text-white group-hover:bg-white group-hover:text-brand-green transition-colors">
                    <post.Icon className="h-7 w-7" />
                  </span>
                  <span className="font-semibold text-brand-green group-hover:text-white text-sm">{post.label}</span>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}