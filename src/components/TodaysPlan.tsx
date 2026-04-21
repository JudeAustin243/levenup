"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

interface ScheduleSession {
  subject: string;
  topic: string;
  durationMins: number;
  questionCount: number;
  focus: string;
}

const SUBJECT_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  Maths: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  English: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Verbal Reasoning": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Non-Verbal Reasoning": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

export default function TodaysPlan({
  sessions,
  hasDiagnostic,
  hasSchedule,
}: {
  sessions: ScheduleSession[];
  hasDiagnostic: boolean;
  hasSchedule: boolean;
}) {
  const router = useRouter();

  async function startSession(session: ScheduleSession) {
    const res = await fetch(
      `/api/subjects/by-topic?subject=${encodeURIComponent(session.subject)}&topic=${encodeURIComponent(session.topic)}`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.topicId) {
        const practiceRes = await fetch("/api/practice/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topicId: data.topicId, timedMode: false }),
        });
        const practiceData = await practiceRes.json();
        if (practiceRes.ok) {
          localStorage.setItem(
            `session_${practiceData.sessionId}`,
            JSON.stringify({
              questions: practiceData.questions,
              topicName: practiceData.topicName,
              subjectName: practiceData.subjectName,
              timedMode: practiceData.timedMode,
              timeLimitSeconds: practiceData.timeLimitSeconds,
            })
          );
          router.push(`/child/practice/${practiceData.sessionId}`);
        }
      }
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Plan</h2>
        <Link
          href="/child/schedule"
          className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
        >
          Full schedule &rarr;
        </Link>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.map((s, i) => {
            const colours = SUBJECT_COLOURS[s.subject] || {
              bg: "bg-gray-50",
              text: "text-gray-700",
              border: "border-gray-200",
            };

            return (
              <div
                key={i}
                className={`rounded-xl border p-4 ${colours.bg} ${colours.border}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-xs font-semibold ${colours.text}`}
                    >
                      {s.subject}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-0.5">
                      {s.topic}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{s.focus}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                      <span>{s.durationMins} mins</span>
                      <span>{s.questionCount} questions</span>
                    </div>
                  </div>
                  <button
                    onClick={() => startSession(s)}
                    className={`${colours.text} border ${colours.border} px-4 py-2 rounded-lg text-sm font-medium hover:bg-white transition-colors shrink-0 ml-3`}
                  >
                    Start
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-sm">
            {!hasDiagnostic
              ? "Complete the diagnostic to get your personalised schedule."
              : !hasSchedule
                ? "Generate a schedule to see today's plan."
                : "No sessions planned for today. Enjoy your break!"}
          </p>
          {!hasSchedule && hasDiagnostic && (
            <Link
              href="/child/schedule"
              className="inline-block mt-3 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Generate Schedule
            </Link>
          )}
          {!hasDiagnostic && (
            <Link
              href="/child/diagnostic"
              className="inline-block mt-3 bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Start Diagnostic
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
