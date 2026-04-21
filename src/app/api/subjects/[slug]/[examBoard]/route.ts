import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  VR_TOPIC_GROUPS,
  MATHS_TOPIC_GROUPS,
  MEASUREMENTS_TOPIC_GROUPS,
  GEOMETRY_TOPIC_GROUPS,
  PERCENTAGES_TOPIC_GROUPS,
  ALGEBRA_TOPIC_GROUPS,
  PROBABILITY_TOPIC_GROUPS,
  ENGLISH_SPAG_TOPIC_GROUPS,
  type TopicGroupDef,
  type SubGroupDef,
  formatQuestionType,
  QUESTION_TYPE_DESCRIPTIONS,
  EXAM_BOARD_META,
} from "@/lib/topic-groups";

const ALL_MATHS_TOPIC_GROUPS: TopicGroupDef[] = [
  ...MATHS_TOPIC_GROUPS,
  ...MEASUREMENTS_TOPIC_GROUPS,
  ...GEOMETRY_TOPIC_GROUPS,
  ...PERCENTAGES_TOPIC_GROUPS,
  ...ALGEBRA_TOPIC_GROUPS,
  ...PROBABILITY_TOPIC_GROUPS,
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; examBoard: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { slug, examBoard } = await params;

    const subject = await prisma.subject.findUnique({
      where: { slug },
      include: {
        topics: {
          include: {
            questions: {
              where: {
                examBoard: examBoard === "Generic" ? null : examBoard,
              },
              select: {
                id: true,
                questionType: true,
                difficulty: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Collect per-questionType stats (regular + challenge) with per-difficulty breakdown
    const qtStats: Record<
      string,
      {
        count: number;
        challengeCount: number;
        topicIds: string[];
        countsByDifficulty: Record<number, number>;
      }
    > = {};

    subject.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        const qType = q.questionType || "General";
        const isChallenge = q.difficulty >= 6;

        if (!qtStats[qType]) {
          qtStats[qType] = {
            count: 0,
            challengeCount: 0,
            topicIds: [],
            countsByDifficulty: {},
          };
        }

        if (isChallenge) {
          qtStats[qType].challengeCount++;
        } else {
          qtStats[qType].count++;
        }

        const diff = q.difficulty || 3;
        qtStats[qType].countsByDifficulty[diff] =
          (qtStats[qType].countsByDifficulty[diff] || 0) + 1;

        if (!qtStats[qType].topicIds.includes(topic.id)) {
          qtStats[qType].topicIds.push(topic.id);
        }
      });
    });

    const meta = EXAM_BOARD_META[examBoard];

    // Build topic groups
    const isVR = slug === "verbal-reasoning";
    const isMaths = slug === "maths";
    const isEnglish = slug === "english";
    const topicGroups = isVR
      ? buildGroupedTopicGroups(qtStats, VR_TOPIC_GROUPS)
      : isMaths
      ? buildGroupedTopicGroups(qtStats, ALL_MATHS_TOPIC_GROUPS)
      : isEnglish
      ? buildGroupedTopicGroups(qtStats, ENGLISH_SPAG_TOPIC_GROUPS)
      : buildGenericTopicGroups(qtStats);

    // Build challenge section
    const challengeTypes = Object.entries(qtStats)
      .filter(([, s]) => s.challengeCount > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([qType, s]) => ({
        questionType: qType,
        displayName: formatQuestionType(qType),
        questionCount: s.challengeCount,
        topicIds: s.topicIds,
        countsByDifficulty: s.countsByDifficulty,
      }));

    const challenge = {
      questionTypes: challengeTypes,
      totalQuestions: challengeTypes.reduce((sum, t) => sum + t.questionCount, 0),
    };

    if (topicGroups.length === 0 && challenge.totalQuestions === 0) {
      return NextResponse.json(
        { error: "No questions found for this exam board" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      examBoard,
      displayName: meta?.name || (examBoard === "Generic" ? "General Practice" : examBoard),
      subtitle: meta?.subtitle || "",
      subjectId: subject.id,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      subjectIcon: subject.icon,
      topicGroups,
      challenge,
    });
  } catch (error) {
    console.error("Error fetching exam board data:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

interface QtStat {
  count: number;
  challengeCount: number;
  topicIds: string[];
  countsByDifficulty: Record<number, number>;
}

function buildGroupedTopicGroups(qtStats: Record<string, QtStat>, topicGroupDefs: TopicGroupDef[]) {
  const groups: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    subTopics: Array<{
      questionType: string;
      displayName: string;
      description: string;
      questionCount: number;
      topicIds: string[];
      countsByDifficulty: Record<number, number>;
    }>;
    totalQuestions: number;
  }> = [];

  for (const groupDef of topicGroupDefs) {
    const subTopics: (typeof groups)[number]["subTopics"] = [];

    if (groupDef.subGroups) {
      // Merge question types within each sub-group into a single subtopic row
      for (const sg of groupDef.subGroups) {
        const merged = mergeSubGroupStats(sg, qtStats);
        if (merged.questionCount === 0) continue;
        subTopics.push(merged);
      }
    } else {
      // Default: one subtopic per question type
      for (const qt of groupDef.questionTypes) {
        const stat = qtStats[qt];
        if (!stat || stat.count === 0) continue;

        subTopics.push({
          questionType: qt,
          displayName: formatQuestionType(qt),
          description: QUESTION_TYPE_DESCRIPTIONS[qt] || "",
          questionCount: stat.count,
          topicIds: stat.topicIds,
          countsByDifficulty: stat.countsByDifficulty,
        });
      }
    }

    if (subTopics.length === 0) continue;

    groups.push({
      id: groupDef.id,
      name: groupDef.name,
      icon: groupDef.icon,
      color: groupDef.color,
      subTopics,
      totalQuestions: subTopics.reduce((s, t) => s + t.questionCount, 0),
    });
  }

  // Add any unmapped question types to an "Other" group
  const mapped = new Set(topicGroupDefs.flatMap((g) => g.questionTypes));
  const unmapped = Object.entries(qtStats).filter(
    ([qt, s]) => !mapped.has(qt) && s.count > 0
  );
  if (unmapped.length > 0) {
    groups.push({
      id: "other",
      name: "Other Topics",
      icon: "HelpCircle",
      color: "gray",
      subTopics: unmapped.map(([qt, s]) => ({
        questionType: qt,
        displayName: formatQuestionType(qt),
        description: QUESTION_TYPE_DESCRIPTIONS[qt] || "",
        questionCount: s.count,
        topicIds: s.topicIds,
        countsByDifficulty: s.countsByDifficulty,
      })),
      totalQuestions: unmapped.reduce((sum, [, s]) => sum + s.count, 0),
    });
  }

  return groups;
}

function buildGenericTopicGroups(qtStats: Record<string, QtStat>) {
  // For non-VR subjects, each questionType is its own group
  return Object.entries(qtStats)
    .filter(([, s]) => s.count > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([qt, s]) => ({
      id: qt,
      name: formatQuestionType(qt),
      icon: "BookOpen",
      color: "blue",
      subTopics: [
        {
          questionType: qt,
          displayName: formatQuestionType(qt),
          description: QUESTION_TYPE_DESCRIPTIONS[qt] || "",
          questionCount: s.count,
          topicIds: s.topicIds,
          countsByDifficulty: s.countsByDifficulty,
        },
      ],
      totalQuestions: s.count,
    }));
}

function mergeSubGroupStats(sg: SubGroupDef, qtStats: Record<string, QtStat>) {
  let questionCount = 0;
  const topicIdSet = new Set<string>();
  const countsByDifficulty: Record<number, number> = {};
  const questionTypes: string[] = [];

  for (const qt of sg.questionTypes) {
    const stat = qtStats[qt];
    if (!stat || stat.count === 0) continue;
    questionCount += stat.count;
    questionTypes.push(qt);
    for (const id of stat.topicIds) topicIdSet.add(id);
    for (const [diff, count] of Object.entries(stat.countsByDifficulty)) {
      const d = Number(diff);
      countsByDifficulty[d] = (countsByDifficulty[d] || 0) + count;
    }
  }

  return {
    questionType: questionTypes.join(","),
    displayName: sg.name,
    description: sg.description || "",
    questionCount,
    topicIds: [...topicIdSet],
    countsByDifficulty,
  };
}
