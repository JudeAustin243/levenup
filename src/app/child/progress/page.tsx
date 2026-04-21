import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLatestHexagon, getHexagonHistory, AXIS_LABELS, BENCHMARK_SCORES } from "@/lib/hexagon";
import type { AxisScores } from "@/lib/hexagon";
import Link from "next/link";
import { redirect } from "next/navigation";
import HexagonChart from "@/components/HexagonChart";

export default async function ProgressPage() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) redirect("/login");

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) redirect("/login");

  const hexagonScores = await getLatestHexagon(childId);
  const history = await getHexagonHistory(childId, 8);

  // Get per-subject stats
  const subjects = await prisma.subject.findMany({
    include: { topics: true },
    orderBy: { name: "asc" },
  });

  const subjectStats = await Promise.all(
    subjects.map(async (subject) => {
      const answers = await prisma.answer.findMany({
        where: {
          childId,
          question: { topic: { subjectId: subject.id } },
        },
        orderBy: { answeredAt: "desc" },
        take: 50,
      });
      const correct = answers.filter((a) => a.isCorrect).length;
      return {
        name: subject.name,
        slug: subject.slug,
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

  const getLevel = (pct: number) => {
    if (pct >= 80) return { label: "Advanced", colour: "text-green-600", bg: "bg-green-50" };
    if (pct >= 60) return { label: "Secure", colour: "text-blue-600", bg: "bg-blue-50" };
    if (pct >= 40) return { label: "Developing", colour: "text-amber-600", bg: "bg-amber-50" };
    return { label: "Beginner", colour: "text-red-600", bg: "bg-red-50" };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/child/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">My Progress</h1>
      <p className="text-gray-500 mb-6">Track your skills across all subjects</p>

      {/* Hexagon Chart */}
      {hexagonData ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills Profile</h2>
          <p className="text-sm text-gray-500 mb-4">
            Your current performance across 6 key areas. The dashed line shows the target level.
          </p>
          <HexagonChart scores={hexagonData} height={400} />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
          <p className="text-gray-500 mb-3">
            Complete the diagnostic assessment to see your skills profile.
          </p>
          <Link
            href="/child/diagnostic"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Take Diagnostic
          </Link>
        </div>
      )}

      {/* Axis Breakdown */}
      {hexagonScores && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Skill Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(AXIS_LABELS).map(([key, label]) => {
              const score = hexagonScores[key as keyof AxisScores] || 0;
              const benchmark = BENCHMARK_SCORES[key as keyof typeof BENCHMARK_SCORES];
              const level = getLevel(score);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${level.bg} ${level.colour}`}>
                        {level.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 relative">
                    <div
                      className="bg-indigo-500 h-2.5 rounded-full transition-all"
                      style={{ width: `${score}%` }}
                    />
                    <div
                      className="absolute top-0 h-2.5 w-0.5 bg-green-500"
                      style={{ left: `${benchmark}%` }}
                      title={`Target: ${benchmark}%`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Per-Subject Scores */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h2>
        <div className="grid grid-cols-2 gap-4">
          {subjectStats.map((s) => {
            const level = getLevel(s.percentage);
            return (
              <Link
                key={s.slug}
                href={`/child/subjects/${s.slug}`}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {s.total > 0 ? `${s.percentage}%` : "--"}
                  </span>
                  {s.total > 0 && (
                    <span className={`text-xs font-semibold ${level.colour}`}>{level.label}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {s.correct}/{s.total} correct (last 50)
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* History */}
      {history.length > 1 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progress Over Time</h2>
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
                  <span className="text-sm font-bold text-gray-900">
                    Average: {avg}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
