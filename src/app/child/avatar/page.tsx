import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AvatarClient from "./AvatarClient";

export default async function AvatarPage() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) redirect("/login");

  const ownedItems = await prisma.ownedItem.findMany({
    where: { childId },
    include: { item: true },
    orderBy: { item: { layer: "asc" } },
  });

  const items = ownedItems.map((o) => ({
    id: o.item.id,
    name: o.item.name,
    rarity: o.item.rarity as "Common" | "Rare" | "Legendary",
    layer: o.item.layer,
    imageUrl: o.item.imageUrl,
    equipped: o.equipped,
  }));

  return <AvatarClient items={items} />;
}
