"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  difficulty: number;
  correctAnswers?: number[];
  questionType?: string;
  ageRange?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyJson?: any;
}

interface ReviewItem {
  question: Question;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string | null;
  answerId: string;
  flagged: boolean;
}

interface DiagnosticReport {
  overallScore: number;
  totalCorrect: number;
  totalQuestions: number;
  estimatedAgeRange: string;
  estimatedLevel: number;
  avgDifficulty: number;
  peakDifficulty: number;
  steadyStateDifficulty: number;
  byQuestionType: Array<{
    questionType: string;
    displayName: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  weakAreas: Array<{
    questionType: string;
    displayName: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  strongAreas: Array<{
    questionType: string;
    displayName: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
  difficultyPath: number[];
}

const TOTAL_QUESTIONS = 50;

function getNextQuestion(
  difficulty: number,
  pool: Record<string, Question[]>,
  usedIds: Set<string>
): Question | null {
  // Try exact difficulty
  const available = pool[String(difficulty)]?.filter((q) => !usedIds.has(q.id)) || [];
  if (available.length > 0) return available[0];

  // Fallback: search adjacent difficulties
  for (let offset = 1; offset <= 5; offset++) {
    const higher = pool[String(difficulty + offset)]?.filter((q) => !usedIds.has(q.id)) || [];
    if (higher.length > 0) return higher[0];
    const lower = pool[String(difficulty - offset)]?.filter((q) => !usedIds.has(q.id)) || [];
    if (lower.length > 0) return lower[0];
  }

  return null;
}

export default function VRDiagnosticPage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "results">("intro");
  const [sessionId, setSessionId] = useState("");
  const [questionPool, setQuestionPool] = useState<Record<string, Question[]>>({});
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [showReview, setShowReview] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");

  // Answer state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [wordLadderAnswer1, setWordLadderAnswer1] = useState("");
  const [wordLadderAnswer2, setWordLadderAnswer2] = useState("");
  const [questionStart, setQuestionStart] = useState(Date.now());

  const router = useRouter();

  async function startDiagnostic() {
    setStarting(true);
    try {
      const res = await fetch("/api/diagnostic/vr/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to start diagnostic");
        setStarting(false);
        return;
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setQuestionPool(data.questionPool);

      // Store in localStorage for resume capability
      localStorage.setItem(
        `vr_diagnostic_${data.sessionId}`,
        JSON.stringify({ questionPool: data.questionPool })
      );

      // Pick first question at difficulty 3
      const firstQ = getNextQuestion(3, data.questionPool, new Set());
      if (!firstQ) {
        alert("Not enough questions available");
        setStarting(false);
        return;
      }

      setCurrentQuestion(firstQ);
      setUsedQuestionIds(new Set([firstQ.id]));
      initAnswerState(firstQ);
      setStartTime(Date.now());
      setPhase("quiz");
    } catch {
      alert("Failed to start diagnostic");
    }
    setStarting(false);
  }

  function initAnswerState(q: Question) {
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setTypedAnswer("");
    setWordLadderAnswer1("");
    setWordLadderAnswer2("");
    setOrderedWords(q.questionType === "alphabetical_order" ? [...q.options] : []);
    setQuestionStart(Date.now());
  }

  async function submitAnswer() {
    if (!currentQuestion || submitting) return;
    const q = currentQuestion;

    const isAlphabeticalOrder = q.questionType === "alphabetical_order";
    const isWordLadder = q.questionType === "word_ladder";
    const isWordSwap = q.questionType === "word_swap";
    const isTyped = q.options.length === 0 && !isWordLadder;
    const isMultiSelect =
      q.correctAnswers &&
      q.correctAnswers.length > 1 &&
      q.questionType !== "alphabet_series" &&
      !isWordSwap &&
      !isAlphabeticalOrder;

    const numberOfBlanks = isWordLadder && (q.ageRange === "6-7" || q.ageRange === "7-8") ? 1 : 2;

    // Validation
    if (isAlphabeticalOrder && orderedWords.length === 0) return;
    if (isWordLadder) {
      if (numberOfBlanks === 1 && wordLadderAnswer1.trim() === "") return;
      if (numberOfBlanks === 2 && (wordLadderAnswer1.trim() === "" || wordLadderAnswer2.trim() === "")) return;
    }
    if (isWordSwap && selectedAnswers.length !== 2) return;
    if (isTyped && typedAnswer.trim() === "") return;
    if (isMultiSelect && selectedAnswers.length === 0) return;
    if (!isAlphabeticalOrder && !isWordLadder && !isWordSwap && !isTyped && !isMultiSelect && selectedAnswer === null) return;

    setSubmitting(true);
    const timeTakenMs = Date.now() - questionStart;

    let submittedAnswers;
    if (isAlphabeticalOrder) {
      submittedAnswers = orderedWords.map((word) => q.options.indexOf(word));
    }

    let submittedTypedAnswer;
    if (isTyped) {
      submittedTypedAnswer = typedAnswer.trim().toLowerCase();
    } else if (isWordLadder) {
      submittedTypedAnswer =
        numberOfBlanks === 1
          ? wordLadderAnswer1.trim().toLowerCase()
          : `${wordLadderAnswer1.trim().toLowerCase()},${wordLadderAnswer2.trim().toLowerCase()}`;
    }

    try {
      const res = await fetch("/api/practice/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: q.id,
          selectedAnswer:
            isMultiSelect || isAlphabeticalOrder || isTyped || isWordLadder ? undefined : selectedAnswer,
          selectedAnswers: isAlphabeticalOrder
            ? submittedAnswers
            : isMultiSelect
            ? selectedAnswers
            : undefined,
          typedAnswer: submittedTypedAnswer,
          timeTakenMs,
          flagged: false,
        }),
      });

      const data = await res.json();
      const isCorrect = data.isCorrect;

      // Build user answer description for review
      let userAnswerStr = "";
      if (isAlphabeticalOrder) {
        userAnswerStr = orderedWords.join(", ");
      } else if (isWordLadder) {
        userAnswerStr = numberOfBlanks === 1 ? wordLadderAnswer1 : `${wordLadderAnswer1}, ${wordLadderAnswer2}`;
      } else if (isTyped) {
        userAnswerStr = typedAnswer;
      } else if (isMultiSelect || isWordSwap) {
        userAnswerStr = selectedAnswers.map((i) => q.options[i]).join(", ");
      } else if (selectedAnswer !== null) {
        userAnswerStr = q.options[selectedAnswer] || String(selectedAnswer);
      }

      let correctAnswerStr = "";
      if (isAlphabeticalOrder || isMultiSelect) {
        const ca = data.correctAnswers as number[];
        if (isAlphabeticalOrder) {
          correctAnswerStr = ca.map((i) => q.options[i]).join(", ");
        } else {
          correctAnswerStr = ca.map((i) => q.options[i]).join(", ");
        }
      } else if (isTyped || isWordLadder) {
        correctAnswerStr = String(data.correctAnswers || "");
      } else {
        correctAnswerStr = q.options[data.correctAnswer] || String(data.correctAnswer);
      }

      // Track for review
      setReviewItems((prev) => [
        ...prev,
        {
          question: q,
          isCorrect,
          userAnswer: userAnswerStr,
          correctAnswer: correctAnswerStr,
          explanation: data.explanation || null,
          answerId: data.answerId || "",
          flagged: false,
        },
      ]);

      // Update score
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));

      // Adaptive difficulty
      const newDifficulty = isCorrect
        ? Math.min(6, currentDifficulty + 1)
        : Math.max(1, currentDifficulty - 1);
      setCurrentDifficulty(newDifficulty);

      const newAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newAnswered);

      if (newAnswered >= TOTAL_QUESTIONS) {
        // Complete the diagnostic
        completeDiagnostic();
      } else {
        // Pick next question
        const newUsed = new Set(usedQuestionIds);
        newUsed.add(q.id);
        setUsedQuestionIds(newUsed);

        const nextQ = getNextQuestion(newDifficulty, questionPool, newUsed);
        if (!nextQ) {
          completeDiagnostic();
        } else {
          setCurrentQuestion(nextQ);
          initAnswerState(nextQ);
        }
      }
    } catch {
      alert("Failed to submit answer");
    }
    setSubmitting(false);
  }

  async function completeDiagnostic() {
    setCompleting(true);
    try {
      const res = await fetch("/api/diagnostic/vr/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data);
        localStorage.removeItem(`vr_diagnostic_${sessionId}`);
      }
    } catch {
      console.error("Failed to complete diagnostic");
    }
    setCompleting(false);
    setPhase("results");
  }

  // --- INTRO PHASE ---
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/child/dashboard"
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-8 mt-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">VR Diagnostic Test</h1>
            <p className="text-gray-600 mb-6">
              Adaptive Verbal Reasoning Assessment
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">50</span>
              <div>
                <p className="font-medium text-gray-900">Questions</p>
                <p className="text-sm text-gray-500">
                  Drawn from the full VR question bank across all question types
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">~30</span>
              <div>
                <p className="font-medium text-gray-900">Minutes</p>
                <p className="text-sm text-gray-500">
                  No time limit per question — work at your own pace
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Adaptive Difficulty</p>
                <p className="text-sm text-gray-500">
                  Questions get harder when you answer correctly and easier when you don&apos;t
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Detailed Report</p>
                <p className="text-sm text-gray-500">
                  Get your estimated VR age range, weak areas, and personalised recommendations
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 text-center mb-4">
            You won&apos;t see feedback during the test. Your results will be shown at the end.
          </p>

          <button
            onClick={startDiagnostic}
            disabled={starting}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {starting ? "Preparing..." : "Begin VR Diagnostic"}
          </button>
        </div>
      </div>
    );
  }

  // --- RESULTS PHASE ---
  if (phase === "results") {
    if (completing || !report) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Generating your report...</p>
        </div>
      );
    }

    const pct = report.overallScore;
    const levelLabels: Record<number, string> = {
      1: "Beginner (Age 6-7)",
      2: "Developing (Age 7-8)",
      3: "Intermediate (Age 8-9)",
      4: "Proficient (Age 9-10)",
      5: "Advanced (Age 10-11)",
      6: "Expert (11+ Ready)",
    };

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">VR Diagnostic Results</h1>

        {/* Score Overview */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-center">
          <div className="text-5xl mb-2">{pct >= 80 ? "\ud83c\udf1f" : pct >= 60 ? "\ud83d\udc4d" : "\ud83d\udcaa"}</div>
          <div className={`text-5xl font-bold mb-2 ${pct >= 70 ? "text-green-600" : pct >= 50 ? "text-amber-600" : "text-red-500"}`}>
            {pct}%
          </div>
          <p className="text-gray-500 mb-4">
            {report.totalCorrect} out of {report.totalQuestions} correct
          </p>
          <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3">
            <p className="text-sm text-green-700 font-medium">Estimated VR Age Range</p>
            <p className="text-2xl font-bold text-green-800">{report.estimatedAgeRange}</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.estimatedLevel}</p>
            <p className="text-xs text-gray-500">Estimated Level</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.peakDifficulty}</p>
            <p className="text-xs text-gray-500">Peak Difficulty</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.steadyStateDifficulty}</p>
            <p className="text-xs text-gray-500">Steady State</p>
          </div>
        </div>

        {/* Difficulty Progression */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Difficulty Progression</h2>
          <p className="text-sm text-gray-500 mb-3">
            How the difficulty changed across your {report.difficultyPath.length} questions
          </p>
          <div className="flex items-end gap-0.5 h-24">
            {report.difficultyPath.map((d, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all"
                style={{
                  height: `${(d / 6) * 100}%`,
                  backgroundColor:
                    d <= 2 ? "#86efac" : d <= 3 ? "#fde047" : d <= 4 ? "#fb923c" : d <= 5 ? "#f87171" : "#a855f7",
                }}
                title={`Q${i + 1}: Level ${d}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Q1</span>
            <span>Q{Math.round(report.difficultyPath.length / 2)}</span>
            <span>Q{report.difficultyPath.length}</span>
          </div>
        </div>

        {/* Question Type Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance by Question Type</h2>
          <div className="space-y-3">
            {report.byQuestionType.map((qt) => (
              <div key={qt.questionType} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{qt.displayName}</span>
                    <span
                      className={`text-sm font-semibold ${
                        qt.percentage >= 75 ? "text-green-600" : qt.percentage >= 50 ? "text-amber-600" : "text-red-500"
                      }`}
                    >
                      {qt.correct}/{qt.total} ({qt.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        qt.percentage >= 75 ? "bg-green-500" : qt.percentage >= 50 ? "bg-amber-500" : "bg-red-400"
                      }`}
                      style={{ width: `${qt.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        {report.weakAreas.length > 0 && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Areas to Improve</h2>
            <p className="text-sm text-red-600 mb-3">
              Focus your practice on these question types:
            </p>
            <ul className="space-y-2">
              {report.weakAreas.map((wa) => (
                <li key={wa.questionType} className="flex justify-between text-sm">
                  <span className="text-red-700 font-medium">{wa.displayName}</span>
                  <span className="text-red-500">
                    {wa.correct}/{wa.total} correct ({wa.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strong Areas */}
        {report.strongAreas.length > 0 && (
          <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Your Strengths</h2>
            <ul className="space-y-2">
              {report.strongAreas.map((sa) => (
                <li key={sa.questionType} className="flex justify-between text-sm">
                  <span className="text-green-700 font-medium">{sa.displayName}</span>
                  <span className="text-green-500">
                    {sa.correct}/{sa.total} correct ({sa.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review Answers */}
        {reviewItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 mb-6 overflow-hidden">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold text-gray-900">Review Answers</h2>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showReview ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showReview && (
              <div className="px-6 pb-6">
                {/* Filter tabs */}
                <div className="flex gap-2 mb-4">
                  {(["all", "incorrect", "flagged"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setReviewFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        reviewFilter === f
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {f === "all"
                        ? `All (${reviewItems.length})`
                        : f === "incorrect"
                        ? `Incorrect (${reviewItems.filter((r) => !r.isCorrect).length})`
                        : `Flagged (${reviewItems.filter((r) => r.flagged).length})`}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {reviewItems
                    .map((item, idx) => ({ ...item, num: idx + 1 }))
                    .filter((item) =>
                      reviewFilter === "all"
                        ? true
                        : reviewFilter === "incorrect"
                        ? !item.isCorrect
                        : item.flagged
                    )
                    .map((item) => (
                      <div
                        key={item.num}
                        className={`rounded-xl border p-4 ${
                          item.isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">Q{item.num}</span>
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                item.isCorrect
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                            {item.question.questionType && (
                              <span className="text-xs text-gray-400">
                                {item.question.questionType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              const newFlagged = !item.flagged;
                              setReviewItems((prev) =>
                                prev.map((r, i) =>
                                  i === item.num - 1 ? { ...r, flagged: newFlagged } : r
                                )
                              );
                              if (item.answerId) {
                                await fetch("/api/practice/flag", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ answerId: item.answerId, flagged: newFlagged }),
                                });
                              }
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.flagged
                                ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                                : "text-gray-300 hover:text-amber-400 hover:bg-gray-100"
                            }`}
                            title={item.flagged ? "Unflag question" : "Flag question"}
                          >
                            <svg className="w-5 h-5" fill={item.flagged ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                          </button>
                        </div>

                        <p className="text-sm text-gray-800 mb-3 whitespace-pre-line">{item.question.questionText}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Your answer:</span>
                            <p className={`font-medium ${item.isCorrect ? "text-green-700" : "text-red-600"}`}>
                              {item.userAnswer || "—"}
                            </p>
                          </div>
                          {!item.isCorrect && (
                            <div>
                              <span className="text-xs font-medium text-gray-500">Correct answer:</span>
                              <p className="font-medium text-green-700">{item.correctAnswer || "—"}</p>
                            </div>
                          )}
                        </div>

                        {item.explanation && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-xs font-medium text-gray-500">Explanation:</span>
                            <p className="text-sm text-gray-700 mt-0.5">{item.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/child/dashboard")}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setPhase("intro");
              setQuestionsAnswered(0);
              setScore({ correct: 0, total: 0 });
              setCurrentDifficulty(3);
              setUsedQuestionIds(new Set());
              setReport(null);
              setReviewItems([]);
              setShowReview(false);
            }}
            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
          >
            Retake Diagnostic
          </button>
        </div>
      </div>
    );
  }

  // --- QUIZ PHASE ---
  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading question...</p>
      </div>
    );
  }

  const q = currentQuestion;
  const isAlphabeticalOrder = q.questionType === "alphabetical_order";
  const isWordLadder = q.questionType === "word_ladder";
  const isWordSwap = q.questionType === "word_swap";
  const isTyped = q.options.length === 0 && !isWordLadder;
  const isMultiSelect =
    q.correctAnswers &&
    q.correctAnswers.length > 1 &&
    q.questionType !== "alphabet_series" &&
    !isWordSwap &&
    !isAlphabeticalOrder;
  const is2Column =
    (q.questionType === "opposite_meaning" ||
      q.questionType === "similar_meaning" ||
      q.questionType === "compound_words" ||
      q.questionType === "sentence_completion_analogies") &&
    q.options.length === 6;
  const numberOfBlanks = isWordLadder && (q.ageRange === "6-7" || q.ageRange === "7-8") ? 1 : 2;

  // Determine if submit button should be disabled
  const submitDisabled =
    submitting ||
    (isAlphabeticalOrder
      ? orderedWords.length === 0
      : isWordLadder
      ? numberOfBlanks === 1
        ? wordLadderAnswer1.trim() === ""
        : wordLadderAnswer1.trim() === "" || wordLadderAnswer2.trim() === ""
      : isWordSwap
      ? selectedAnswers.length !== 2
      : isTyped
      ? typedAnswer.trim() === ""
      : isMultiSelect
      ? selectedAnswers.length === 0
      : selectedAnswer === null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-4">
        <span className="text-xs text-gray-500">VR Diagnostic</span>
        <div className="text-sm text-gray-700 font-medium">
          Question {questionsAnswered + 1} of {TOTAL_QUESTIONS}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-green-600 h-1.5 rounded-full transition-all"
          style={{ width: `${((questionsAnswered + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <p className="text-lg font-medium text-gray-900 mb-5 whitespace-pre-line">
          {isWordLadder ? q.questionText.split("\n\n")[0] : q.questionText}
        </p>

        {/* Hints */}
        {isMultiSelect && (
          <p className="text-sm text-indigo-600 font-medium mb-4">
            {is2Column ? "Select one word from each column" : `Select ${q.correctAnswers!.length} answers`}
          </p>
        )}
        {isAlphabeticalOrder && (
          <p className="text-sm text-indigo-600 font-medium mb-4">
            Drag the words to arrange them in alphabetical order
          </p>
        )}
        {isTyped && (
          <p className="text-sm text-indigo-600 font-medium mb-4">Type your answer below</p>
        )}

        {/* Render question based on type */}
        {q.options.length === 0 ? (
          isWordLadder ? (
            // Word ladder
            (() => {
              const questionParts = q.questionText.split("\n\n");
              const wordLadderLine = questionParts[questionParts.length - 1] || "";
              const match = wordLadderLine.match(
                /^([A-Z]+)\s+\(\s*[_\s]+\)(?:\s+\(\s*[_\s]+\))?\s+([A-Z]+)$/
              );

              if (match) {
                return (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <span className="text-2xl font-bold text-gray-800">{match[1]}</span>
                    <input
                      type="text"
                      value={wordLadderAnswer1}
                      onChange={(e) => setWordLadderAnswer1(e.target.value)}
                      maxLength={10}
                      placeholder="____"
                      className="w-32 px-4 py-2 text-center rounded-lg border-2 border-indigo-300 transition-all focus:outline-none focus:border-indigo-500 text-lg font-medium"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !submitDisabled) submitAnswer();
                      }}
                    />
                    {numberOfBlanks === 2 && (
                      <input
                        type="text"
                        value={wordLadderAnswer2}
                        onChange={(e) => setWordLadderAnswer2(e.target.value)}
                        maxLength={10}
                        placeholder="____"
                        className="w-32 px-4 py-2 text-center rounded-lg border-2 border-indigo-300 transition-all focus:outline-none focus:border-indigo-500 text-lg font-medium"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !submitDisabled) submitAnswer();
                        }}
                      />
                    )}
                    <span className="text-2xl font-bold text-gray-800">{match[2]}</span>
                  </div>
                );
              }
              return null;
            })()
          ) : (
            // Text input for typed answers
            <input
              type="text"
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              maxLength={15}
              placeholder="Type your answer here..."
              className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 transition-all focus:outline-none focus:border-indigo-500 text-lg"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !submitDisabled) submitAnswer();
              }}
            />
          )
        ) : isAlphabeticalOrder ? (
          // Drag-and-drop ordering
          <div className="space-y-3">
            {orderedWords.map((word, idx) => (
              <div
                key={`${word}-${idx}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", idx.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedIdx = parseInt(e.dataTransfer.getData("text/plain"));
                  if (draggedIdx !== idx) {
                    const newOrder = [...orderedWords];
                    const draggedItem = newOrder[draggedIdx];
                    newOrder.splice(draggedIdx, 1);
                    newOrder.splice(idx, 0, draggedItem);
                    setOrderedWords(newOrder);
                  }
                }}
                className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white cursor-move hover:border-gray-300 active:opacity-50 transition-all"
              >
                <div className="flex items-center">
                  <span className="mr-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </span>
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{word}</span>
                </div>
              </div>
            ))}
          </div>
        ) : isWordSwap ? (
          // Word swap
          <div>
            <p className="text-sm text-indigo-600 font-medium mb-4">
              Click on the two words that should be swapped
            </p>
            <div className="flex flex-wrap gap-2">
              {(q.options as string[]).map((word: string, idx: number) => {
                const isSelected = selectedAnswers.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedAnswers((prev) => {
                        if (prev.includes(idx)) return prev.filter((i) => i !== idx);
                        if (prev.length < 2) return [...prev, idx];
                        return [prev[1], idx];
                      });
                    }}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-medium cursor-pointer ${
                      isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        ) : is2Column ? (
          // 2-column layout
          <div className="grid grid-cols-2 gap-6">
            {[0, 3].map((startIdx) => (
              <div key={startIdx} className="space-y-3">
                {(q.options as string[]).slice(startIdx, startIdx + 3).map((option: string, localIdx: number) => {
                  const idx = startIdx + localIdx;
                  const isSelected = isMultiSelect ? selectedAnswers.includes(idx) : selectedAnswer === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isMultiSelect) {
                          setSelectedAnswers((prev) => {
                            const withoutColumn = prev.filter((i) =>
                              startIdx === 0 ? i > 2 : i < 3
                            );
                            return prev.includes(idx) ? withoutColumn : [...withoutColumn, idx];
                          });
                        } else {
                          setSelectedAnswer(idx);
                        }
                      }}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${
                        isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          // Default MCQ
          <div className="space-y-3">
            {(q.options as string[]).map((option: string, idx: number) => {
              const isMulti = isMultiSelect;
              const isSelected = isMulti ? selectedAnswers.includes(idx) : selectedAnswer === idx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (q.questionType === "alphabet_series") {
                      setSelectedAnswer(idx);
                      setSelectedAnswers([]);
                    } else if (isMulti) {
                      const maxSelect = q.correctAnswers!.length;
                      setSelectedAnswers((prev) => {
                        if (prev.includes(idx)) return prev.filter((i) => i !== idx);
                        if (prev.length < maxSelect) return [...prev, idx];
                        // At max: drop oldest, add new
                        return [...prev.slice(1), idx];
                      });
                    } else {
                      setSelectedAnswer(idx);
                    }
                  }}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all ${
                    isSelected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold text-gray-600 mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={submitAnswer}
        disabled={submitDisabled}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Answer"}
      </button>
    </div>
  );
}
