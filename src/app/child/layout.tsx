import { requireChild } from "@/lib/auth-helpers";

export default async function ChildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireChild();
  return <>{children}</>;
}
