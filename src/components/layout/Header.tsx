// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Heart, Leaf } from "lucide-react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "NALAM", href: "/nalam" },
  { label: "Contact Us", href: "/contact" },
];

interface Props {
  foundationName: string;
  logoUrl: string | null;
}

export default function Header({ foundationName, logoUrl }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const [firstWord, ...restWords] = foundationName.split(" ");
  const secondLine = restWords.join(" ");

  return (
    <header
      className={`sticky top-0 z-[100] w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {logoUrl ? (
              <span className="relative h-15 w-15 rounded-full overflow-hidden bg-brand-green-soft ">
                <Image src={logoUrl} alt={foundationName} fill sizes="40px" className="object-cover" />
              </span>
            ) : (
              <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-green text-white shadow-sm">
                <Leaf className="h-5 w-5" />
              </span>
            )}
            <span className="font-heading font-extrabold text-brand-green text-lg sm:text-xl leading-tight">
              {firstWord}
              {secondLine && (
                <span className="block text-[10px] sm:text-xs font-medium text-brand-orange tracking-widest">
                  {secondLine}
                </span>
              )}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 xl:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "text-brand-green bg-brand-green-soft"
                      : "text-neutral-700 hover:text-brand-green hover:bg-brand-green-soft/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link
              href="/admin/login"
              className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-brand-green transition-colors"
            >
              Admin Login
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-orange text-white text-sm font-semibold shadow-md hover:bg-brand-orange-dark hover:shadow-lg transition-all"
            >
              <Heart className="h-4 w-4" />
              Donate Now
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden grid place-items-center h-10 w-10 rounded-lg text-brand-green hover:bg-brand-green-soft transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-x-0 top-16 md:top-20 bottom-0 bg-white z-40 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 gap-1 overflow-y-auto h-full">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  active ? "bg-brand-green-soft text-brand-green" : "text-neutral-800 hover:bg-neutral-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-neutral-200 my-3" />

          <Link
            href="/admin/login"
            className="px-4 py-3 rounded-xl text-base font-medium text-neutral-700 hover:bg-neutral-100"
          >
            Admin Login
          </Link>

          <Link
            href="/donate"
            className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-orange text-white text-base font-semibold shadow-md active:bg-brand-orange-dark"
          >
            <Heart className="h-5 w-5" />
            Donate Now
          </Link>
        </nav>
      </div>
    </header>
  );
}