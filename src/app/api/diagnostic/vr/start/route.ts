import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST() {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Find the Verbal Reasoning subject
    const vrSubject = await prisma.subject.findFirst({
      where: { slug: "verbal-reasoning" },
      include: { topics: true },
    });

    if (!vrSubject || vrSubject.topics.length === 0) {
      return NextResponse.json({ error: "Verbal Reasoning subject not found" }, { status: 404 });
    }

    const topicIds = vrSubject.topics.map((t) => t.id);

    // Get questions the child answered correctly in the last 24 hours (to exclude)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCorrect = await prisma.answer.findMany({
      where: {
        childId,
        isCorrect: true,
        answeredAt: { gte: oneDayAgo },
        question: { topicId: { in: topicIds } },
      },
      select: { questionId: true },
    });
    const excludeIds = new Set(recentCorrect.map((a) => a.questionId));

    // Fetch all VR questions
    const allQuestions = await prisma.question.findMany({
      where: { topicId: { in: topicIds } },
    });

    // Group by difficulty and shuffle, excluding recently answered
    const pool: Record<number, any[]> = {};
    for (let d = 1; d <= 6; d++) pool[d] = [];

    for (const q of allQuestions) {
      if (excludeIds.has(q.id)) continue;
      const d = Math.max(1, Math.min(6, q.difficulty));
      pool[d].push(q);
    }

    // Shuffle each bucket and take up to 15
    for (let d = 1; d <= 6; d++) {
      pool[d] = shuffle(pool[d]).slice(0, 15);
    }

    const totalAvailable = Object.values(pool).reduce((sum, arr) => sum + arr.length, 0);

    if (totalAvailable < 10) {
      return NextResponse.json({ error: "Not enough VR questions available" }, { status: 404 });
    }

    // Create diagnostic session
    const diagnosticSession = await prisma.session.create({
      data: {
        childId,
        sessionType: "diagnostic",
        subjectId: vrSubject.id,
      },
    });

    // Format pool for frontend
    const questionPool: Record<string, any[]> = {};
    for (let d = 1; d <= 6; d++) {
      questionPool[String(d)] = pool[d].map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        correctAnswers: Array.isArray(q.correctAnswers) ? (q.correctAnswers as number[]) : undefined,
        questionType: q.questionType,
        ageRange: q.ageRange,
        bodyJson: q.bodyJson || undefined,
      }));
    }

    return NextResponse.json({
      sessionId: diagnosticSession.id,
      subjectName: "Verbal Reasoning",
      subjectSlug: "verbal-reasoning",
      questionPool,
      totalAvailable,
    });
  } catch (error) {
    console.error("Error in diagnostic/vr/start:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
