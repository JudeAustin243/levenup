import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeHexagonProfile, saveHexagonSnapshot } from "@/lib/hexagon";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { sessionId } = await request.json();

    const practiceSession = await prisma.session.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });

    // Recompute hexagon and save snapshot if significant activity
    const totalAnswers = await prisma.answer.count({ where: { childId } });
    if (totalAnswers % 10 === 0) {
      const scores = await computeHexagonProfile(childId);
      await saveHexagonSnapshot(childId, scores);
    }

    return NextResponse.json({
      questionsAttempted: practiceSession.questionsAttempted,
      questionsCorrect: practiceSession.questionsCorrect,
      score: practiceSession.questionsAttempted > 0
        ? Math.round((practiceSession.questionsCorrect / practiceSession.questionsAttempted) * 100)
        : 0,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
