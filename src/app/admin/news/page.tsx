// src/app/admin/news/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus } from "lucide-react";
import NewsListClient from "./NewsListClient";

export const metadata = { title: "News Management" };

export default async function NewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="News & Events Management"
      description={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
      action={
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold hover:bg-brand-orange-dark transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add News
        </Link>
      }
    >
      <NewsListClient initialPosts={posts} />
    </AdminLayout>
  );
}