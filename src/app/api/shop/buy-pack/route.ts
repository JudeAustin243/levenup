import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  PACK_CONFIG,
  weightedRandomRarity,
  DUPLICATE_REBATE_RATE,
  type PackTierKey,
} from "@/lib/packs";

export async function POST(request: Request) {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { packTier } = await request.json();
  const config = PACK_CONFIG[packTier as PackTierKey];
  if (!config) {
    return NextResponse.json({ error: "Invalid pack tier" }, { status: 400 });
  }

  // Get child balance
  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child || child.coins < config.price) {
    return NextResponse.json({ error: "Not enough coins" }, { status: 400 });
  }

  // Get all items grouped by rarity
  const allItems = await prisma.avatarItem.findMany();
  const byRarity: Record<string, typeof allItems> = {};
  for (const item of allItems) {
    (byRarity[item.rarity] ??= []).push(item);
  }

  // Get already-owned item IDs (snapshot BEFORE this pack)
  const alreadyOwnedIds = new Set(
    (
      await prisma.ownedItem.findMany({
        where: { childId },
        select: { itemId: true },
      })
    ).map((o) => o.itemId)
  );

  // Roll items and track duplicates as we go
  const rolledItems: { item: (typeof allItems)[0]; isDuplicate: boolean }[] = [];
  const seenInThisPack = new Set<string>();
  let duplicateRebate = 0;

  for (let i = 0; i < config.itemCount; i++) {
    const rarity = weightedRandomRarity(config.weights);
    const pool = byRarity[rarity];
    if (!pool || pool.length === 0) continue;
    const item = pool[Math.floor(Math.random() * pool.length)];

    // It's a duplicate if already owned OR already rolled in this pack
    const isDuplicate = alreadyOwnedIds.has(item.id) || seenInThisPack.has(item.id);

    if (isDuplicate) {
      duplicateRebate += Math.floor(item.coinValue * DUPLICATE_REBATE_RATE);
    }

    seenInThisPack.add(item.id);
    rolledItems.push({ item, isDuplicate });
  }

  const netCost = config.price - duplicateRebate;

  // Atomic transaction
  await prisma.$transaction(async (tx) => {
    const freshChild = await tx.child.findUnique({ where: { id: childId } });
    if (!freshChild || freshChild.coins < netCost) {
      throw new Error("Insufficient coins");
    }

    await tx.child.update({
      where: { id: childId },
      data: { coins: { decrement: netCost } },
    });

    // Create owned items (skip already owned)
    for (const { item, isDuplicate } of rolledItems) {
      if (!isDuplicate) {
        try {
          await tx.ownedItem.create({
            data: { childId, itemId: item.id },
          });
        } catch {
          // unique constraint violation — item already owned (race condition safety)
        }
      }
    }

    // Log purchase
    await tx.packPurchase.create({
      data: {
        childId,
        packTier,
        coinsCost: config.price,
        itemsJson: rolledItems.map((r) => r.item.id),
      },
    });
  });

  return NextResponse.json({
    items: rolledItems.map(({ item, isDuplicate }) => ({
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      layer: item.layer,
      imageUrl: item.imageUrl,
      coinValue: item.coinValue,
      isDuplicate,
    })),
    duplicateRebate,
    newBalance: child.coins - netCost,
  });
}
