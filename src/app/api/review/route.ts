import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const answers = await prisma.answer.findMany({
      where: { childId, flagged: true },
      include: {
        question: {
          include: { topic: { include: { subject: true } } },
        },
      },
      orderBy: { answeredAt: "desc" },
      take: 50,
    });

    const items = answers.map((a) => ({
      id: a.id,
      questionText: a.question.questionText,
      options: a.question.options as string[],
      correctAnswer: a.question.correctAnswer,
      explanation: a.question.explanation,
      flagged: a.flagged,
      lastAnswer: a.selectedAnswer,
      isCorrect: a.isCorrect,
      answeredAt: a.answeredAt.toISOString(),
      topicName: a.question.topic.name,
      subjectName: a.question.topic.subject.name,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
