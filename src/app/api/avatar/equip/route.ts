import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { itemId } = await request.json();
  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  const owned = await prisma.ownedItem.findUnique({
    where: { childId_itemId: { childId, itemId } },
    include: { item: true },
  });

  if (!owned) {
    return NextResponse.json({ error: "Item not owned" }, { status: 403 });
  }

  if (owned.equipped) {
    // Unequip
    await prisma.ownedItem.update({
      where: { id: owned.id },
      data: { equipped: false },
    });
  } else {
    // Unequip any existing item on the same layer, then equip this one
    await prisma.$transaction([
      prisma.ownedItem.updateMany({
        where: {
          childId,
          equipped: true,
          item: { layer: owned.item.layer },
        },
        data: { equipped: false },
      }),
      prisma.ownedItem.update({
        where: { id: owned.id },
        data: { equipped: true },
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}
