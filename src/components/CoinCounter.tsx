"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Coins } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CoinCounterProps {
  coins: number;
  className?: string;
}

export default function CoinCounter({ coins, className }: CoinCounterProps) {
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [gained, setGained] = useState(0);
  const prevCoins = useRef(coins);

  useEffect(() => {
    if (coins === prevCoins.current) return;
    const diff = coins - prevCoins.current;
    prevCoins.current = coins;

    if (diff > 0) {
      setGained(diff);
      // Animate counting up
      const steps = Math.min(20, diff);
      const stepSize = Math.ceil(diff / steps);
      let current = displayCoins;
      const interval = setInterval(() => {
        current += stepSize;
        if (current >= coins) {
          setDisplayCoins(coins);
          clearInterval(interval);
        } else {
          setDisplayCoins(current);
        }
      }, 30);

      // Clear the +N after animation
      const timeout = setTimeout(() => setGained(0), 1500);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      setDisplayCoins(coins);
    }
  }, [coins]);

  return (
    <motion.div
      className={`relative flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full ${className ?? ""}`}
      animate={gained > 0 ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Coins className="w-5 h-5 text-amber-500" />
      <span className="font-bold text-amber-700 tabular-nums">
        {displayCoins.toLocaleString()}
      </span>
      <AnimatePresence>
        {gained > 0 && (
          <motion.span
            key={gained}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -24 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute -top-5 right-0 text-amber-500 font-bold text-sm"
          >
            +{gained}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
