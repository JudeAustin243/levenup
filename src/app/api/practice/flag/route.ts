import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { answerId, flagged } = await request.json();

    if (!answerId) {
      return NextResponse.json({ error: "Answer ID required" }, { status: 400 });
    }

    // Verify the answer belongs to this child
    const answer = await prisma.answer.findFirst({
      where: { id: answerId, childId },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    await prisma.answer.update({
      where: { id: answerId },
      data: { flagged: !!flagged },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
