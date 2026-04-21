import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { slug } = await params;
  const role = (session.user as any).role;

  if (role === "child") {
    redirect(`/child/subjects/${slug}`);
  }

  redirect("/parent/dashboard");
}
