import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLatestHexagon, getHexagonHistory, AXIS_LABELS, BENCHMARK_SCORES } from "@/lib/hexagon";
import type { AxisScores } from "@/lib/hexagon";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import HexagonChart from "@/components/HexagonChart";

export default async function ParentChildDetailPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "parent") redirect("/login");

  const { childId } = await params;

  const child = await prisma.child.findFirst({
    where: { id: childId, parentId: session.user.id },
  });
  if (!child) notFound();

  const hexagonScores = await getLatestHexagon(childId);
  const history = await getHexagonHistory(childId, 8);

  // Stats
  const totalSessions = await prisma.session.count({
    where: { childId, endedAt: { not: null } },
  });
  const totalAnswers = await prisma.answer.count({ where: { childId } });
  const correctAnswers = await prisma.answer.count({
    where: { childId, isCorrect: true },
  });

  // Recent sessions
  const recentSessions = await prisma.session.findMany({
    where: { childId, endedAt: { not: null } },
    orderBy: { endedAt: "desc" },
    take: 10,
    include: { subject: true, topic: true },
  });

  // Per-subject breakdown
  const subjects = await prisma.subject.findMany({ orderBy: { name: "asc" } });
  const subjectStats = await Promise.all(
    subjects.map(async (subject) => {
      const answers = await prisma.answer.findMany({
        where: { childId, question: { topic: { subjectId: subject.id } } },
        orderBy: { answeredAt: "desc" },
        take: 50,
      });
      const correct = answers.filter((a) => a.isCorrect).length;
      return {
        name: subject.name,
        total: answers.length,
        correct,
        percentage: answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0,
      };
    })
  );

  const hexagonData = hexagonScores
    ? Object.entries(AXIS_LABELS).map(([key, label]) => ({
        axis: label,
        score: hexagonScores[key as keyof AxisScores] || 0,
        benchmark: BENCHMARK_SCORES[key as keyof typeof BENCHMARK_SCORES],
      }))
    : null;

  const overallAccuracy =
    totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/parent/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Child Header */}
      <div className="flex items-center gap-4 mt-4 mb-6">
        <span className="text-4xl">{child.avatar || "\ud83c\udf1f"}</span>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{child.name}</h1>
          <p className="text-gray-500 text-sm">
            Age {child.age}
            {child.examBoard && <span> &bull; {child.examBoard}</span>}
            {child.examDate && (
              <span>
                {" "}&bull;{" "}
                {Math.max(
                  0,
                  Math.ceil(
                    (new Date(child.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                )}{" "}
                days to exam
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
          <p className="text-xs text-gray-500">Sessions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalAnswers}</p>
          <p className="text-xs text-gray-500">Questions</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{overallAccuracy}%</p>
          <p className="text-xs text-gray-500">Accuracy</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-amber-500 font-mono">{child.id}</p>
          <p className="text-xs text-gray-500">Login Code</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Hexagon Profile */}
        {hexagonData ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills Profile</h2>
            <HexagonChart scores={hexagonData} height={300} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center">
              Skills profile will appear after the diagnostic assessment.
            </p>
          </div>
        )}

        {/* Subject Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
          <div className="space-y-4">
            {subjectStats.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {s.total > 0 ? `${s.percentage}%` : "--"}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      s.percentage >= 70 ? "bg-green-500" : s.percentage >= 50 ? "bg-amber-500" : "bg-red-400"
                    }`}
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.correct}/{s.total} correct (last 50)
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentSessions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {s.topic?.name || s.subject?.name || s.sessionType}
                  </p>
                  <p className="text-xs text-gray-400">
                    {s.endedAt
                      ? new Date(s.endedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "In progress"}
                  </p>
                </div>
                <div className="text-right">
                  {s.questionsAttempted > 0 ? (
                    <>
                      <p className={`text-sm font-bold ${
                        s.questionsCorrect / s.questionsAttempted >= 0.7
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}>
                        {Math.round((s.questionsCorrect / s.questionsAttempted) * 100)}%
                      </p>
                      <p className="text-xs text-gray-400">
                        {s.questionsCorrect}/{s.questionsAttempted}
                      </p>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">--</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Timeline */}
      {history.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile History</h2>
          <div className="space-y-3">
            {history.map((snapshot) => {
              const scores = snapshot.axisScores as Record<string, number>;
              const avg = Math.round(
                Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
              );
              return (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm text-gray-500">
                    {new Date(snapshot.snapshotDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm font-bold text-gray-900">Average: {avg}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
