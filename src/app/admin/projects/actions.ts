// src/app/admin/projects/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ProjectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  longDescription: z.string().max(5000).optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  date: z.string().min(1), // ISO date string
  duration: z.string().max(80).optional().or(z.literal("")),
  location: z.string().min(1).max(200),
  beneficiaries: z.coerce.number().int().min(0),
  fundsReceived: z.coerce.number().min(0),
  fundsUsed: z.coerce.number().min(0),
  category: z.string().min(1).max(80),
  status: z.enum(["Upcoming", "Ongoing", "Completed"]),
  showFinancials: z.coerce.boolean(),
  published: z.coerce.boolean(),
  isFeatured: z.coerce.boolean(),
  gallery: z
    .array(
      z.object({
        url: z.string().url(),
        caption: z.string().max(200).optional().or(z.literal("")),
      })
    )
    .max(20),
});

export type ProjectInput = z.infer<typeof ProjectSchema>;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createProject(input: ProjectInput) {
  const admin = await requireAdmin();
  const data = ProjectSchema.parse(input);

  // Auto-suffix slug if duplicate
  let slug = data.slug || slugify(data.title);
  let suffix = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${data.slug || slugify(data.title)}-${suffix++}`;
  }

  const project = await prisma.project.create({
    data: {
      slug,
      title: data.title,
      description: data.description,
      longDescription: data.longDescription || null,
      coverImage: data.coverImage || null,
      date: new Date(data.date),
      duration: data.duration || null,
      location: data.location,
      beneficiaries: data.beneficiaries,
      fundsReceived: data.fundsReceived,
      fundsUsed: data.fundsUsed,
      category: data.category,
      status: data.status,
      showFinancials: data.showFinancials,
      published: data.published,
      isFeatured: data.isFeatured,
      gallery: {
        create: data.gallery.map((g, i) => ({
          url: g.url,
          caption: g.caption || null,
          order: i,
        })),
      },
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "CREATE_PROJECT",
      targetType: "Project",
      targetId: project.id,
      details: `Created project: ${project.title}`,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${slug}`);

  return { success: true, id: project.id, slug };
}

export async function updateProject(id: string, input: ProjectInput) {
  const admin = await requireAdmin();
  const data = ProjectSchema.parse(input);

  // Check slug conflict with OTHER projects
  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    throw new Error("Another project already uses this slug");
  }

  // Delete old gallery, recreate
  await prisma.projectImage.deleteMany({ where: { projectId: id } });

  const project = await prisma.project.update({
    where: { id },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      longDescription: data.longDescription || null,
      coverImage: data.coverImage || null,
      date: new Date(data.date),
      duration: data.duration || null,
      location: data.location,
      beneficiaries: data.beneficiaries,
      fundsReceived: data.fundsReceived,
      fundsUsed: data.fundsUsed,
      category: data.category,
      status: data.status,
      showFinancials: data.showFinancials,
      published: data.published,
      isFeatured: data.isFeatured,
      gallery: {
        create: data.gallery.map((g, i) => ({
          url: g.url,
          caption: g.caption || null,
          order: i,
        })),
      },
    },
  });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "UPDATE_PROJECT",
      targetType: "Project",
      targetId: id,
      details: `Updated project: ${project.title}`,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${project.slug}`);

  return { success: true };
}

export async function deleteProject(id: string) {
  const admin = await requireAdmin();
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error("Project not found");

  await prisma.project.delete({ where: { id } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: "DELETE_PROJECT",
      targetType: "Project",
      targetId: id,
      details: `Deleted project: ${project.title}`,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${project.slug}`);

  return { success: true };
}

export async function toggleProjectPublish(id: string, published: boolean) {
  const admin = await requireAdmin();
  await prisma.project.update({ where: { id }, data: { published } });

  await prisma.adminActivityLog.create({
    data: {
      adminId: admin.id as string,
      action: published ? "PUBLISH_PROJECT" : "UNPUBLISH_PROJECT",
      targetType: "Project",
      targetId: id,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true };
}