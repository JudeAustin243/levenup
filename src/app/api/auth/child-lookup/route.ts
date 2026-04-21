import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Login code required" }, { status: 400 });
  }

  // The login code is the child's ID
  const child = await prisma.child.findUnique({
    where: { id: code },
    select: { id: true, name: true, avatar: true },
  });

  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  return NextResponse.json({
    childId: child.id,
    name: child.name,
    avatar: child.avatar,
  });
}
