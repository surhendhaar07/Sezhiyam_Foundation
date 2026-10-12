// src/components/ui/SectionHeading.tsx
import { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;   // ← NEW: allow callers to override title color
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  titleClassName = "",
}: Props) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span className="inline-block px-3 py-1 rounded-full bg-brand-orange-soft text-brand-orange-dark text-xs font-semibold tracking-widest uppercase">
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-brand-green ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-neutral-700 text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}