"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { getSubjectColors } from "@/lib/subject-config";
import DifficultySlider from "@/components/DifficultySlider";

interface SubTopic {
  questionType: string;
  displayName: string;
  description: string;
  questionCount: number;
  topicIds: string[];
  countsByDifficulty: Record<number, number>;
}

interface TopicGroup {
  id: string;
  name: string;
  icon: string;
  color: string;
  subTopics: SubTopic[];
  totalQuestions: number;
}

interface ChallengeQType {
  questionType: string;
  displayName: string;
  questionCount: number;
  topicIds: string[];
  countsByDifficulty: Record<number, number>;
}

interface ExamBoardData {
  examBoard: string;
  displayName: string;
  subtitle: string;
  subjectId: string;
  subjectName: string;
  subjectSlug: string;
  subjectIcon: string;
  topicGroups: TopicGroup[];
  challenge: {
    questionTypes: ChallengeQType[];
    totalQuestions: number;
  };
}

const TOPIC_GROUP_ICONS: Record<string, string> = {
  Type: "Aa",
  Puzzle: "\u{1F9E9}",
  BookOpen: "\u{1F4D6}",
  KeyRound: "\u{1F511}",
  Lightbulb: "\u{1F4A1}",
  HelpCircle: "?",
  // Maths topic icons
  Square: "\u{1F7E6}",
  Box: "\u{1F4E6}",
  LayoutGrid: "\u{1F3C1}",
  Compass: "\u{1F9ED}",
  Calculator: "\u{1F5A9}",
  Gauge: "\u{1F3AF}",
  Clock: "\u{1F552}",
  ArrowLeftRight: "\u{21C4}",
  Beaker: "\u{1F9EA}",
  Zap: "\u{26A1}",
  Percent: "%",
  Variable: "\u{1D465}",
  Dice: "\u{1F3B2}",
};

/** Count questions in a difficulty range from a countsByDifficulty map */
function countInRange(
  counts: Record<number, number>,
  min: number,
  max: number
): number {
  let total = 0;
  for (let d = min; d <= max; d++) {
    total += counts[d] || 0;
  }
  return total;
}

