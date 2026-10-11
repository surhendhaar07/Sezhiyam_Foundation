// src/lib/queries.ts
import { prisma } from "@/lib/prisma";

/* ---------- Site Settings ---------- */
export async function getSiteSettings() {
  return prisma.siteSetting.findUnique({ where: { id: "main" } });
}

/* ---------- Team ---------- */
export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

/* ---------- Wings ---------- */
export async function getWings() {
  return prisma.wing.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

/* ---------- Impact Stats ---------- */
export async function getImpactStats() {
  return prisma.impactStat.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });
}

/* ---------- Governance ---------- */
export async function getGovernanceInfo() {
  return prisma.governanceInfo.findUnique({ where: { id: "main" } });
}

/* ---------- Working Locations ---------- */
export async function getWorkingLocations() {
  return prisma.workingLocation.findMany({
    where: { published: true, active: true },
    orderBy: { order: "asc" },
  });
}

/* ---------- Projects ---------- */
export async function getProjects(options?: {
  status?: string;
  category?: string;
  limit?: number;
  featuredOnly?: boolean;
}) {
  const where: any = { published: true };
  if (options?.status) where.status = options.status;
  if (options?.category) where.category = options.category;
  if (options?.featuredOnly) where.isFeatured = true;

  return prisma.project.findMany({
    where,
    orderBy: { date: "desc" },
    take: options?.limit,
    include: { gallery: { orderBy: { order: "asc" } } },
  });
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
}

/* ---------- NALAM ---------- */
export async function getNalamEvents(options?: {
  occasion?: string;
  year?: number;
  limit?: number;
}) {
  const where: any = { published: true };
  if (options?.occasion) where.occasion = options.occasion;
  if (options?.year) where.year = options.year;

  return prisma.nalamEvent.findMany({
    where,
    orderBy: { date: "desc" },
    take: options?.limit,
    include: { gallery: { orderBy: { order: "asc" } } },
  });
}

export async function getNalamBySlug(slug: string) {
  return prisma.nalamEvent.findFirst({
    where: { slug, published: true },
    include: { gallery: { orderBy: { order: "asc" } } },
  });
}

/* ---------- News ---------- */
export async function getNews(options?: {
  isEvent?: boolean;
  limit?: number;
}) {
  const where: any = { published: true };
  if (options?.isEvent !== undefined) where.isEvent = options.isEvent;

  return prisma.newsPost.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: options?.limit,
  });
}