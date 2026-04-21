import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EXAM_BOARD_META } from "@/lib/topic-groups";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { slug } = await params;

    const subject = await prisma.subject.findUnique({
      where: { slug },
      include: {
        topics: {
          include: {
            questions: {
              select: {
                examBoard: true,
                questionType: true,
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

    // Group questions by exam board → count total + distinct questionTypes
    const boardStats: Record<
      string,
      { totalQuestions: number; questionTypes: Set<string> }
    > = {};

    subject.topics.forEach((topic) => {
      topic.questions.forEach((q) => {
        const board = q.examBoard || "Generic";
        const qType = q.questionType || "General";

        if (!boardStats[board]) {
          boardStats[board] = { totalQuestions: 0, questionTypes: new Set() };
        }
        boardStats[board].totalQuestions++;
        boardStats[board].questionTypes.add(qType);
      });
    });

    const sortedBoards = Object.entries(boardStats).map(([board, stats]) => {
      const meta = EXAM_BOARD_META[board];
      return {
        examBoard: board,
        displayName: meta?.name || board,
        subtitle: meta?.subtitle || "",
        icon: meta?.icon || "BookOpen",
        totalQuestions: stats.totalQuestions,
        topicCount: stats.questionTypes.size,
      };
    });

    // Sort exam boards: GL, CEM, ISEB, then Generic last
    const boardOrder = ["GL", "CEM", "ISEB"];
    sortedBoards.sort((a, b) => {
      const aIndex = boardOrder.indexOf(a.examBoard);
      const bIndex = boardOrder.indexOf(b.examBoard);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      if (a.examBoard === "Generic") return 1;
      if (b.examBoard === "Generic") return -1;
      return a.examBoard.localeCompare(b.examBoard);
    });

    return NextResponse.json({
      id: subject.id,
      name: subject.name,
      slug: subject.slug,
      description: subject.description,
      icon: subject.icon,
      examBoards: sortedBoards,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
