import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) redirect("/login");

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { coins: true, name: true },
  });

  const ownedItems = await prisma.ownedItem.findMany({
    where: { childId },
    include: { item: true },
  });

  return (
    <ShopClient
      initialCoins={child?.coins ?? 0}
      ownedItems={ownedItems.map((o) => ({
        id: o.item.id,
        name: o.item.name,
        rarity: o.item.rarity as "Common" | "Rare" | "Legendary",
        layer: o.item.layer,
        imageUrl: o.item.imageUrl,
        coinValue: o.item.coinValue,
        equipped: o.equipped,
      }))}
    />
  );
}
