import { requireParent } from "@/lib/auth-helpers";

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireParent();
  return <>{children}</>;
}
