import Link from "next/link";
import { getSubjectColors } from "@/lib/subject-config";
import SubjectIcon from "@/components/SubjectIcon";

interface SubjectCardProps {
  name: string;
  slug: string;
  description: string;
  topicsCompleted: number;
  totalTopics: number;
  averageScore: number;
}

export default function SubjectCard({
  name,
  slug,
  description,
  topicsCompleted,
  totalTopics,
  averageScore,
}: SubjectCardProps) {
  const colors = getSubjectColors(slug);
  const progressPercent =
    totalTopics > 0 ? Math.round((topicsCompleted / totalTopics) * 100) : 0;

  return (
    <Link href={`/subjects/${slug}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 ${colors.light} ${colors.text} rounded-xl flex items-center justify-center`}
          >
            <SubjectIcon slug={slug} className="w-7 h-7" />
          </div>
          {averageScore > 0 && (
            <span
              className={`text-sm font-semibold ${colors.text} ${colors.light} px-3 py-1 rounded-full`}
            >
              {averageScore}% avg
            </span>
          )}
        </div>

        <h3 className="font-semibold text-lg text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              {topicsCompleted}/{totalTopics} topics
            </span>
            <span className="font-medium text-gray-700">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${colors.bg} h-2 rounded-full transition-all`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
