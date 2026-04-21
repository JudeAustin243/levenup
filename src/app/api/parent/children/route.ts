import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || (session.user as any).role !== "parent") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const children = await prisma.child.findMany({
      where: { parentId: session.user.id },
      include: {
        sessions: {
          where: { endedAt: { not: null } },
          orderBy: { endedAt: "desc" },
          take: 5,
          include: { subject: true, topic: true },
        },
        hexagonProfiles: {
          orderBy: { snapshotDate: "desc" },
          take: 1,
        },
        _count: {
          select: { sessions: true, answers: true },
        },
      },
    });

    return NextResponse.json({
      children: children.map((child) => ({
        id: child.id,
        name: child.name,
        age: child.age,
        avatar: child.avatar,
        examDate: child.examDate,
        examBoard: child.examBoard,
        onboardingDone: child.onboardingDone,
        loginCode: child.id,
        totalSessions: child._count.sessions,
        totalAnswers: child._count.answers,
        latestHexagon: child.hexagonProfiles[0]?.axisScores || null,
        recentSessions: child.sessions.map((s) => ({
          id: s.id,
          type: s.sessionType,
          subject: s.subject?.name,
          topic: s.topic?.name,
          questionsAttempted: s.questionsAttempted,
          questionsCorrect: s.questionsCorrect,
          date: s.endedAt,
        })),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
