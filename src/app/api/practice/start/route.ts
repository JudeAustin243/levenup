import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { selectPracticeQuestions } from "@/lib/question-selector";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { topicId, topicIds, subjectId, examBoard, ageRange, questionType, timedMode, timeLimitSeconds, isChallenge, difficultyMin, difficultyMax, returnAll } = await request.json();

    // Support both single topicId (legacy) and multiple topicIds with filters
    let topic = null;
    let subject = null;
    let selectedTopicIds: string[] = [];

    if (topicId) {
      // Legacy single topic mode
      topic = await prisma.topic.findUnique({
        where: { id: topicId },
        include: { subject: true },
      });
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }
      subject = topic.subject;
      selectedTopicIds = [topicId];
    } else if (topicIds && topicIds.length > 0) {
      // New multi-topic mode with exam board/age filtering
      const topics = await prisma.topic.findMany({
        where: { id: { in: topicIds } },
        include: { subject: true },
      });
      if (topics.length === 0) {
        return NextResponse.json({ error: "No topics found" }, { status: 404 });
      }
      subject = topics[0].subject;
      selectedTopicIds = topicIds;
    } else if (subjectId) {
      // Subject-level practice (all topics in subject)
      subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: { topics: true },
      });
      if (!subject) {
        return NextResponse.json({ error: "Subject not found" }, { status: 404 });
      }
      selectedTopicIds = subject.topics.map(t => t.id);
    } else {
      return NextResponse.json({ error: "Missing topicId, topicIds, or subjectId" }, { status: 400 });
    }

    const practiceSession = await prisma.session.create({
      data: {
        childId,
        sessionType: "practice",
        subjectId: subject.id,
        topicId: selectedTopicIds[0], // Store first topic for backwards compatibility
        timedMode: timedMode || false,
        timeLimitSeconds: timeLimitSeconds || null,
      },
    });

    // Select questions from all topics, filtered by exam board, age range, and question type
    const questionFilter: any = {
      topicId: { in: selectedTopicIds },
    };
    if (examBoard) questionFilter.examBoard = examBoard;
    if (ageRange) questionFilter.ageRange = ageRange;
    if (questionType) {
      questionFilter.questionType = questionType.includes(",")
        ? { in: questionType.split(",") }
        : questionType;
    }
    // Challenge mode: filter for hard questions only (difficulty >= 6)
    // Regular mode: exclude challenge questions (difficulty < 6)
    // If difficultyMin/Max provided, use that range instead
    if (difficultyMin != null && difficultyMax != null) {
      questionFilter.difficulty = { gte: difficultyMin, lte: difficultyMax };
    } else if (isChallenge) {
      questionFilter.difficulty = { gte: 6 };
    } else {
      questionFilter.difficulty = { lt: 6 };
    }

    const allQuestions = await prisma.question.findMany({
      where: questionFilter,
    });

    // Shuffle questions
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Return all questions if requested, otherwise cap at 10
    const limit = returnAll ? allQuestions.length : Math.min(10, allQuestions.length);
    const selectedQuestions = allQuestions.slice(0, limit);

    if (selectedQuestions.length === 0) {
      return NextResponse.json({ error: "No questions found for this selection" }, { status: 404 });
    }

    const displayName = examBoard && ageRange && questionType
      ? `${examBoard} Ages ${ageRange} - ${questionType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`
      : examBoard && ageRange
      ? `${examBoard} - Ages ${ageRange}`
      : topic?.name || subject.name;

    return NextResponse.json({
      sessionId: practiceSession.id,
      topicName: displayName,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      timedMode: timedMode || false,
      timeLimitSeconds: timeLimitSeconds || null,
      questions: selectedQuestions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        correctAnswers: Array.isArray(q.correctAnswers) ? (q.correctAnswers as number[]) : undefined,
        questionType: q.questionType,
        bodyJson: q.bodyJson || undefined,
      })),
    });
  } catch (error) {
    console.error("Error in practice/start:", error);
    return NextResponse.json({ error: "Something went wrong", details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
