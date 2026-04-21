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
} from "@/lib/topic-groups";

// Build a map of topic group name → questionTypes for quick lookup
const ALL_GROUPS: TopicGroupDef[] = [
  ...VR_TOPIC_GROUPS,
  ...MATHS_TOPIC_GROUPS,
  ...MEASUREMENTS_TOPIC_GROUPS,
  ...GEOMETRY_TOPIC_GROUPS,
  ...PERCENTAGES_TOPIC_GROUPS,
  ...ALGEBRA_TOPIC_GROUPS,
  ...PROBABILITY_TOPIC_GROUPS,
  ...ENGLISH_SPAG_TOPIC_GROUPS,
];

const groupByName = new Map<string, TopicGroupDef>();
for (const g of ALL_GROUPS) {
  groupByName.set(g.name.toLowerCase(), g);
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectName = searchParams.get("subject");
    const topicName = searchParams.get("topic");

    if (!subjectName || !topicName) {
      return NextResponse.json({ error: "subject and topic required" }, { status: 400 });
    }

    // 1. Try exact DB topic match
    const topic = await prisma.topic.findFirst({
      where: {
        name: { contains: topicName, mode: "insensitive" },
        subject: { name: { contains: subjectName, mode: "insensitive" } },
      },
    });

    if (topic) {
      return NextResponse.json({ topicId: topic.id });
    }

    // 2. Try matching against topic group names → find a topic with matching question types
    const group = groupByName.get(topicName.toLowerCase());
    if (group && group.questionTypes.length > 0) {
      // Find a topic that has questions with one of these question types
      const matchingTopic = await prisma.topic.findFirst({
        where: {
          subject: { name: { contains: subjectName, mode: "insensitive" } },
          questions: {
            some: {
              questionType: { in: group.questionTypes },
            },
          },
        },
      });
      if (matchingTopic) {
        return NextResponse.json({ topicId: matchingTopic.id, questionTypes: group.questionTypes });
      }
    }

    // 3. For NVR topics like "Complete Grid" → match "nvr_complete_grid" question type
    const nvrQuestionType = `nvr_${topicName.toLowerCase().replace(/\s+/g, "_")}`;
    if (subjectName.toLowerCase().includes("non-verbal")) {
      const nvrTopic = await prisma.topic.findFirst({
        where: {
          subject: { name: { contains: subjectName, mode: "insensitive" } },
          questions: {
            some: {
              questionType: nvrQuestionType,
            },
          },
        },
      });
      if (nvrTopic) {
        return NextResponse.json({ topicId: nvrTopic.id, questionTypes: [nvrQuestionType] });
      }
    }

    // 4. Fallback: find any topic under the subject
    const fallback = await prisma.topic.findFirst({
      where: {
        subject: { name: { contains: subjectName, mode: "insensitive" } },
      },
    });
    return NextResponse.json({ topicId: fallback?.id || null });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
