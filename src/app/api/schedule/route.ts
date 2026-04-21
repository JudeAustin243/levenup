import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId") || (session.user as any).activeChildId;

    if (!childId) {
      return NextResponse.json({ error: "Child ID required" }, { status: 400 });
    }

    // Get current week's schedule
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const schedule = await prisma.schedule.findFirst({
      where: {
        childId,
        weekStartDate: { gte: weekStart },
      },
      orderBy: { weekStartDate: "desc" },
    });

    // Get completed sessions this week
    const completedSessions = await prisma.session.findMany({
      where: {
        childId,
        startedAt: { gte: weekStart },
        endedAt: { not: null },
      },
      select: { topicId: true, subjectId: true, startedAt: true },
    });

    return NextResponse.json({
      schedule: schedule?.sessionsJson || null,
      weekStartDate: weekStart.toISOString(),
      completedSessions,
      hasSchedule: !!schedule,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
