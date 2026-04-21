export const LAYER_ORDER = [
  "background",
  "body",
  "shirt",
  "pants",
  "shoes",
  "hat",
  "accessory",
  "effect",
] as const;

export type AvatarLayerName = (typeof LAYER_ORDER)[number];

export interface EquippedItem {
  layer: string;
  imageUrl: string;
  name: string;
  rarity: string;
}

export function getLayerZIndex(layer: string): number {
  const index = LAYER_ORDER.indexOf(layer as AvatarLayerName);
  return (index === -1 ? 0 : index) * 10;
}