export default function ExamBoardPage({
  params,
}: {
  params: Promise<{ slug: string; examBoard: string }>;
}) {
  const [data, setData] = useState<ExamBoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([1, 6]);
  const router = useRouter();

  // Restore saved difficulty from localStorage once we know the slug+examBoard
  useEffect(() => {
    params.then(async (p) => {
      setSlug(p.slug);
      setExamBoard(p.examBoard);

      // Restore persisted difficulty range
      const storageKey = `difficulty_${p.slug}_${p.examBoard}`;
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 2) {
            setDifficultyRange(parsed as [number, number]);
          }
        }
      } catch { /* ignore */ }

      const res = await fetch(`/api/subjects/${p.slug}/${p.examBoard}`);
      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    });
  }, [params]);

  // Persist difficulty range to localStorage when it changes
  useEffect(() => {
    if (slug && examBoard) {
      localStorage.setItem(
        `difficulty_${slug}_${examBoard}`,
        JSON.stringify(difficultyRange)
      );
    }
  }, [difficultyRange, slug, examBoard]);

  // Filter topic groups by difficulty range
  const filteredGroups = useMemo(() => {
    if (!data) return [];
    const [min, max] = difficultyRange;

    return data.topicGroups
      .map((group) => {
        const filteredSubs = group.subTopics
          .map((sub) => ({
            ...sub,
            filteredCount: countInRange(sub.countsByDifficulty, min, max),
          }))
          .filter((sub) => sub.filteredCount > 0);

        return {
          ...group,
          filteredSubTopics: filteredSubs,
          filteredTotal: filteredSubs.reduce((s, t) => s + t.filteredCount, 0),
        };
      })
      .filter((g) => g.filteredTotal > 0);
  }, [data, difficultyRange]);

  // Filter challenge types by difficulty range
  const filteredChallenge = useMemo(() => {
    if (!data) return { questionTypes: [] as (ChallengeQType & { filteredCount: number })[], totalQuestions: 0 };
    const [min, max] = difficultyRange;

    const filtered = data.challenge.questionTypes
      .map((qt) => ({
        ...qt,
        filteredCount: countInRange(qt.countsByDifficulty, min, max),
      }))
      .filter((qt) => qt.filteredCount > 0);

    return {
      questionTypes: filtered,
      totalQuestions: filtered.reduce((s, t) => s + t.filteredCount, 0),
    };
  }, [data, difficultyRange]);

  const isFullRange = difficultyRange[0] === 1 && difficultyRange[1] === 6;

  async function startPractice(
    questionType: string,
    topicIds: string[],
    timedMode: boolean = false,
    isChallenge: boolean = false
  ) {
    const key = `${questionType}-${isChallenge ? "challenge" : "regular"}-${timedMode ? "timed" : "practice"}`;
    setStarting(key);

    const [min, max] = difficultyRange;

    const res = await fetch("/api/practice/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topicIds,
        subjectId: data?.subjectId,
        examBoard: examBoard === "Generic" ? null : examBoard,
        ageRange: null,
        questionType,
        timedMode,
        timeLimitSeconds: timedMode ? 60 : null,
        isChallenge: isFullRange ? isChallenge : undefined,
        difficultyMin: min,
        difficultyMax: max,
        returnAll: true,
      }),
    });
    const responseData = await res.json();
    setStarting(null);

    if (res.ok) {
      if (responseData.questions && responseData.questions.length > 0) {
        localStorage.setItem(
          `session_${responseData.sessionId}`,
          JSON.stringify({
            questions: responseData.questions,
            topicName: responseData.topicName,
            subjectName: responseData.subjectName,
            timedMode: responseData.timedMode,
            timeLimitSeconds: responseData.timeLimitSeconds,
          })
        );
        router.push(`/child/practice/${responseData.sessionId}`);
      } else {
        alert(
          "No questions found for this selection. Please try a different category."
        );
      }
    } else {
      alert(`Error: ${responseData.error || "Failed to start practice"}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-12 text-center">
        <p className="text-gray-500 mb-4">
          No questions available for this exam board yet.
        </p>
        <Link
          href="/child/dashboard"
          className="text-indigo-600 text-sm font-medium hover:underline"
        >
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const colors = getSubjectColors(data.subjectSlug);

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      {/* Back link */}
      <Link
        href="/child/dashboard"
        className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {data.subjectName}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {data.subjectName}
        </h1>
        <p className="mt-1 text-gray-500">{data.subtitle}</p>
      </div>

      {/* VR Diagnostic Banner */}
      {data.subjectSlug === "verbal-reasoning" && (
        <div className="mb-8">
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 mt-0.5">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  VR Diagnostic Test
                </h3>
                <p className="text-sm text-gray-500">
                  50 questions that adapt to your level &middot; ~30 minutes
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1">
                  Ready for a challenge? Find out where you stand!
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/child/diagnostic/vr")}
              className="bg-green-600 text-white px-7 py-2.5 rounded-full font-bold text-base hover:bg-green-700 transition-colors shrink-0"
            >
              Start Diagnostic
            </button>
          </div>
        </div>
      )}

      {/* Difficulty Slider */}
      <div className="mb-8">
        <DifficultySlider
          value={difficultyRange}
          onChange={setDifficultyRange}
        />
      </div>

      {/* Pick a topic heading */}
      <p className="mb-4 text-sm font-semibold text-gray-500">
        Pick a topic to practise
      </p>

      {/* Topic Group Accordions */}
      <div className="space-y-3">
        {filteredGroups.map((group) => {
          const iconChar = TOPIC_GROUP_ICONS[group.icon] || group.icon;

          return (
            <Accordion
              key={group.id}
              title={group.name}
              subtitle={`${group.filteredTotal} Qs`}
              icon={iconChar}
              defaultOpen={false}
            >
              {group.filteredSubTopics.map((sub) => {
                const practiceKey = `${sub.questionType}-regular-practice`;
                const timedKey = `${sub.questionType}-regular-timed`;

                return (
                  <div
                    key={sub.questionType}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="text-base">{"\u{1F4D6}"}</span>
                        {sub.displayName}
                      </p>
                      {sub.description && (
                        <p className="text-sm text-gray-500 ml-6">
                          {sub.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-500">
                        {sub.filteredCount} Qs
                      </span>
                      <button
                        onClick={() =>
                          startPractice(
                            sub.questionType,
                            sub.topicIds,
                            false,
                            false
                          )
                        }
                        disabled={starting === practiceKey}
                        className={`${colors.text} border border-current px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors disabled:opacity-50`}
                      >
                        {starting === practiceKey
                          ? "Starting..."
                          : "Practice"}
                      </button>
                      <button
                        onClick={() =>
                          startPractice(
                            sub.questionType,
                            sub.topicIds,
                            true,
                            false
                          )
                        }
                        disabled={starting === timedKey}
                        className="text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-50"
                        title="Timed mode (60s per question)"
                      >
                        Timed
                      </button>
                    </div>
                  </div>
                );
              })}
            </Accordion>
          );
        })}

        {/* Challenge Section */}
        {filteredChallenge.totalQuestions > 0 && (
          <Accordion
            title="Challenge Mode"
            subtitle={`${filteredChallenge.totalQuestions} hard questions`}
            icon={"\u{1F525}"}
            defaultOpen={false}
          >
            {filteredChallenge.questionTypes.map((qType) => {
              const practiceKey = `${qType.questionType}-challenge-practice`;
              const timedKey = `${qType.questionType}-challenge-timed`;

              return (
                <div
                  key={qType.questionType}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {qType.displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {qType.filteredCount} hard questions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        startPractice(
                          qType.questionType,
                          qType.topicIds,
                          false,
                          true
                        )
                      }
                      disabled={starting === practiceKey}
                      className={`${colors.text} border border-current px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition-colors disabled:opacity-50`}
                    >
                      {starting === practiceKey ? "Starting..." : "Practice"}
                    </button>
                    <button
                      onClick={() =>
                        startPractice(
                          qType.questionType,
                          qType.topicIds,
                          true,
                          true
                        )
                      }
                      disabled={starting === timedKey}
                      className="text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-white transition-colors disabled:opacity-50"
                      title="Timed mode (60s per question)"
                    >
                      Timed
                    </button>
                  </div>
                </div>
              );
            })}
          </Accordion>
        )}
      </div>

      {filteredGroups.length === 0 && filteredChallenge.totalQuestions === 0 && (
        <div className="text-center py-12">
          {data.topicGroups.length === 0 && data.challenge.totalQuestions === 0 ? (
            <>
              <p className="text-gray-500 mb-4">
                No questions available yet for this exam board.
              </p>
              <Link
                href="/child/dashboard"
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                &larr; Back to Dashboard
              </Link>
            </>
          ) : (
            <p className="text-gray-500">
              No questions match difficulty {difficultyRange[0]}–{difficultyRange[1]}. Try widening the range.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
