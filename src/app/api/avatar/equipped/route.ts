import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const equipped = await prisma.ownedItem.findMany({
    where: { childId, equipped: true },
    include: { item: true },
  });

  return NextResponse.json({
    items: equipped.map((o) => ({
      layer: o.item.layer,
      imageUrl: o.item.imageUrl,
      name: o.item.name,
      rarity: o.item.rarity,
    })),
  });
}
