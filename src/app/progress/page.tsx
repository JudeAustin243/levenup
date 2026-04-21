import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const role = (session.user as any).role;
  if (role === "child") redirect("/child/progress");
  redirect("/parent/dashboard");
}
