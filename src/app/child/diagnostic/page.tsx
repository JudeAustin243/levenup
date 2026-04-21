"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import HexagonChart from "@/components/HexagonChart";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  difficulty: number;
  topicId: string;
  tags: string[];
}

interface SubjectScore {
  name: string;
  correct: number;
  total: number;
  percentage: number;
}

const AXIS_LABELS: Record<string, string> = {
  mathsReasoning: "Mathematical Reasoning",
  numericalFluency: "Numerical Fluency",
  english: "English Comprehension",
  verbalReasoning: "Verbal Reasoning",
  nonVerbalReasoning: "Non-Verbal Reasoning",
  examTechnique: "Exam Technique & Speed",
};

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeStarted, setTimeStarted] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<{
    overallScore: number;
    totalCorrect: number;
    totalQuestions: number;
    subjectScores: SubjectScore[];
    hexagonScores: Record<string, number>;
  } | null>(null);
  const router = useRouter();

  // Timer
  useEffect(() => {
    if (phase !== "quiz") return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - timeStarted) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  async function startDiagnostic() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/diagnostic/start", { method: "POST" });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 409) {
        setError("You've already completed the diagnostic assessment.");
        return;
      }
      setError(data.error || "Something went wrong");
      return;
    }

    setSessionId(data.sessionId);
    setQuestions(data.questions);
    setTimeStarted(Date.now());
    setPhase("quiz");
  }

  const submitAnswer = useCallback(async () => {
    if (selectedAnswer === null) return;

    const q = questions[currentIdx];
    const timeTakenMs = Date.now() - timeStarted;

    await fetch("/api/diagnostic/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        questionId: q.id,
        selectedAnswer,
        timeTakenMs: Math.min(timeTakenMs, 120000),
      }),
    });

    setSelectedAnswer(null);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Complete diagnostic
      setLoading(true);
      const res = await fetch("/api/diagnostic/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      setLoading(false);
      setResults(data);
      setPhase("results");
    }
  }, [selectedAnswer, currentIdx, questions, sessionId, timeStarted]);

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">&#128203;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Diagnostic Assessment
          </h1>
          <p className="text-gray-500 mb-6">
            This 40-question assessment covers all four subjects: Maths, English,
            Verbal Reasoning, and Non-Verbal Reasoning. It helps us understand your
            starting level and create your personalised study plan.
          </p>
          <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
            <ul className="space-y-2 text-sm text-amber-800">
              <li>&#9679; 40 questions (10 per subject)</li>
              <li>&#9679; Suggested time: about 45 minutes</li>
              <li>&#9679; You cannot go back to change answers</li>
              <li>&#9679; This can only be taken once</li>
              <li>&#9679; Don&apos;t worry about getting everything right!</li>
            </ul>
          </div>
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={startDiagnostic}
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading questions..." : "Begin Assessment"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "quiz" && questions.length > 0) {
    const q = questions[currentIdx];
    const isTimeLow = elapsedSeconds > 40 * 60; // Warning after 40 mins

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm text-gray-500">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          <div className={`text-sm font-mono font-medium ${isTimeLow ? "text-red-500" : "text-gray-500"}`}>
            {formatTime(elapsedSeconds)}
            {isTimeLow && " (time is running on!)"}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-lg font-medium text-gray-900 mb-6">
            {q.questionText}
          </p>
          <div className="space-y-3">
            {(q.options as string[]).map((option: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
                  selectedAnswer === idx
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {currentIdx + 1 < questions.length ? "Next Question" : "Finish Assessment"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "results" && results) {
    const hexagonData = Object.entries(AXIS_LABELS).map(([key, label]) => ({
      axis: label,
      score: results.hexagonScores[key] || 0,
      benchmark: 70,
    }));

    const getLevel = (pct: number) => {
      if (pct >= 80) return { label: "Advanced", colour: "text-green-600" };
      if (pct >= 60) return { label: "Secure", colour: "text-blue-600" };
      if (pct >= 40) return { label: "Developing", colour: "text-amber-600" };
      return { label: "Beginner", colour: "text-red-600" };
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center mb-6">
          <div className="text-5xl mb-3">&#127942;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Assessment Complete!
          </h1>
          <p className="text-gray-500 mb-6">Here&apos;s your starting profile</p>

          <div className="text-5xl font-bold text-indigo-600 mb-2">
            {results.overallScore}%
          </div>
          <p className="text-gray-500">
            {results.totalCorrect} out of {results.totalQuestions} correct
          </p>
        </div>

        {/* Per-subject scores */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {results.subjectScores.map((s) => {
            const level = getLevel(s.percentage);
            return (
              <div key={s.name} className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">{s.percentage}%</span>
                  <span className={`text-xs font-semibold ${level.colour}`}>{level.label}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {s.correct}/{s.total} correct
                </p>
              </div>
            );
          })}
        </div>

        {/* Hexagon */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Skills Profile</h2>
          <HexagonChart scores={hexagonData} />
        </div>

        <button
          onClick={() => router.push("/child/dashboard")}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg"
        >
          Start My Plan
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Computing your results...</p>
      </div>
    );
  }

  return null;
}
