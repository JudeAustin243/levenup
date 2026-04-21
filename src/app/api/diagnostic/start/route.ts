import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { selectDiagnosticQuestions } from "@/lib/question-selector";

export async function POST() {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    // Check if diagnostic already exists
    const existing = await prisma.session.findFirst({
      where: { childId, sessionType: "diagnostic" },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Diagnostic assessment has already been taken", sessionId: existing.id },
        { status: 409 }
      );
    }

    const questions = await selectDiagnosticQuestions();

    const diagnosticSession = await prisma.session.create({
      data: {
        childId,
        sessionType: "diagnostic",
      },
    });

    return NextResponse.json({
      sessionId: diagnosticSession.id,
      questions: questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        topicId: q.topicId,
        tags: q.tags,
      })),
      totalQuestions: questions.length,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
