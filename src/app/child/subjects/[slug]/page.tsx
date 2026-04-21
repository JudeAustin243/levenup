"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSubjectColors } from "@/lib/subject-config";
import SubjectIcon from "@/components/SubjectIcon";

interface ExamBoardInfo {
  examBoard: string;
  displayName: string;
  subtitle: string;
  icon: string;
  totalQuestions: number;
  topicCount: number;
}

interface SubjectData {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  examBoards: ExamBoardInfo[];
}

export default function ChildSubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [subject, setSubject] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then(async (p) => {
      // Fetch available exam boards and redirect to the first one with questions
      const res = await fetch(`/api/subjects/${p.slug}`);
      if (res.ok) {
        const data = await res.json();
        const boards: ExamBoardInfo[] = data.examBoards || [];
        // Prefer GL if available, otherwise take the first board
        const gl = boards.find((b) => b.examBoard === "GL");
        const target = gl || boards[0];
        if (target) {
          router.replace(`/child/subjects/${p.slug}/${target.examBoard}`);
          return;
        }
      }
      setSlug(p.slug);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Loading subject...</p>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-12 text-center">
        <p className="text-gray-500">Subject not found.</p>
        <Link
          href="/child/dashboard"
          className="text-indigo-600 text-sm font-medium mt-2 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const colors = getSubjectColors(subject.slug);

  // Separate main exam boards from generic/general practice
  const mainBoards = subject.examBoards.filter(
    (b) => b.examBoard !== "Generic"
  );
  const generalBoard = subject.examBoards.find(
    (b) => b.examBoard === "Generic"
  );

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Link
        href="/child/dashboard"
        className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1 font-semibold"
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
        Back to Dashboard
      </Link>

      <div className="mb-8 mt-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {subject.name}
        </h1>
        <p className="mt-1 text-gray-500">{subject.description}</p>
      </div>

      {/* Exam Boards */}
      {mainBoards.length > 0 && (
        <>
          <p className="mb-4 text-sm font-semibold text-gray-500">
            Exam Boards
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {mainBoards.map((board) => (
              <button
                key={board.examBoard}
                onClick={() =>
                  router.push(
                    `/child/subjects/${slug}/${board.examBoard}`
                  )
                }
                className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg hover:border-green-200 active:scale-[0.98]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.light} ${colors.text}`}
                >
                  <SubjectIcon slug={subject.slug} className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {board.displayName}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {board.subtitle}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-gray-500">
                  <span>{board.totalQuestions} questions</span>
                  <span>&middot;</span>
                  <span>{board.topicCount} topics</span>
                </div>
                <span
                  className={`mt-4 flex items-center gap-1 text-sm font-bold ${colors.text} group-hover:gap-2 transition-all`}
                >
                  View topics
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* General / Mixed Practice */}
      {generalBoard && (
        <div className="mt-8">
          <p className="mb-4 text-sm font-semibold text-gray-500">
            Mixed Practice
          </p>
          <button
            onClick={() =>
              router.push(`/child/subjects/${slug}/${generalBoard.examBoard}`)
            }
            className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg hover:border-green-200 active:scale-[0.98] w-full sm:w-auto"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors.light} ${colors.text}`}
            >
              <SubjectIcon slug={subject.slug} className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {generalBoard.displayName}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {generalBoard.subtitle}
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-gray-500">
              <span>{generalBoard.totalQuestions} questions</span>
              <span>&middot;</span>
              <span>{generalBoard.topicCount} topics</span>
            </div>
            <span
              className={`mt-4 flex items-center gap-1 text-sm font-bold ${colors.text} group-hover:gap-2 transition-all`}
            >
              View topics
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>
        </div>
      )}

      {subject.examBoards.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">
            No questions available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
