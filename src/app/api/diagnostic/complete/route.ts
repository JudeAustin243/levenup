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

    // Mark session as complete
    await prisma.session.update({
      where: { id: sessionId },
      data: { endedAt: new Date() },
    });

    // Get session results
    const diagnosticSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: {
            question: { include: { topic: { include: { subject: true } } } },
          },
        },
      },
    });

    if (!diagnosticSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Compute per-subject scores
    const subjectScores: Record<string, { correct: number; total: number; name: string }> = {};
    for (const answer of diagnosticSession.answers) {
      const subjectName = answer.question.topic.subject.name;
      if (!subjectScores[subjectName]) {
        subjectScores[subjectName] = { correct: 0, total: 0, name: subjectName };
      }
      subjectScores[subjectName].total++;
      if (answer.isCorrect) subjectScores[subjectName].correct++;
    }

    // Set initial difficulty levels based on performance
    const topicScores: Record<string, { correct: number; total: number }> = {};
    for (const answer of diagnosticSession.answers) {
      const tid = answer.question.topicId;
      if (!topicScores[tid]) topicScores[tid] = { correct: 0, total: 0 };
      topicScores[tid].total++;
      if (answer.isCorrect) topicScores[tid].correct++;
    }

    for (const [topicId, scores] of Object.entries(topicScores)) {
      const pct = scores.total > 0 ? scores.correct / scores.total : 0.5;
      let level = 3;
      if (pct >= 0.8) level = 4;
      else if (pct >= 0.6) level = 3;
      else if (pct >= 0.4) level = 2;
      else level = 1;

      await prisma.childTopicDifficulty.upsert({
        where: { childId_topicId: { childId, topicId } },
        create: { childId, topicId, currentLevel: level },
        update: { currentLevel: level },
      });
    }

    // Compute and save hexagon profile
    const hexagonScores = await computeHexagonProfile(childId);
    await saveHexagonSnapshot(childId, hexagonScores);

    // Build results
    const totalCorrect = diagnosticSession.questionsCorrect;
    const totalQuestions = diagnosticSession.questionsAttempted;

    return NextResponse.json({
      overallScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      totalCorrect,
      totalQuestions,
      subjectScores: Object.values(subjectScores).map((s) => ({
        name: s.name,
        correct: s.correct,
        total: s.total,
        percentage: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      })),
      hexagonScores,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
