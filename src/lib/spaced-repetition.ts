export interface SM2Result {
  interval: number;
  easiness: number;
  repetitions: number;
  nextReview: Date;
}

export function calculateSM2(
  isCorrect: boolean,
  previousInterval: number = 1,
  previousEasiness: number = 2.5,
  previousRepetitions: number = 0
): SM2Result {
  const quality = isCorrect ? 4 : 1;

  let easiness =
    previousEasiness +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easiness = Math.max(1.3, easiness);

  let interval: number;
  let repetitions: number;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    repetitions = previousRepetitions + 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(previousInterval * easiness);
  }

  // Cap interval at 60 days
  interval = Math.min(interval, 60);

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { interval, easiness, repetitions, nextReview };
}
