"use client";

import { BookOpen, Divide, Cog, Puzzle } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  maths: Divide,
  english: BookOpen,
  "verbal-reasoning": Cog,
  "non-verbal-reasoning": Puzzle,
};

interface SubjectIconProps {
  slug: string;
  className?: string;
  strokeWidth?: number;
}

export default function SubjectIcon({ slug, className = "w-7 h-7", strokeWidth = 2 }: SubjectIconProps) {
  const Icon = iconMap[slug];
  if (!Icon) return <span className="font-bold text-lg">?</span>;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
