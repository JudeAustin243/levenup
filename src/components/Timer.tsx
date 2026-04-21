"use client";

import { useState, useEffect, useCallback } from "react";

interface TimerProps {
  isRunning: boolean;
  onTimeUp?: () => void;
  durationSeconds?: number;
}

export default function Timer({
  isRunning,
  onTimeUp,
  durationSeconds,
}: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  const handleTimeUp = useCallback(() => {
    onTimeUp?.();
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (durationSeconds && next >= durationSeconds) {
          handleTimeUp();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, durationSeconds, handleTimeUp]);

  const remaining = durationSeconds ? durationSeconds - elapsed : elapsed;
  const minutes = Math.floor(Math.abs(remaining) / 60);
  const seconds = Math.abs(remaining) % 60;

  const isLow = durationSeconds ? remaining <= 30 : false;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono ${
        isLow
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
