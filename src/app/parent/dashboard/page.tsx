import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ParentDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const children = await prisma.child.findMany({
    where: { parentId: session.user.id },
    include: {
      sessions: {
        where: { endedAt: { not: null } },
        orderBy: { endedAt: "desc" },
        take: 5,
        include: { subject: true, topic: true },
      },
      hexagonProfiles: {
        orderBy: { snapshotDate: "desc" },
        take: 1,
      },
      _count: { select: { sessions: true, answers: true } },
    },
  });

  if (children.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-12">
          <div className="text-5xl mb-4">&#128100;</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-500 mb-6">
            Let&apos;s set up your child&apos;s profile to get started.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Your Child
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Parent Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your children&apos;s 11+ preparation progress
          </p>
        </div>
        <Link
          href="/onboarding"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
        >
          + Add Child
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.map((child) => {
          const hexagon = child.hexagonProfiles[0]?.axisScores as Record<string, number> | null;
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
          weekStart.setHours(0, 0, 0, 0);
          const thisWeekSessions = child.sessions.filter(
            (s) => s.endedAt && new Date(s.endedAt) >= weekStart
          ).length;

          return (
            <div
              key={child.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{child.avatar || "\ud83c\udf1f"}</span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{child.name}</h2>
                  <p className="text-sm text-gray-500">
                    Age {child.age} &bull; {child.examBoard || "No board set"}
                    {child.examDate && (
                      <span>
                        {" "}&bull;{" "}
                        {Math.ceil(
                          (new Date(child.examDate).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days to exam
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{child._count.sessions}</p>
                  <p className="text-xs text-gray-500">Total Sessions</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{thisWeekSessions}</p>
                  <p className="text-xs text-gray-500">This Week</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{child._count.answers}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
              </div>

              {hexagon && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Skills Profile</p>
                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(hexagon).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-bold text-gray-700">{val as number}%</div>
                        <div className="text-[10px] text-gray-400 truncate">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {child.sessions.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Recent Activity</p>
                  {child.sessions.slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-700">
                        {s.topic?.name || s.subject?.name || s.sessionType}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {s.questionsAttempted > 0
                          ? `${Math.round((s.questionsCorrect / s.questionsAttempted) * 100)}%`
                          : "--"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/parent/children/${child.id}`}
                  className="flex-1 text-center bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                >
                  View Details
                </Link>
                <Link
                  href="/parent/schedule"
                  className="flex-1 text-center bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Schedule
                </Link>
              </div>

              <div className="mt-3 bg-amber-50 rounded-lg p-2 text-center">
                <p className="text-xs text-amber-700">
                  Login code: <span className="font-mono font-bold">{child.id}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
