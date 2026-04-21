import { prisma } from "./db";

export interface AxisScores {
  mathsReasoning: number;
  numericalFluency: number;
  english: number;
  verbalReasoning: number;
  nonVerbalReasoning: number;
  examTechnique: number;
}

export const AXIS_LABELS: Record<keyof AxisScores, string> = {
  mathsReasoning: "Mathematical Reasoning",
  numericalFluency: "Numerical Fluency",
  english: "English Comprehension",
  verbalReasoning: "Verbal Reasoning",
  nonVerbalReasoning: "Non-Verbal Reasoning",
  examTechnique: "Exam Technique & Speed",
};

// Benchmark scores representing a typical grammar school pass threshold
export const BENCHMARK_SCORES: AxisScores = {
  mathsReasoning: 70,
  numericalFluency: 70,
  english: 65,
  verbalReasoning: 65,
  nonVerbalReasoning: 65,
  examTechnique: 60,
};

function getAxisForTags(tags: string[]): (keyof AxisScores)[] {
  const axes: (keyof AxisScores)[] = [];
  if (tags.some((t) => t === "maths_reasoning")) axes.push("mathsReasoning");
  if (tags.some((t) => t === "numerical_fluency")) axes.push("numericalFluency");
  if (tags.some((t) => t === "english")) axes.push("english");
  if (tags.some((t) => t === "verbal_reasoning")) axes.push("verbalReasoning");
  if (tags.some((t) => t === "non_verbal")) axes.push("nonVerbalReasoning");
  return axes;
}

export async function computeHexagonProfile(childId: string): Promise<AxisScores> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get last 300 answers (50 per axis max) with question tags
  const answers = await prisma.answer.findMany({
    where: { childId },
    include: { question: { select: { tags: true } } },
    orderBy: { answeredAt: "desc" },
    take: 300,
  });

  const axisData: Record<keyof AxisScores, { weightedCorrect: number; totalWeight: number }> = {
    mathsReasoning: { weightedCorrect: 0, totalWeight: 0 },
    numericalFluency: { weightedCorrect: 0, totalWeight: 0 },
    english: { weightedCorrect: 0, totalWeight: 0 },
    verbalReasoning: { weightedCorrect: 0, totalWeight: 0 },
    nonVerbalReasoning: { weightedCorrect: 0, totalWeight: 0 },
    examTechnique: { weightedCorrect: 0, totalWeight: 0 },
  };

  let totalTimedCorrect = 0;
  let totalTimedAttempted = 0;
  let totalTimeTaken = 0;
  let answersWithTime = 0;

  for (const answer of answers) {
    const axes = getAxisForTags(answer.question.tags);
    const weight = answer.answeredAt >= sevenDaysAgo ? 2.0 : 1.0;

    for (const axis of axes) {
      const data = axisData[axis];
      if (data.totalWeight < 50 * 2) {
        // Cap at ~50 answers worth of weight
        data.totalWeight += weight;
        if (answer.isCorrect) data.weightedCorrect += weight;
      }
    }

    // Exam technique: track speed and accuracy
    if (answer.timeTakenMs && answer.timeTakenMs > 0) {
      totalTimeTaken += answer.timeTakenMs;
      answersWithTime++;
      totalTimedAttempted++;
      if (answer.isCorrect) totalTimedCorrect++;
    }
  }

  // Calculate axis scores
  const scores: AxisScores = {
    mathsReasoning: 0,
    numericalFluency: 0,
    english: 0,
    verbalReasoning: 0,
    nonVerbalReasoning: 0,
    examTechnique: 0,
  };

  for (const [axis, data] of Object.entries(axisData)) {
    if (axis === "examTechnique") continue;
    scores[axis as keyof AxisScores] =
      data.totalWeight > 0
        ? Math.round((data.weightedCorrect / data.totalWeight) * 100)
        : 0;
  }

  // Exam Technique: combination of accuracy and speed
  if (totalTimedAttempted > 0 && answersWithTime > 0) {
    const accuracyFactor = totalTimedCorrect / totalTimedAttempted;
    const avgTimeMs = totalTimeTaken / answersWithTime;
    // Speed factor: faster is better, baseline 60s per question
    const speedFactor = Math.min(1, Math.max(0.3, 1 - (avgTimeMs - 30000) / 90000));
    scores.examTechnique = Math.round((accuracyFactor * 0.6 + speedFactor * 0.4) * 100);
  }

  return scores;
}

export async function saveHexagonSnapshot(childId: string, scores: AxisScores) {
  return prisma.hexagonProfile.create({
    data: {
      childId,
      axisScores: scores as any,
    },
  });
}

export async function getLatestHexagon(childId: string): Promise<AxisScores | null> {
  const profile = await prisma.hexagonProfile.findFirst({
    where: { childId },
    orderBy: { snapshotDate: "desc" },
  });

  if (!profile) return null;
  return profile.axisScores as unknown as AxisScores;
}

export async function getHexagonHistory(childId: string, weeks: number = 8) {
  const startDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
  return prisma.hexagonProfile.findMany({
    where: { childId, snapshotDate: { gte: startDate } },
    orderBy: { snapshotDate: "asc" },
  });
}
