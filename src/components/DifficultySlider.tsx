"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface DifficultySliderProps {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function DifficultySlider({
  min = 1,
  max = 6,
  value,
  onChange,
}: DifficultySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  const steps = max - min;

  const getPositionPercent = (val: number) => ((val - min) / steps) * 100;

  const getValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const raw = min + percent * steps;
      return Math.round(raw);
    },
    [min, steps]
  );

  const handlePointerDown = (thumb: "left" | "right") => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(thumb);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging) return;
      const newVal = getValueFromPosition(e.clientX);
      if (dragging === "left") {
        onChange([Math.min(newVal, value[1]), value[1]]);
      } else {
        onChange([value[0], Math.max(newVal, value[0])]);
      }
    },
    [dragging, value, onChange, getValueFromPosition]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
      };
    }
  }, [dragging, handlePointerMove, handlePointerUp]);

  const handleTrackClick = (e: React.MouseEvent) => {
    const clickVal = getValueFromPosition(e.clientX);
    const distToLeft = Math.abs(clickVal - value[0]);
    const distToRight = Math.abs(clickVal - value[1]);
    if (distToLeft <= distToRight) {
      onChange([Math.min(clickVal, value[1]), value[1]]);
    } else {
      onChange([value[0], Math.max(clickVal, value[0])]);
    }
  };

  const leftPercent = getPositionPercent(value[0]);
  const rightPercent = getPositionPercent(value[1]);

  const labels = Array.from({ length: steps + 1 }, (_, i) => min + i);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-gray-900">Choose difficulty</h3>
          <p className="text-sm text-gray-500">1 = easiest, 6 = hardest</p>
        </div>
        <span className="rounded-full bg-green-50 border border-green-200 px-3 py-1 text-sm font-bold text-green-700">
          {value[0]}–{value[1]}
        </span>
      </div>

      <div className="pt-4 pb-2 px-1">
        <div
          ref={trackRef}
          className="relative h-2 rounded-full bg-gray-200 cursor-pointer select-none"
          onClick={handleTrackClick}
        >
          {/* Active range bar */}
          <div
            className="absolute h-full rounded-full bg-green-500"
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          />

          {/* Left thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-green-500 shadow-md cursor-grab ${
              dragging === "left" ? "cursor-grabbing scale-110" : "hover:scale-110"
            } transition-transform touch-none z-10`}
            style={{ left: `${leftPercent}%` }}
            onPointerDown={handlePointerDown("left")}
          />

          {/* Right thumb */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-green-500 shadow-md cursor-grab ${
              dragging === "right" ? "cursor-grabbing scale-110" : "hover:scale-110"
            } transition-transform touch-none z-10`}
            style={{ left: `${rightPercent}%` }}
            onPointerDown={handlePointerDown("right")}
          />
        </div>

        {/* Labels */}
        <div className="relative mt-3 flex justify-between">
          {labels.map((label) => (
            <span
              key={label}
              className={`text-sm font-semibold ${
                label >= value[0] && label <= value[1]
                  ? "text-green-600"
                  : "text-gray-400"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
