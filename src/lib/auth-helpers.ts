import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireParent() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as any).role !== "parent") redirect("/child/dashboard");
  return session;
}

export async function requireChild() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if ((session.user as any).role !== "child" || !(session.user as any).activeChildId)
    redirect("/login/child");
  return session;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session;
}
