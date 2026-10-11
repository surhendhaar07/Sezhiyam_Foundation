// src/lib/site-config.ts

/**
 * Central site configuration.
 * In later stages, these values will be overridden by the admin dashboard
 * (loaded from the database). Keeping them here now makes it trivial to swap.
 */
export const siteConfig = {
  name: "SEZHIYAM FOUNDATION",
  shortName: "Sezhiyam",
  tagline: "Serving Humanity, Building Communities",
  description:
    "A grassroots NGO working across Tamil Nadu in education, health, community welfare, and disaster relief.",

  // Contact
  phone: "+91 90000 00000",        // placeholder — admin will update
  email: "info@sezhiyam.org",      // placeholder
  address: "Tamil Nadu, India",    // placeholder

  // Social (placeholders — admin will update)
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    twitter: "https://twitter.com/",
  },

  // Navigation links (order matters)
  nav: [
    { label: "Home",        href: "/" },
    { label: "About Us",    href: "/about" },
    { label: "Projects",    href: "/projects" },
    { label: "NALAM",       href: "/nalam" },
    { label: "Contact Us",  href: "/contact" },
  ],

  adminLoginHref: "/admin/login",
  donateHref: "/donate",
} as const;

export type SiteConfig = typeof siteConfig;