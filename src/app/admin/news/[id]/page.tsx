// src/app/admin/news/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "../NewsForm";

export const metadata = { title: "Edit News" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNewsPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Edit News Post"
      description={post.title}
    >
      <NewsForm
        initialData={{
          id: post.id,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl ?? "",
          publishedAt: post.publishedAt.toISOString(),
          eventDate: post.eventDate ? post.eventDate.toISOString() : "",
          location: post.location ?? "",
          isEvent: post.isEvent,
          isImportant: post.isImportant,
          published: post.published,
        }}
      />
    </AdminLayout>
  );
}