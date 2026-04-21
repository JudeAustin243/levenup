import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const rarityVariants = cva("px-2 py-0.5 rounded-full text-xs font-bold", {
  variants: {
    rarity: {
      Common: "bg-gray-100 text-gray-600",
      Rare: "bg-purple-100 text-purple-700",
      Legendary: "bg-amber-100 text-amber-700",
      Mythical: "bg-cyan-100 text-cyan-700",
    },
  },
  defaultVariants: {
    rarity: "Common",
  },
});

interface RarityBadgeProps {
  rarity: "Common" | "Rare" | "Legendary" | "Mythical";
  className?: string;
}

export default function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span className={cn(rarityVariants({ rarity }), className)}>
      {rarity}
    </span>
  );
}
