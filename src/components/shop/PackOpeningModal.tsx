"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import RarityBadge from "./RarityBadge";
import { cn } from "@/lib/utils";

interface PackItem {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Legendary" | "Mythical";
  layer: string;
  imageUrl: string;
  coinValue: number;
  isDuplicate: boolean;
}

interface PackOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PackItem[];
  packTier: string;
  duplicateRebate: number;
}

// FIFA 13-style stages:
// 1. pack      – Minimalist gold card pack on dark UI
// 2. burst     – White light explosion, transition to stadium
// 3. stadium   – 3D night stadium with floodlights, hero card revealed center-stage
// 4. fanout    – Cards fan out horizontally from behind the hero card
// 5. summary   – All items displayed in a grid
type Stage = "pack" | "burst" | "stadium" | "fanout" | "summary";

const RARITY_COLOR = {
  Common: { glow: "#9CA3AF", bg: "from-gray-600 to-gray-800", text: "text-gray-300", accent: "#6B7280" },
  Rare: { glow: "#A855F7", bg: "from-purple-700 to-purple-900", text: "text-purple-300", accent: "#A855F7" },
  Legendary: { glow: "#EAB308", bg: "from-amber-500 to-amber-700", text: "text-amber-300", accent: "#EAB308" },
  Mythical: { glow: "#06B6D4", bg: "from-cyan-600 to-cyan-900", text: "text-cyan-300", accent: "#06B6D4" },
};

const PACK_GRADIENT = {
  Gold: "from-yellow-400 via-amber-300 to-yellow-500",
  Silver: "from-gray-300 via-slate-200 to-gray-400",
  Bronze: "from-amber-600 via-orange-500 to-amber-700",
};

