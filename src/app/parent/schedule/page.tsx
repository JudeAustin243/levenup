"use client";

import { useState, useEffect } from "react";
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

interface ChildInfo {
  id: string;
  name: string;
  avatar: string | null;
}

export default function ParentSchedulePage() {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChildId) {
      fetchSchedule(selectedChildId);
    }
  }, [selectedChildId]);

  async function fetchChildren() {
    const res = await fetch("/api/parent/children");
    if (res.ok) {
      const data = await res.json();
      setChildren(
        data.children.map((c: any) => ({
          id: c.id,
          name: c.name,
          avatar: c.avatar,
        }))
      );
      if (data.children.length > 0) {
        setSelectedChildId(data.children[0].id);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }

  async function fetchSchedule(childId: string) {
    setLoading(true);
    const res = await fetch(`/api/schedule?childId=${childId}`);
    const data = await res.json();
    setSchedule(data.schedule);
    setHasSchedule(data.hasSchedule);
    setLoading(false);
  }

  async function generateSchedule() {
    if (!selectedChildId) return;
    setGenerating(true);
    const res = await fetch("/api/schedule/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId: selectedChildId }),
    });
    if (res.ok) {
      await fetchSchedule(selectedChildId);
    }
    setGenerating(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Schedule</h1>
          <p className="text-gray-500 text-sm">
            Manage your child&apos;s weekly study plan
          </p>
        </div>
        <button
          onClick={generateSchedule}
          disabled={generating || !selectedChildId}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {generating
            ? "Generating..."
            : hasSchedule
            ? "Regenerate Schedule"
            : "Generate Schedule"}
        </button>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="flex gap-2 mb-6">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                selectedChildId === child.id
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>{child.avatar || "\ud83c\udf1f"}</span>
              {child.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      ) : children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">
            No children found. Add a child from the dashboard first.
          </p>
        </div>
      ) : !schedule || !schedule.days ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">&#128197;</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Schedule Yet</h2>
          <p className="text-gray-500 mb-4 text-sm">
            Generate an AI-powered study schedule based on your child&apos;s skills profile.
          </p>
          <button
            onClick={generateSchedule}
            disabled={generating}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {generating ? "Creating schedule..." : "Generate Schedule"}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {schedule.days.map((day) => {
            const today = new Date().toISOString().split("T")[0];
            const isToday = day.date === today;
            const totalMins = day.sessions.reduce(
              (sum, s) => sum + s.durationMins,
              0
            );
            return (
              <div key={day.date}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h2
                      className={`text-sm font-semibold ${
                        isToday ? "text-indigo-600" : "text-gray-700"
                      }`}
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
                  <span className="text-xs text-gray-400">{totalMins} mins total</span>
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
