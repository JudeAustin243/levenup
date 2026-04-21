import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const childId = (session.user as any).activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "No child context" }, { status: 400 });
    }

    const subjects = await prisma.subject.findMany({
      include: {
        topics: {
          include: {
            _count: { select: { questions: true } },
          },
        },
      },
    });

    const subjectProgress = await Promise.all(
      subjects.map(async (subject) => {
        const answers = await prisma.answer.findMany({
          where: {
            childId,
            question: { topic: { subjectId: subject.id } },
          },
          orderBy: { answeredAt: "desc" },
          take: 100,
        });
        const correct = answers.filter((a) => a.isCorrect).length;
        const topicIds = new Set(
          await prisma.session
            .findMany({
              where: { childId, subjectId: subject.id, endedAt: { not: null } },
              select: { topicId: true },
            })
            .then((sessions) => sessions.map((s) => s.topicId).filter(Boolean))
        );

        return {
          subjectId: subject.id,
          subjectName: subject.name,
          subjectSlug: subject.slug,
          totalTopics: subject.topics.length,
          topicsCompleted: topicIds.size,
          averageScore:
            answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0,
          totalAttempts: answers.length,
        };
      })
    );

    const recentSessions = await prisma.session.findMany({
      where: { childId, endedAt: { not: null } },
      orderBy: { endedAt: "desc" },
      take: 10,
      include: { subject: true, topic: true },
    });

    return NextResponse.json({
      subjectProgress,
      recentAttempts: recentSessions.map((s) => ({
        id: s.id,
        topicName: s.topic?.name || s.sessionType,
        subjectName: s.subject?.name || "Unknown",
        score: s.questionsCorrect,
        totalQuestions: s.questionsAttempted,
        completedAt: s.endedAt,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
