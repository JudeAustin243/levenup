import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLatestHexagon, AXIS_LABELS, BENCHMARK_SCORES } from "@/lib/hexagon";
import { getSubjectColors } from "@/lib/subject-config";
import Link from "next/link";
import { redirect } from "next/navigation";
import HexagonChart from "@/components/HexagonChart";
import SubjectIcon from "@/components/SubjectIcon";
import TodaysPlan from "@/components/TodaysPlan";

export default async function ChildDashboard() {
  const session = await auth();
  const childId = (session?.user as any)?.activeChildId;
  if (!childId) redirect("/login");

  const child = await prisma.child.findUnique({ where: { id: childId } });
  if (!child) redirect("/login");

  // Check if diagnostic is done
  const diagnostic = await prisma.session.findFirst({
    where: { childId, sessionType: "diagnostic", endedAt: { not: null } },
  });

  const subjects = await prisma.subject.findMany({
    include: { topics: { include: { _count: { select: { questions: true } } } } },
    orderBy: { name: "asc" },
  });

  const hexagonScores = await getLatestHexagon(childId);

  // Get this week's stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = await prisma.session.count({
    where: { childId, endedAt: { not: null }, startedAt: { gte: weekStart } },
  });

  const totalAnswers = await prisma.answer.count({ where: { childId } });

  // Streak: count consecutive days with at least 1 completed session
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = 0; d < 60; d++) {
    const dayStart = new Date(today);
    dayStart.setDate(today.getDate() - d);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    const count = await prisma.session.count({
      where: { childId, endedAt: { not: null }, startedAt: { gte: dayStart, lt: dayEnd } },
    });
    if (count > 0) streak++;
    else break;
  }

  // Get today's schedule sessions
  const schedule = await prisma.schedule.findFirst({
    where: {
      childId,
      weekStartDate: { gte: weekStart },
    },
    orderBy: { weekStartDate: "desc" },
  });

  const todayStr = new Date().toISOString().split("T")[0];
  let todaySessions: { subject: string; topic: string; durationMins: number; questionCount: number; focus: string }[] = [];
  if (schedule?.sessionsJson) {
    const scheduleData = schedule.sessionsJson as { days?: { date: string; sessions: typeof todaySessions }[] };
    const todayDay = scheduleData.days?.find((d) => d.date === todayStr);
    if (todayDay) {
      todaySessions = todayDay.sessions;
    }
  }

  const hexagonData = hexagonScores
    ? Object.entries(AXIS_LABELS).map(([key, label]) => ({
        axis: label,
        score: hexagonScores[key as keyof typeof hexagonScores] || 0,
        benchmark: BENCHMARK_SCORES[key as keyof typeof BENCHMARK_SCORES],
      }))
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Greeting */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">{child.avatar || "\ud83c\udf1f"}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hello, {child.name}!
          </h1>
          <p className="text-gray-500">
            {child.examDate
              ? `${Math.max(0, Math.ceil((new Date(child.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days until your exam`
              : "Let's get practising!"}
          </p>
        </div>
      </div>

      {/* Diagnostic CTA */}
      {!diagnostic && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Take Your Diagnostic Assessment</h2>
          <p className="text-amber-100 mb-4">
            Answer 40 questions across all 4 subjects so we can build your personalised study plan.
          </p>
          <Link
            href="/child/diagnostic"
            className="inline-block bg-white text-amber-700 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
          >
            Start Assessment
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{thisWeekSessions}</p>
          <p className="text-sm text-gray-500">Sessions this week</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{totalAnswers}</p>
          <p className="text-sm text-gray-500">Questions answered</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-amber-500">{streak}</p>
          <p className="text-sm text-gray-500">Day streak</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
          <p className="text-sm text-gray-500">Subjects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Hexagon Profile */}
        {hexagonData && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">My Skills Profile</h2>
            <HexagonChart scores={hexagonData} />
            <Link
              href="/child/progress"
              className="block text-center text-indigo-600 text-sm font-medium mt-2 hover:text-indigo-700"
            >
              View full progress &rarr;
            </Link>
          </div>
        )}

        {/* Today's Plan */}
        <TodaysPlan
          sessions={todaySessions}
          hasDiagnostic={!!diagnostic}
          hasSchedule={!!schedule}
        />
      </div>

      {/* Subject Cards */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => {
          const colors = getSubjectColors(subject.slug);
          return (
          <Link
            key={subject.id}
            href={`/child/subjects/${subject.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all group"
          >
            <div
              className={`w-10 h-10 ${colors.light} ${colors.text} rounded-lg flex items-center justify-center mb-3`}
            >
              <SubjectIcon slug={subject.slug} className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {subject.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{subject.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {subject.topics.length} topics &bull;{" "}
              {subject.topics.reduce((sum, t) => sum + t._count.questions, 0)} questions
            </p>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
