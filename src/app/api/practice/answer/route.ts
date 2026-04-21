import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateDifficulty } from "@/lib/adaptive-difficulty";
import { calculateSM2 } from "@/lib/spaced-repetition";
import { calculateCoinReward } from "@/lib/coins";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const childId = (session?.user as any)?.activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { sessionId, questionId, selectedAnswer, selectedAnswers, typedAnswer, timeTakenMs, flagged } = await request.json();

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Check question type
    const isAlphabeticalOrder = question.questionType === "alphabetical_order";
    const isTyped = question.type === "typed"; // Excludes move_a_letter which is now MCQ

    // Check if this is a multi-select question
    // Exclude alphabet_series, alphabetical_order, and single-answer questions (correctAnswers.length === 1)
    const isMultiSelect =
      question.correctAnswers &&
      Array.isArray(question.correctAnswers) &&
      question.correctAnswers.length > 1 &&
      question.questionType !== "alphabet_series" &&
      !isAlphabeticalOrder;

    let isCorrect: boolean;
    if (isAlphabeticalOrder) {
      // For alphabetical ordering: check exact order match
      const correctAnswersArray = question.correctAnswers as number[];
      const selectedAnswersArray = selectedAnswers || [];

      isCorrect =
        selectedAnswersArray.length === correctAnswersArray.length &&
        selectedAnswersArray.every((ans: number, idx: number) => ans === correctAnswersArray[idx]);
    } else if (isTyped) {
      // For typed answers: compare the typed answer with the correct answer stored in correctAnswers field
      const userAnswer = (typedAnswer || "").toLowerCase().trim();
      const correctAnswerStored = typeof question.correctAnswers === "string"
        ? question.correctAnswers
        : String(question.correctAnswers || "");
      const correctAnswer = correctAnswerStored.toLowerCase().trim();
      isCorrect = userAnswer === correctAnswer;
    } else if (isMultiSelect) {
      // For multi-select: all selected answers must be correct and no others
      const correctAnswersArray = question.correctAnswers as number[];
      const selectedAnswersArray = selectedAnswers || [];

      isCorrect =
        selectedAnswersArray.length === correctAnswersArray.length &&
        selectedAnswersArray.every((ans: number) => correctAnswersArray.includes(ans)) &&
        correctAnswersArray.every((ans: number) => selectedAnswersArray.includes(ans));
    } else {
      // For single-select: just check if selected answer matches
      isCorrect = selectedAnswer === question.correctAnswer;
    }

    // Get previous SM-2 state for this child+question
    const previousAnswer = await prisma.answer.findFirst({
      where: { childId, questionId },
      orderBy: { answeredAt: "desc" },
    });

    const sm2 = calculateSM2(
      isCorrect,
      previousAnswer?.sm2Interval ?? 1,
      previousAnswer?.sm2Easiness ?? 2.5,
      previousAnswer?.sm2Repetitions ?? 0
    );

    const createdAnswer = await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        childId,
        selectedAnswer: isMultiSelect || isAlphabeticalOrder || isTyped ? null : selectedAnswer,
        selectedAnswers: isMultiSelect || isAlphabeticalOrder ? selectedAnswers : undefined,
        typedAnswer: isTyped ? typedAnswer : undefined,
        isCorrect,
        timeTakenMs,
        difficultyAtTime: question.difficulty,
        flagged: flagged || false,
        sm2Interval: sm2.interval,
        sm2Easiness: sm2.easiness,
        sm2Repetitions: sm2.repetitions,
        sm2NextReview: !isCorrect ? sm2.nextReview : null,
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

    // Update adaptive difficulty
    const newLevel = await updateDifficulty(childId, question.topicId, isCorrect);

    // Award coins for correct answers
    let coinsAwarded = 0;
    if (isCorrect) {
      const sessionCorrectCount = await prisma.answer.count({
        where: { sessionId, isCorrect: true },
      });
      coinsAwarded = calculateCoinReward(question.difficulty, sessionCorrectCount);
      await prisma.child.update({
        where: { id: childId },
        data: { coins: { increment: coinsAwarded } },
      });
    }

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.correctAnswer,
      correctAnswers: isMultiSelect || isAlphabeticalOrder || isTyped ? question.correctAnswers : undefined,
      explanation: question.explanation,
      solutionJson: question.solutionJson,
      newDifficultyLevel: newLevel,
      answerId: createdAnswer.id,
      coinsAwarded,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
