export const COIN_REWARDS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 5,
  5: 8,
};

export const STREAK_BONUS_INTERVAL = 5;
export const STREAK_BONUS_AMOUNT = 10;

export function calculateCoinReward(
  difficulty: number,
  consecutiveCorrect: number
): number {
  const base = COIN_REWARDS[difficulty] ?? 3;
  const streakBonus =
    consecutiveCorrect > 0 &&
    consecutiveCorrect % STREAK_BONUS_INTERVAL === 0
      ? STREAK_BONUS_AMOUNT
      : 0;
  return base + streakBonus;
}
