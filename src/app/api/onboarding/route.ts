import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "parent") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { childName, childAge, pin, examBoard, examDate, avatar } =
      await request.json();

    if (!childName || !pin) {
      return NextResponse.json(
        { error: "Child name and PIN are required" },
        { status: 400 }
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "PIN must be exactly 4 digits" },
        { status: 400 }
      );
    }

    const pinHash = await bcrypt.hash(pin, 12);

    const child = await prisma.child.create({
      data: {
        parentId: session.user.id,
        name: childName,
        age: childAge ? parseInt(childAge) : null,
        pinHash,
        examBoard: examBoard || null,
        examDate: examDate ? new Date(examDate) : null,
        avatar: avatar || "\ud83c\udf1f",
        onboardingDone: true,
      },
    });

    return NextResponse.json({
      childId: child.id,
      loginCode: child.id,
      message: "Child profile created successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
