import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { coins: true },
  });

  return NextResponse.json({ coins: child?.coins ?? 0 });
}
