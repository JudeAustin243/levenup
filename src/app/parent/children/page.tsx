import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ParentChildrenPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "parent")
    redirect("/login");

  const children = await prisma.child.findMany({
    where: { parentId: session.user.id },
    include: {
      _count: { select: { sessions: true, answers: true } },
      hexagonProfiles: {
        orderBy: { snapshotDate: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="text-gray-500 text-sm">
            Manage your children&apos;s profiles and track their progress
          </p>
        </div>
        <Link
          href="/onboarding"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm"
        >
          + Add Child
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">&#128100;</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No children added yet
          </h2>
          <p className="text-gray-500 mb-6">
            Add your child&apos;s profile to start their 11+ preparation journey.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Add Your First Child
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {children.map((child) => {
            const hexagon = child.hexagonProfiles[0]?.axisScores as Record<
              string,
              number
            > | null;
            const avgScore = hexagon
              ? Math.round(
                  Object.values(hexagon).reduce((a, b) => a + b, 0) /
                    Object.values(hexagon).length
                )
              : null;

            return (
              <Link
                key={child.id}
                href={`/parent/children/${child.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">
                      {child.avatar || "\ud83c\udf1f"}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {child.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Age {child.age || "?"}
                        {child.examBoard && (
                          <span> &bull; {child.examBoard}</span>
                        )}
                        {child.examDate && (
                          <span>
                            {" "}
                            &bull;{" "}
                            {Math.max(
                              0,
                              Math.ceil(
                                (new Date(child.examDate).getTime() -
                                  Date.now()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            )}{" "}
                            days to exam
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {child._count.sessions}
                      </p>
                      <p className="text-xs text-gray-500">Sessions</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {child._count.answers}
                      </p>
                      <p className="text-xs text-gray-500">Questions</p>
                    </div>
                    {avgScore !== null && (
                      <div>
                        <p className="text-xl font-bold text-indigo-600">
                          {avgScore}%
                        </p>
                        <p className="text-xs text-gray-500">Avg Score</p>
                      </div>
                    )}
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mt-3 bg-amber-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-amber-700">
                    Login code:{" "}
                    <span className="font-mono font-bold">{child.id}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
