"use client";

import { motion } from "framer-motion";
import { Coins, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackCardProps {
  tier: string;
  label: string;
  price: number;
  gradient: string;
  weights: Record<string, number>;
  canAfford: boolean;
  onBuy: () => void;
  disabled?: boolean;
}

export default function PackCard({
  tier,
  label,
  price,
  gradient,
  weights,
  canAfford,
  onBuy,
  disabled,
}: PackCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div className={cn("bg-gradient-to-br p-6 text-white text-center", gradient)}>
        <Package className="w-12 h-12 mx-auto mb-2 opacity-90" />
        <h3 className="text-xl font-bold">{label}</h3>
        <p className="text-sm opacity-80">3 Items</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          {Object.entries(weights).map(([rarity, weight]) => (
            <div key={rarity} className="flex justify-between text-sm">
              <span
                className={cn(
                  "font-medium",
                  rarity === "Common" && "text-gray-600",
                  rarity === "Rare" && "text-purple-600",
                  rarity === "Legendary" && "text-amber-600",
                  rarity === "Mythical" && "text-cyan-600"
                )}
              >
                {rarity}
              </span>
              <span className="text-gray-400">{Math.round(weight * 100)}%</span>
            </div>
          ))}
        </div>
        <button
          onClick={onBuy}
          disabled={!canAfford || disabled}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors",
            canAfford && !disabled
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          <Coins className="w-4 h-4" />
          {price.toLocaleString()} Coins
        </button>
      </div>
    </motion.div>
  );
}
