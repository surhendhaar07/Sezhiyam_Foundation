// src/components/ui/AnimatedCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatIndian?: boolean;
  isYear?: boolean;
}

export default function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2000,
  formatIndian = false,
  isYear = false,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (isYear) {
      setDisplay(value);
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, isYear]);

  const formatted = formatIndian
    ? display.toLocaleString("en-IN")
    : display.toLocaleString();

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}