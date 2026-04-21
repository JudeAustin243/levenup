"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HexagonChartProps {
  scores: {
    axis: string;
    score: number;
    benchmark?: number;
  }[];
  showBenchmark?: boolean;
  height?: number;
}

export default function HexagonChart({
  scores,
  showBenchmark = true,
  height = 350,
}: HexagonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={scores} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontSize: 11, fill: "#6b7280" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "#9ca3af" }}
        />
        <Radar
          name="Your Score"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
        />
        {showBenchmark && (
          <Radar
            name="Target"
            dataKey="benchmark"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.05}
            strokeDasharray="5 5"
            strokeWidth={1.5}
          />
        )}
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
