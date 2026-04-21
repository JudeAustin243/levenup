import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const topicId = searchParams.get("topicId");

    if (!slug || !topicId) {
      return NextResponse.json(
        { error: "Missing slug or topicId" },
        { status: 400 }
      );
    }

    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        subject: true,
        questions: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Shuffle questions
    const shuffled = [...topic.questions].sort(() => Math.random() - 0.5);

    return NextResponse.json({
      topicName: topic.name,
      subjectName: topic.subject.name,
      subjectSlug: topic.subject.slug,
      questions: shuffled.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
