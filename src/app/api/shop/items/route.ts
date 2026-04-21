import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const [allItems, ownedItems] = await Promise.all([
    prisma.avatarItem.findMany({ orderBy: [{ layer: "asc" }, { rarity: "asc" }] }),
    prisma.ownedItem.findMany({
      where: { childId },
      select: { itemId: true, equipped: true },
    }),
  ]);

  const ownedMap = new Map(ownedItems.map((o) => [o.itemId, o.equipped]));

  return NextResponse.json({
    items: allItems.map((item) => ({
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      layer: item.layer,
      imageUrl: item.imageUrl,
      coinValue: item.coinValue,
      owned: ownedMap.has(item.id),
      equipped: ownedMap.get(item.id) ?? false,
    })),
  });
}
