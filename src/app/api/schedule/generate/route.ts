import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLatestHexagon, BENCHMARK_SCORES } from "@/lib/hexagon";
import { generateSchedule } from "@/lib/ai/claude";
import type { AxisScores } from "@/lib/hexagon";
import {
  VR_TOPIC_GROUPS,
  MATHS_TOPIC_GROUPS,
  MEASUREMENTS_TOPIC_GROUPS,
  GEOMETRY_TOPIC_GROUPS,
  PERCENTAGES_TOPIC_GROUPS,
  ALGEBRA_TOPIC_GROUPS,
  PROBABILITY_TOPIC_GROUPS,
  ENGLISH_SPAG_TOPIC_GROUPS,
} from "@/lib/topic-groups";

// NVR question types displayed as topics in the UI
const NVR_TOPICS = [
  "Complete Grid",
  "Complete Pair",
  "Complete Series",
  "Find Figure",
  "Find Figure Three",
  "Odd One Out",
  "Vertical Code",
];

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const childId = body.childId || (session.user as any).activeChildId;
    if (!childId) {
      return NextResponse.json({ error: "Child ID required" }, { status: 400 });
    }

    // Verify parent owns child or child is self
    const role = (session.user as any).role;
    if (role === "parent") {
      const child = await prisma.child.findFirst({
        where: { id: childId, parentId: session.user.id },
      });
      if (!child) {
        return NextResponse.json({ error: "Child not found" }, { status: 404 });
      }
    }

    const child = await prisma.child.findUnique({ where: { id: childId } });
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    const hexagonScores =
      (await getLatestHexagon(childId)) || (BENCHMARK_SCORES as AxisScores);

    // Build subject → topic groups from the config (matches what the UI shows)
    const subjectTopics = [
      {
        name: "Maths",
        topics: [
          ...MATHS_TOPIC_GROUPS,
          ...MEASUREMENTS_TOPIC_GROUPS,
          ...GEOMETRY_TOPIC_GROUPS,
          ...PERCENTAGES_TOPIC_GROUPS,
          ...ALGEBRA_TOPIC_GROUPS,
          ...PROBABILITY_TOPIC_GROUPS,
        ].map((g) => g.name),
      },
      {
        name: "English",
        topics: ENGLISH_SPAG_TOPIC_GROUPS.map((g) => g.name),
      },
      {
        name: "Verbal Reasoning",
        topics: VR_TOPIC_GROUPS.map((g) => g.name),
      },
      {
        name: "Non-Verbal Reasoning",
        topics: NVR_TOPICS,
      },
    ];

    const schedule = await generateSchedule({
      hexagonScores,
      examDate: child.examDate?.toISOString() || null,
      examBoard: child.examBoard,
      childAge: child.age,
      childName: child.name,
      subjectTopics,
    });

    // Calculate week start (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0);

    const saved = await prisma.schedule.upsert({
      where: {
        id: (
          await prisma.schedule.findFirst({
            where: { childId, weekStartDate: weekStart },
          })
        )?.id || "none",
      },
      create: {
        childId,
        weekStartDate: weekStart,
        sessionsJson: schedule as any,
        isAiGenerated: true,
        lastModifiedBy: "ai",
      },
      update: {
        sessionsJson: schedule as any,
        isAiGenerated: true,
        lastModifiedBy: "ai",
      },
    });

    return NextResponse.json({ schedule: saved });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
