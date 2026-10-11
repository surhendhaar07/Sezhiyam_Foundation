// src/lib/utils.ts

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}