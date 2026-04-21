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

    const { sessionId, questionId, selectedAnswer, timeTakenMs } = await request.json();

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        childId,
        selectedAnswer,
        isCorrect,
        timeTakenMs,
        difficultyAtTime: question.difficulty,
      },
    });

    // Update session counters
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        questionsAttempted: { increment: 1 },
        questionsCorrect: isCorrect ? { increment: 1 } : undefined,
      },
    });

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
