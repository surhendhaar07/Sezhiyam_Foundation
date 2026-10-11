// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
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
} from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", Icon: FolderOpen },
  { href: "/admin/nalam", label: "NALAM", Icon: Heart },
  { href: "/admin/team", label: "Team", Icon: Users },
  { href: "/admin/news", label: "News", Icon: FileText },
  { href: "/admin/locations", label: "Locations", Icon: MapPin },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Mail },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
];

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [projectCount, nalamCount, teamCount, enquiryCount, unreadEnquiries] =
    await Promise.all([
      prisma.project.count(),
      prisma.nalamEvent.count(),
      prisma.teamMember.count(),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "new" } }),
    ]);

  const stats = [
    { label: "Projects", value: projectCount, Icon: FolderOpen, color: "bg-brand-green" },
    { label: "NALAM Events", value: nalamCount, Icon: Heart, color: "bg-brand-orange" },
    { label: "Team Members", value: teamCount, Icon: Users, color: "bg-brand-green" },
    { label: "Enquiries", value: enquiryCount, Icon: Mail, color: "bg-brand-orange" },
  ];

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="bg-white rounded-3xl p-6 shadow-sm h-fit lg:sticky lg:top-24">
            <div className="flex items-center gap-2.5 pb-6 border-b border-neutral-100">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-brand-green text-white">
                <Leaf className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-heading font-bold text-brand-green text-sm">
                  Admin Panel
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  {session.user.email}
                </p>
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

          <div>
            <h1 className="font-heading text-3xl font-extrabold text-brand-green">
              Welcome, {session.user.name}
            </h1>
            <p className="mt-1 text-neutral-600">
              Overview of SEZHIYAM FOUNDATION&apos;s content and activity.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div
                    className={`grid place-items-center h-11 w-11 rounded-xl ${stat.color} text-white`}
                  >
                    <stat.Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 font-heading text-3xl font-extrabold text-brand-green">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500 font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {unreadEnquiries > 0 && (
              <div className="mt-6 rounded-2xl bg-brand-orange-soft border border-brand-orange/30 p-5">
                <p className="text-sm font-semibold text-brand-orange-dark">
                  📬 {unreadEnquiries} unread{" "}
                  {unreadEnquiries === 1 ? "enquiry" : "enquiries"}
                </p>
                <Link
                  href="/admin/enquiries"
                  className="text-xs text-brand-orange-dark underline mt-1 inline-block"
                >
                  View enquiries →
                </Link>
              </div>
            )}

            <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brand-green">
                Getting started
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                You&apos;re signed in. This dashboard shell will be expanded in
                the next stage with full management pages for Projects, NALAM,
                Team, News, Locations, Enquiries, and Site Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}