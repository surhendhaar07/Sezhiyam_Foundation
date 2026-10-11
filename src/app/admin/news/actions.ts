// src/app/admin/news/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const NewsSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  imageUrl: z.string().url().optional().or(z.literal("")),
  publishedAt: z.string().min(1), // ISO
  eventDate: z.string().optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  isEvent: z.coerce.boolean(),
  isImportant: z.coerce.boolean(),
  published: z.coerce.boolean(),
});

export type NewsInput = z.infer<typeof NewsSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function createNews(input: NewsInput) {
  const admin = await requireAdmin();
  const data = NewsSchema.parse(input);

  const post = await prisma.newsPost.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      publishedAt: new Date(data.publishedAt),
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      location: data.location || null,
      isEvent: data.isEvent,
      isImportant: data.isImportant,
      published: data.published,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "CREATE_NEWS",
      targetType: "NewsPost",
      targetId: post.id,
      details: `Created news: ${post.title}`,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");

  return { success: true, id: post.id };
}

export async function updateNews(id: string, input: NewsInput) {
  const admin = await requireAdmin();
  const data = NewsSchema.parse(input);

  const post = await prisma.newsPost.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl || null,
      publishedAt: new Date(data.publishedAt),
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      location: data.location || null,
      isEvent: data.isEvent,
      isImportant: data.isImportant,
      published: data.published,
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_NEWS",
      targetType: "NewsPost",
      targetId: id,
      details: `Updated news: ${post.title}`,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");

  return { success: true };
}

export async function deleteNews(id: string) {
  const admin = await requireAdmin();
  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) throw new Error("News not found");

  await prisma.newsPost.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_NEWS",
      targetType: "NewsPost",
      targetId: id,
      details: `Deleted news: ${post.title}`,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");

  return { success: true };
}

export async function toggleNewsPublish(id: string, published: boolean) {
  const admin = await requireAdmin();
  await prisma.newsPost.update({ where: { id }, data: { published } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: published ? "PUBLISH_NEWS" : "UNPUBLISH_NEWS",
      targetType: "NewsPost",
      targetId: id,
    },
  });

  revalidatePath("/admin/news");
  revalidatePath("/");
  revalidatePath("/news");
  return { success: true };
}