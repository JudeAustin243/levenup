import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeHexagonProfile, saveHexagonSnapshot } from "@/lib/hexagon";

function formatQuestionType(qt: string): string {
  return qt
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const DIFFICULTY_TO_AGE: Record<number, string> = {
  1: "6-7",
  2: "7-8",
  3: "8-9",
  4: "9-10",
  5: "10-11",
  6: "11+ (Advanced)",
};

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

    // Get all answers for this session with question data
    const diagnosticSession = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        answers: {
          include: {
            question: { include: { topic: true } },
          },
          orderBy: { answeredAt: "asc" },
        },
      },
    });

    if (!diagnosticSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const answers = diagnosticSession.answers;
    const totalQuestions = answers.length;
    const totalCorrect = answers.filter((a) => a.isCorrect).length;
    const overallScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Average difficulty of correct answers → estimated level
    const correctAnswers = answers.filter((a) => a.isCorrect);
    const avgDifficulty =
      correctAnswers.length > 0
        ? correctAnswers.reduce((sum, a) => sum + (a.difficultyAtTime || 3), 0) / correctAnswers.length
        : 1;

    const estimatedLevel = Math.round(Math.max(1, Math.min(6, avgDifficulty)));
    const estimatedAgeRange = DIFFICULTY_TO_AGE[estimatedLevel] || "8-9";

    // Difficulty path (array of difficulties attempted in order)
    const difficultyPath = answers.map((a) => a.difficultyAtTime || 3);
    const peakDifficulty = difficultyPath.length > 0 ? Math.max(...difficultyPath) : 3;
    const last10 = difficultyPath.slice(-10);
    const steadyStateDifficulty =
      last10.length > 0 ? Math.round(last10.reduce((a, b) => a + b, 0) / last10.length) : 3;

    // Breakdown by question type
    const byType: Record<string, { correct: number; total: number }> = {};
    for (const answer of answers) {
      const qt = answer.question.questionType || "General";
      if (!byType[qt]) byType[qt] = { correct: 0, total: 0 };
      byType[qt].total++;
      if (answer.isCorrect) byType[qt].correct++;
    }

    const byQuestionType = Object.entries(byType)
      .map(([qt, data]) => ({
        questionType: qt,
        displayName: formatQuestionType(qt),
        correct: data.correct,
        total: data.total,
        percentage: Math.round((data.correct / data.total) * 100),
      }))
      .sort((a, b) => a.percentage - b.percentage);

    // Weak areas (<50% accuracy, at least 2 attempts)
    const weakAreas = byQuestionType.filter((t) => t.total >= 2 && t.percentage < 50);

    // Strong areas (>=75% accuracy, at least 2 attempts)
    const strongAreas = byQuestionType.filter((t) => t.total >= 2 && t.percentage >= 75);

    // Update ChildTopicDifficulty for VR topics based on performance
    const topicScores: Record<string, { correct: number; total: number }> = {};
    for (const answer of answers) {
      const tid = answer.question.topicId;
      if (!topicScores[tid]) topicScores[tid] = { correct: 0, total: 0 };
      topicScores[tid].total++;
      if (answer.isCorrect) topicScores[tid].correct++;
    }

    for (const [topicId, scores] of Object.entries(topicScores)) {
      const pct = scores.total > 0 ? scores.correct / scores.total : 0.5;
      let level = 3;
      if (pct >= 0.8) level = 5;
      else if (pct >= 0.65) level = 4;
      else if (pct >= 0.5) level = 3;
      else if (pct >= 0.35) level = 2;
      else level = 1;

      await prisma.childTopicDifficulty.upsert({
        where: { childId_topicId: { childId, topicId } },
        create: { childId, topicId, currentLevel: level },
        update: { currentLevel: level },
      });
    }

    // Update hexagon profile
    const hexagonScores = await computeHexagonProfile(childId);
    await saveHexagonSnapshot(childId, hexagonScores);

    return NextResponse.json({
      overallScore,
      totalCorrect,
      totalQuestions,
      estimatedAgeRange,
      estimatedLevel,
      avgDifficulty: Math.round(avgDifficulty * 10) / 10,
      peakDifficulty,
      steadyStateDifficulty,
      byQuestionType,
      weakAreas,
      strongAreas,
      difficultyPath,
    });
  } catch (error) {
    console.error("Error in diagnostic/vr/complete:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
