import { prisma } from "./db";
import { getCurrentDifficulty } from "./adaptive-difficulty";

interface SelectedQuestion {
  id: string;
  questionText: string;
  options: any;
  correctAnswer: number;
  explanation: string;
  solutionJson: any;
  difficulty: number;
  topicId: string;
  tags: string[];
}

export async function selectPracticeQuestions(
  childId: string,
  topicId: string,
  count: number = 10
): Promise<SelectedQuestion[]> {
  const currentLevel = await getCurrentDifficulty(childId, topicId);

  // Get questions due for spaced repetition first
  const now = new Date();
  const dueForReview = await prisma.answer.findMany({
    where: {
      childId,
      question: { topicId },
      isCorrect: false,
      sm2NextReview: { lte: now },
    },
    include: { question: true },
    orderBy: { sm2NextReview: "asc" },
    take: Math.floor(count / 3), // Up to 1/3 of session from review
  });

  const reviewQuestionIds = new Set(dueForReview.map((a) => a.questionId));
  const reviewQuestions: SelectedQuestion[] = dueForReview.map((a) => ({
    id: a.question.id,
    questionText: a.question.questionText,
    options: a.question.options,
    correctAnswer: a.question.correctAnswer,
    explanation: a.question.explanation,
    solutionJson: a.question.solutionJson,
    difficulty: a.question.difficulty,
    topicId: a.question.topicId,
    tags: a.question.tags,
  }));

  // Get recently answered question IDs to avoid repeats
  const recentlyCorrect = await prisma.answer.findMany({
    where: {
      childId,
      question: { topicId },
      isCorrect: true,
      answeredAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    },
    select: { questionId: true },
  });
  const excludeIds = new Set([
    ...reviewQuestionIds,
    ...recentlyCorrect.map((a) => a.questionId),
  ]);

  // Fetch questions at current difficulty +/- 1
  const remaining = count - reviewQuestions.length;
  const newQuestions = await prisma.question.findMany({
    where: {
      topicId,
      id: { notIn: Array.from(excludeIds) },
      difficulty: {
        gte: Math.max(1, currentLevel - 1),
        lte: Math.min(5, currentLevel + 1),
      },
    },
  });

  // Shuffle and take what we need
  const shuffled = newQuestions.sort(() => Math.random() - 0.5).slice(0, remaining);

  const selected: SelectedQuestion[] = [
    ...reviewQuestions,
    ...shuffled.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      solutionJson: q.solutionJson,
      difficulty: q.difficulty,
      topicId: q.topicId,
      tags: q.tags,
    })),
  ];

  // If we still don't have enough, get any questions from the topic
  if (selected.length < count) {
    const filler = await prisma.question.findMany({
      where: {
        topicId,
        id: { notIn: selected.map((q) => q.id) },
      },
      take: count - selected.length,
    });
    selected.push(
      ...filler.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        solutionJson: q.solutionJson,
        difficulty: q.difficulty,
        topicId: q.topicId,
        tags: q.tags,
      }))
    );
  }

  // Shuffle final set
  return selected.sort(() => Math.random() - 0.5);
}

export async function selectDiagnosticQuestions(): Promise<SelectedQuestion[]> {
  const subjects = await prisma.subject.findMany({
    include: { topics: { include: { questions: true } } },
  });

  const allQuestions: SelectedQuestion[] = [];

  for (const subject of subjects) {
    const subjectQuestions = subject.topics.flatMap((t) =>
      t.questions
        .filter((q) => q.difficulty >= 2 && q.difficulty <= 4)
        .map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          solutionJson: q.solutionJson,
          difficulty: q.difficulty,
          topicId: q.topicId,
          tags: q.tags,
        }))
    );

    // Shuffle and take 10 per subject
    const shuffled = subjectQuestions.sort(() => Math.random() - 0.5);
    allQuestions.push(...shuffled.slice(0, 10));
  }

  // If any subject has fewer than 10, fill with questions from any difficulty
  if (allQuestions.length < 40) {
    for (const subject of subjects) {
      const currentCount = allQuestions.filter((q) =>
        subject.topics.some((t) => t.id === q.topicId)
      ).length;

      if (currentCount < 10) {
        const existingIds = new Set(allQuestions.map((q) => q.id));
        const extra = subject.topics
          .flatMap((t) => t.questions)
          .filter((q) => !existingIds.has(q.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, 10 - currentCount)
          .map((q) => ({
            id: q.id,
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            solutionJson: q.solutionJson,
            difficulty: q.difficulty,
            topicId: q.topicId,
            tags: q.tags,
          }));
        allQuestions.push(...extra);
      }
    }
  }

  return allQuestions.sort(() => Math.random() - 0.5);
}