export default function PackOpeningModal({
  isOpen,
  onClose,
  items,
  packTier,
  duplicateRebate,
}: PackOpeningModalProps) {
  const [stage, setStage] = useState<Stage>("pack");

  // Sort so rarest is the "hero" revealed on the stadium
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const order: Record<string, number> = { Common: 0, Rare: 1, Legendary: 2, Mythical: 3 };
        return order[a.rarity] - order[b.rarity];
      }),
    [items]
  );

  const heroItem = sortedItems[sortedItems.length - 1];
  const heroColors = heroItem ? RARITY_COLOR[heroItem.rarity] : RARITY_COLOR.Common;

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      setStage("pack");
    }
  }, [isOpen]);

  // Stage progression timers
  useEffect(() => {
    if (!isOpen || !heroItem) return;

    let timer: NodeJS.Timeout;

    switch (stage) {
      case "pack":
        // Wait for user tap/click — handled by onClick
        break;
      case "burst":
        timer = setTimeout(() => setStage("stadium"), 1200);
        break;
      case "stadium":
        timer = setTimeout(() => setStage("fanout"), 3000);
        break;
      case "fanout":
        timer = setTimeout(() => setStage("summary"), 3500);
        break;
    }

    return () => clearTimeout(timer);
  }, [isOpen, stage, heroItem]);

  if (!isOpen || !heroItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
      >
        {/* ═══════════════════════════════════════════
            STAGE 1: PACK — Minimalist gold card pack on dark slate UI
            Click/tap to open
            ═══════════════════════════════════════════ */}
        {stage === "pack" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setStage("burst")}
          >
            {/* Subtle dark gradient background — slate metallic feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black" />

            {/* Faint radial glow behind the pack */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full"
              style={{
                background: `radial-gradient(circle, ${heroColors.glow}15 0%, transparent 70%)`,
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* The pack card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Metallic card pack with glossy sheen */}
                <div
                  className={cn(
                    "w-48 h-64 rounded-2xl bg-gradient-to-br flex flex-col items-center justify-center border-2 relative overflow-hidden shadow-2xl",
                    PACK_GRADIENT[packTier as keyof typeof PACK_GRADIENT] || PACK_GRADIENT.Gold,
                    packTier === "Gold"
                      ? "border-yellow-300/60"
                      : packTier === "Silver"
                      ? "border-gray-300/60"
                      : "border-amber-400/60"
                  )}
                >
                  {/* Glossy sheen effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                    }}
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="text-5xl mb-3">⚡</div>
                    <p className="font-black text-lg text-white drop-shadow-lg tracking-wide">
                      {packTier}
                    </p>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-widest mt-1">
                      Pack
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Tap to open hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="relative z-10 mt-8 text-slate-500 text-sm font-medium tracking-widest uppercase"
            >
              Tap to open
            </motion.p>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STAGE 2: BURST — White light explosion
            ═══════════════════════════════════════════ */}
        {stage === "burst" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black" />

            {/* Central white flash expanding */}
            <motion.div
              className="absolute"
              style={{
                background: `radial-gradient(circle, white 0%, ${heroColors.glow}60 25%, transparent 60%)`,
              }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{
                width: ["0px", "1200px"],
                height: ["0px", "1200px"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 1.0, ease: "easeOut" }}
            />

            {/* Light rays shooting out from center */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: "3px",
                    height: "600px",
                    background: `linear-gradient(to bottom, transparent, white 40%, ${heroColors.glow}80 60%, transparent)`,
                    transformOrigin: "center center",
                    rotate: `${angle}deg`,
                  }}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0, 1, 0], scaleY: [0, 1.5, 0] }}
                  transition={{ duration: 0.8, delay: 0.1 + (i % 3) * 0.05 }}
                />
              );
            })}

            {/* Particle shards */}
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const distance = 150 + Math.random() * 400;
              return (
                <motion.div
                  key={`shard-${i}`}
                  className="absolute w-1.5 h-4 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "white" : heroColors.glow,
                    rotate: `${Math.random() * 360}deg`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 + Math.random() * 0.15 }}
                />
              );
            })}

            {/* Screen flash to white then fade */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.0, times: [0, 0.3, 1] }}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STAGE 3: STADIUM — 3D night stadium with hero card
            Floodlights, lens flare, dramatic reveal
            ═══════════════════════════════════════════ */}
        {stage === "stadium" && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Night sky / stadium backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950" />

            {/* Stadium pitch floor gradient */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3"
              style={{
                background: "linear-gradient(to top, #0a3d0a 0%, #0d4f0d 30%, transparent 100%)",
              }}
            />

            {/* Pitch lines (subtle) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/3 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/40 -translate-x-px" />
              <div className="absolute left-1/2 top-1/2 -translate-x-12 -translate-y-12 w-24 h-24 border border-white/30 rounded-full" />
            </motion.div>

            {/* Stadium floodlights — 4 towers */}
            {[-0.75, -0.25, 0.25, 0.75].map((pos, i) => (
              <div key={`light-${i}`} className="absolute" style={{ left: `${50 + pos * 80}%`, top: "5%" }}>
                {/* Light source */}
                <motion.div
                  className="w-4 h-4 rounded-full bg-white"
                  style={{ boxShadow: "0 0 40px 20px rgba(255,255,255,0.6)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.8, 1] }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                />
                {/* Light beam cone */}
                <motion.div
                  className="absolute top-2"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "80px solid transparent",
                    borderRight: "80px solid transparent",
                    borderTop: "300px solid rgba(255,255,255,0.04)",
                    filter: "blur(8px)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                />
              </div>
            ))}

            {/* Central spotlight beam on hero card */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2"
              style={{
                width: "200px",
                height: "100%",
                background: `linear-gradient(to bottom, ${heroColors.glow}30 0%, ${heroColors.glow}10 40%, transparent 70%)`,
                filter: "blur(20px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.5, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Lens flare effect */}
            <motion.div
              className="absolute"
              style={{
                top: "10%",
                left: "52%",
                width: "300px",
                height: "4px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                filter: "blur(2px)",
              }}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: [0, 0.8, 0.4], scaleX: [0, 1.5, 1] }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            {/* Secondary lens flare (smaller, offset) */}
            <motion.div
              className="absolute"
              style={{
                top: "12%",
                left: "48%",
                width: "150px",
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${heroColors.glow}80, transparent)`,
                filter: "blur(1px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.3] }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />

            {/* Hero item card — dramatic entrance from below */}
            <motion.div
              initial={{ y: 600, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                damping: 18,
                stiffness: 70,
                delay: 0.4,
              }}
              className="relative z-20"
            >
              {/* Glow behind card */}
              <motion.div
                className="absolute -inset-10 rounded-3xl blur-3xl"
                style={{ background: heroColors.glow }}
                animate={{ opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* The card itself */}
              <div
                className={cn(
                  "relative w-52 h-68 rounded-2xl border-2 p-5 flex flex-col items-center justify-between shadow-2xl",
                  heroItem.rarity === "Mythical"
                    ? "border-cyan-400 bg-gradient-to-b from-cyan-900/95 to-cyan-950/95"
                    : heroItem.rarity === "Legendary"
                    ? "border-amber-400 bg-gradient-to-b from-amber-900/95 to-amber-950/95"
                    : heroItem.rarity === "Rare"
                    ? "border-purple-400 bg-gradient-to-b from-purple-900/95 to-purple-950/95"
                    : "border-slate-400 bg-gradient-to-b from-slate-800/95 to-slate-900/95"
                )}
              >
                {/* Metallic sheen on card */}
                <motion.div
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)",
                  }}
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />

                <div className="relative w-full flex-1 mb-3">
                  <Image
                    src={heroItem.imageUrl}
                    alt={heroItem.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
                <div className="text-center relative z-10">
                  <p className="font-black text-lg text-white tracking-wide">
                    {heroItem.name}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <RarityBadge rarity={heroItem.rarity} />
                    <span className="text-xs text-gray-400 capitalize">
                      {heroItem.layer}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Pyro / sparks at base for Rare+ */}
            {heroItem.rarity !== "Common" &&
              [-1, 1].map((side) =>
                Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`pyro-${side}-${i}`}
                    className="absolute bottom-[33%]"
                    style={{ left: `${50 + side * (10 + i * 8)}%` }}
                  >
                    <motion.div
                      className="w-1 rounded-full"
                      style={{
                        background: `linear-gradient(to top, ${heroColors.glow}, white, transparent)`,
                        filter: "blur(1px)",
                      }}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: [0, 60 + i * 20, 30, 70 + i * 15, 0],
                        opacity: [0, 1, 0.8, 1, 0],
                      }}
                      transition={{ duration: 1.8, delay: 0.8 + i * 0.15, ease: "easeOut" }}
                    />
                  </motion.div>
                ))
              )}

            {/* Confetti for Legendary+ */}
            {(heroItem.rarity === "Legendary" || heroItem.rarity === "Mythical") &&
              Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className="absolute w-1.5 h-2.5 rounded-sm"
                  style={{
                    background:
                      heroItem.rarity === "Mythical"
                        ? (i % 4 === 0 ? "#06B6D4" : i % 4 === 1 ? "#0891B2" : i % 4 === 2 ? "#22D3EE" : "white")
                        : (i % 4 === 0 ? "#EAB308" : i % 4 === 1 ? "#F59E0B" : i % 4 === 2 ? "#FBBF24" : "white"),
                    left: `${Math.random() * 100}%`,
                    rotate: `${Math.random() * 360}deg`,
                  }}
                  initial={{ top: "-5%", opacity: 1 }}
                  animate={{
                    top: "110%",
                    opacity: [1, 1, 0],
                    rotate: `${Math.random() * 720}deg`,
                    x: (Math.random() - 0.5) * 200,
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 1.5,
                    delay: 0.5 + Math.random() * 1,
                    ease: "easeIn",
                  }}
                />
              ))}

            {/* Skip button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5 }}
              onClick={() => setStage("fanout")}
              className="absolute bottom-6 text-slate-500 text-sm hover:text-white transition-colors z-30"
            >
              Skip →
            </motion.button>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STAGE 4: FAN-OUT — Cards shuffle out horizontally
            FIFA 13 signature: cards slide from behind hero card
            ═══════════════════════════════════════════ */}
        {stage === "fanout" && (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {/* Dark stadium backdrop (carried over) */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950" />
            <div
              className="absolute bottom-0 left-0 right-0 h-1/3"
              style={{
                background: "linear-gradient(to top, #0a3d0a 0%, #0d4f0d 30%, transparent 100%)",
              }}
            />

            {/* Dim floodlights */}
            {[-0.75, -0.25, 0.25, 0.75].map((pos, i) => (
              <div key={`fl-${i}`} className="absolute" style={{ left: `${50 + pos * 80}%`, top: "5%" }}>
                <div
                  className="w-3 h-3 rounded-full bg-white/60"
                  style={{ boxShadow: "0 0 30px 15px rgba(255,255,255,0.3)" }}
                />
              </div>
            ))}

            {/* Cards container — horizontal fan-out */}
            <div className="relative z-20 flex items-center justify-center">
              {sortedItems.map((item, i) => {
                const colors = RARITY_COLOR[item.rarity];
                const totalCards = sortedItems.length;
                // Spread cards evenly across available width
                const spacing = Math.min(140, 400 / totalCards);
                const centerIndex = (totalCards - 1) / 2;
                const offsetX = (i - centerIndex) * spacing;

                return (
                  <motion.div
                    key={item.id + i}
                    className="absolute"
                    initial={{ x: 0, y: 0, scale: 0.9, opacity: 0 }}
                    animate={{
                      x: offsetX,
                      y: 0,
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 150,
                      delay: i * 0.12,
                    }}
                  >
                    {/* Per-card glow */}
                    {item.rarity !== "Common" && (
                      <motion.div
                        className="absolute -inset-4 rounded-2xl blur-xl"
                        style={{ background: colors.glow }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        transition={{ delay: i * 0.12 + 0.3 }}
                      />
                    )}

                    <div
                      className={cn(
                        "relative w-32 h-44 rounded-xl border-2 p-3 flex flex-col items-center justify-between shadow-xl",
                        item.rarity === "Mythical"
                          ? "border-cyan-400/80 bg-gradient-to-b from-cyan-900/95 to-cyan-950/95"
                          : item.rarity === "Legendary"
                          ? "border-amber-400/80 bg-gradient-to-b from-amber-900/95 to-amber-950/95"
                          : item.rarity === "Rare"
                          ? "border-purple-400/80 bg-gradient-to-b from-purple-900/95 to-purple-950/95"
                          : "border-slate-500/60 bg-gradient-to-b from-slate-800/95 to-slate-900/95"
                      )}
                    >
                      <div className="relative w-full flex-1 mb-1.5">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center w-full">
                        <p className="text-[10px] font-bold text-white truncate">
                          {item.name}
                        </p>
                        <div className="flex justify-center mt-0.5">
                          <RarityBadge rarity={item.rarity} />
                        </div>
                      </div>

                      {item.isDuplicate && (
                        <div className="absolute top-1 right-1 bg-amber-500 text-black text-[8px] font-black px-1 py-0.5 rounded-full">
                          DUP
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Skip/continue button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.5 }}
              onClick={() => setStage("summary")}
              className="absolute bottom-6 text-slate-400 text-sm hover:text-white transition-colors z-30"
            >
              Continue →
            </motion.button>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STAGE 5: SUMMARY — Clean grid of all items
            ═══════════════════════════════════════════ */}
        {stage === "summary" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-950 rounded-2xl p-6 max-w-lg w-full mx-4 relative border border-slate-800"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white text-center mb-1">
              Pack Opened
            </h2>
            <p className="text-slate-500 text-sm text-center mb-5">
              {packTier} Pack — {sortedItems.length} items
            </p>
            <div className="grid grid-cols-3 gap-3">
              {sortedItems.map((item, i) => {
                const colors = RARITY_COLOR[item.rarity];
                return (
                  <motion.div
                    key={item.id + i}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.12, type: "spring", damping: 15 }}
                    className={cn(
                      "relative rounded-xl border p-3 bg-slate-900",
                      item.rarity === "Mythical"
                        ? "border-cyan-500/50"
                        : item.rarity === "Legendary"
                        ? "border-amber-500/50"
                        : item.rarity === "Rare"
                        ? "border-purple-500/50"
                        : "border-slate-700"
                    )}
                  >
                    {item.rarity !== "Common" && (
                      <div
                        className="absolute inset-0 rounded-xl opacity-10"
                        style={{ background: colors.glow }}
                      />
                    )}
                    <div className="relative w-full aspect-[3/4] mb-2">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs font-semibold text-white truncate text-center">
                      {item.name}
                    </p>
                    <div className="flex justify-center mt-1">
                      <RarityBadge rarity={item.rarity} />
                    </div>
                    {item.isDuplicate && (
                      <div className="absolute top-1.5 right-1.5 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        DUP
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
            {duplicateRebate > 0 && (
              <p className="text-center text-sm text-amber-400 font-medium mt-4">
                +{duplicateRebate} coins refunded from duplicates
              </p>
            )}
            <button
              onClick={onClose}
              className="w-full mt-5 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Continue
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
