// src/app/admin/news/new/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import NewsForm from "../NewsForm";

export const metadata = { title: "Add News" };

export default async function NewNewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminLayout
      userEmail={session.user.email ?? ""}
      title="Add News Post"
      description="Create a news article or upcoming event announcement."
    >
      <NewsForm />
    </AdminLayout>
  );
}