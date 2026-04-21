"use client";

interface ScheduleCardProps {
  subject: string;
  topic: string;
  durationMins: number;
  questionCount: number;
  focus: string;
  completed?: boolean;
  onStart?: () => void;
}

const SUBJECT_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  Maths: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  English: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Verbal Reasoning": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Non-Verbal Reasoning": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

export default function ScheduleCard({
  subject,
  topic,
  durationMins,
  questionCount,
  focus,
  completed = false,
  onStart,
}: ScheduleCardProps) {
  const colours = SUBJECT_COLOURS[subject] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        completed
          ? "bg-gray-50 border-gray-200 opacity-60"
          : `${colours.bg} ${colours.border}`
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colours.bg} ${colours.text}`}
            >
              {subject}
            </span>
            {completed && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Done
              </span>
            )}
          </div>
          <h3 className={`font-semibold ${completed ? "line-through text-gray-400" : "text-gray-900"}`}>
            {topic}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{focus}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
            <span>{durationMins} mins</span>
            <span>{questionCount} questions</span>
          </div>
        </div>
        {!completed && onStart && (
          <button
            onClick={onStart}
            className={`${colours.text} border ${colours.border} px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors`}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
