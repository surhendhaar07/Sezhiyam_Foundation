// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Leaf, Phone, Mail, MapPin, Share2, Camera, Video, MessageCircle } from "lucide-react";

const YEAR = new Date().getFullYear();

interface Props {
  foundationName: string;
  logoUrl: string | null;
  description: string;
  phone: string;
  email: string;
  address: string;
  socialFacebook: string | null;
  socialInstagram: string | null;
  socialYoutube: string | null;
  socialTwitter: string | null;
}

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "NALAM", href: "/nalam" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer({
  foundationName,
  logoUrl,
  description,
  phone,
  email,
  address,
  socialFacebook,
  socialInstagram,
  socialYoutube,
  socialTwitter,
}: Props) {
  const [firstWord, ...restWords] = foundationName.split(" ");
  const secondLine = restWords.join(" ");

  return (
    <footer className="bg-brand-green text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              {logoUrl ? (
                <span className="relative h-10 w-10 rounded-full overflow-hidden bg-white">
                  <Image src={logoUrl} alt={foundationName} fill sizes="40px" className="object-cover" />
                </span>
              ) : (
                <span className="grid place-items-center h-10 w-10 rounded-full bg-white text-brand-green">
                  <Leaf className="h-5 w-5" />
                </span>
              )}
              <span className="font-heading font-extrabold text-lg leading-tight">
                {firstWord}
                {secondLine && (
                  <span className="block text-[10px] font-medium text-brand-orange tracking-widest">
                    {secondLine}
                  </span>
                )}
              </span>
            </div>
            {description && (
              <p className="mt-4 text-sm text-white/75 leading-relaxed">{description}</p>
            )}

            <div className="mt-5 flex items-center gap-3">
              {socialFacebook && (
                <a href={socialFacebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                   className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors">
                  <Share2 className="h-4 w-4" />
                </a>
              )}
              {socialInstagram && (
                <a href={socialInstagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                   className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors">
                  <Camera className="h-4 w-4" />
                </a>
              )}
              {socialYoutube && (
                <a href={socialYoutube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                   className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors">
                  <Video className="h-4 w-4" />
                </a>
              )}
              {socialTwitter && (
                <a href={socialTwitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                   className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-brand-orange">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brand-orange transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/donate" className="hover:text-brand-orange transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-brand-orange">Contact Us</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-orange" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-0.5 shrink-0 text-brand-orange" />
                  <a href={`tel:${phone}`} className="hover:text-brand-orange transition-colors">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-brand-orange" />
                  <a href={`mailto:${email}`} className="hover:text-brand-orange transition-colors break-all">
                    {email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-brand-orange">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li><Link href="/privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-orange transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/admin/login" className="hover:text-brand-orange transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {YEAR} {foundationName}. All rights reserved.</p>
          <p>Made with ❤️ for the community.</p>
        </div>
      </div>
    </footer>
  );
}