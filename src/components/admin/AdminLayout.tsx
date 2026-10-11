// src/components/admin/AdminLayout.tsx
import Link from "next/link";
import { signOut } from "@/lib/auth";
import {
  Leaf,
  LogOut,
  LayoutDashboard,
  FolderOpen,
  Users,
  Heart,
  FileText,
  Settings,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: FolderOpen },
  { href: "/admin/nalam", label: "NALAM", Icon: Heart },
  { href: "/admin/team", label: "Team", Icon: Users },
  { href: "/admin/news", label: "News", Icon: FileText },
  { href: "/admin/locations", label: "Locations", Icon: MapPin },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Mail },
  { href: "/admin/reports", label: "Reports", Icon: ShieldCheck },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

interface Props {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  userEmail: string;
}

export default function AdminLayout({
  children,
  title,
  description,
  action,
  userEmail,
}: Props) {
  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-white rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2.5 pb-6 border-b border-neutral-100">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green text-white">
                <Leaf className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-heading font-bold text-brand-green text-sm">
                  Admin Panel
                </p>
                <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
              </div>
            </div>

            <nav className="mt-6 space-y-1">
              {NAV_ITEMS.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-brand-green-soft hover:text-brand-green transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>

            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
              className="mt-6 pt-6 border-t border-neutral-100"
            >
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </aside>

          {/* Main */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-3xl font-extrabold text-brand-green">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1 text-neutral-600 text-sm">{description}</p>
                )}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>

            {children}
          </div>
        </div>
      </div>
    </section>
  );
}