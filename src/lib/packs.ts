export const PACK_CONFIG = {
  Bronze: {
    price: 100,
    itemCount: 3,
    weights: { Common: 0.7, Rare: 0.24, Legendary: 0.05, Mythical: 0.01 },
    gradient: "from-amber-600 to-amber-800",
    label: "Bronze Pack",
  },
  Silver: {
    price: 250,
    itemCount: 3,
    weights: { Common: 0.48, Rare: 0.34, Legendary: 0.15, Mythical: 0.03 },
    gradient: "from-gray-300 to-gray-500",
    label: "Silver Pack",
  },
  Gold: {
    price: 500,
    itemCount: 3,
    weights: { Common: 0.27, Rare: 0.43, Legendary: 0.23, Mythical: 0.07 },
    gradient: "from-yellow-400 to-yellow-600",
    label: "Gold Pack",
  },
} as const;

export type PackTierKey = keyof typeof PACK_CONFIG;

export const DUPLICATE_REBATE_RATE = 0.2;

export function weightedRandomRarity(
  weights: Record<string, number>
): string {
  const rand = Math.random();
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(weights)) {
    cumulative += weight;
    if (rand <= cumulative) return rarity;
  }
  return "Common";
}
