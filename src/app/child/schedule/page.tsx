"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScheduleCard from "@/components/ScheduleCard";

interface ScheduleSession {
  subject: string;
  topic: string;
  durationMins: number;
  questionCount: number;
  focus: string;
}

interface ScheduleDay {
  dayOfWeek: string;
  date: string;
  sessions: ScheduleSession[];
}

interface ScheduleData {
  days: ScheduleDay[];
}

export default function ChildSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSchedule();
  }, []);

  async function fetchSchedule() {
    setLoading(true);
    const res = await fetch("/api/schedule");
    const data = await res.json();
    setSchedule(data.schedule);
    setHasSchedule(data.hasSchedule);
    setLoading(false);
  }

  async function generateNewSchedule() {
    setGenerating(true);
    const res = await fetch("/api/schedule/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      await fetchSchedule();
    }
    setGenerating(false);
  }

  async function startSession(session: ScheduleSession) {
    // Find the matching topic and start a practice session
    const res = await fetch(`/api/subjects/by-topic?subject=${encodeURIComponent(session.subject)}&topic=${encodeURIComponent(session.topic)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.topicId) {
        const practiceRes = await fetch("/api/practice/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topicId: data.topicId,
            timedMode: false,
          }),
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

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-500 text-sm">Your personalised study plan for the week</p>
        </div>
        <button
          onClick={generateNewSchedule}
          disabled={generating}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {generating ? "Generating..." : hasSchedule ? "Regenerate" : "Generate Schedule"}
        </button>
      </div>

      {!schedule || !schedule.days ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">&#128197;</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Schedule Yet</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Generate a personalised AI study schedule based on your skills profile.
          </p>
          <button
            onClick={generateNewSchedule}
            disabled={generating}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {generating ? "Creating your plan..." : "Generate My Schedule"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {schedule.days.map((day) => {
            const isToday = day.date === today;
            return (
              <div key={day.date}>
                <div className="flex items-center gap-2 mb-3">
                  <h2
                    className={`text-sm font-semibold ${isToday ? "text-indigo-600" : "text-gray-700"}`}
                  >
                    {day.dayOfWeek}
                    {isToday && (
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {new Date(day.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="space-y-2">
                  {day.sessions.map((s, i) => (
                    <ScheduleCard
                      key={i}
                      subject={s.subject}
                      topic={s.topic}
                      durationMins={s.durationMins}
                      questionCount={s.questionCount}
                      focus={s.focus}
                      onStart={() => startSession(s)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
