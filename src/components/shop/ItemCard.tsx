"use client";

import Image from "next/image";
import RarityBadge from "./RarityBadge";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  name: string;
  rarity: "Common" | "Rare" | "Legendary" | "Mythical";
  layer: string;
  imageUrl: string;
  owned?: boolean;
  equipped?: boolean;
  isDuplicate?: boolean;
  rebateAmount?: number;
  onClick?: () => void;
  className?: string;
}

export default function ItemCard({
  name,
  rarity,
  layer,
  imageUrl,
  owned,
  equipped,
  isDuplicate,
  rebateAmount,
  onClick,
  className,
}: ItemCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative bg-white rounded-xl border p-3 text-left transition-all hover:shadow-md",
        equipped
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-gray-200",
        rarity === "Mythical" && "shadow-[0_0_16px_rgba(8,145,178,0.25)]",
        rarity === "Legendary" && "shadow-[0_0_12px_rgba(234,179,8,0.15)]",
        rarity === "Rare" && "shadow-[0_0_12px_rgba(168,85,247,0.1)]",
        !owned && "opacity-40",
        className
      )}
    >
      <div className="relative w-full aspect-[3/4] bg-gray-50 rounded-lg mb-2 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
      <div className="flex items-center justify-between mt-1">
        <RarityBadge rarity={rarity} />
        <span className="text-xs text-gray-400 capitalize">{layer}</span>
      </div>
      {isDuplicate && rebateAmount != null && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          +{rebateAmount}
        </div>
      )}
      {equipped && (
        <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          Equipped
        </div>
      )}
    </button>
  );
}
