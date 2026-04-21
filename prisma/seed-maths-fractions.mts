import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

interface RawQuestion {
  id: string;
  sub_topic: string;
  question_text: string;
  options: Record<string, string>;
  correct_option: string;
  explanation_steps: string[];
}

/** Convert sub_topic string to a snake_case questionType */
function toQuestionType(subTopic: string): string {
  return subTopic
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

/** Map A/B/C/D to 0/1/2/3 index */
const OPTION_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

/** Assign difficulty based on sub_topic complexity */
function assignDifficulty(subTopic: string): number {
  const lower = subTopic.toLowerCase();
  // Simpler fraction concepts
  if (lower === "fraction of an amount" || lower === "discrete grouping" || lower === "fractions and decimals" || lower === "fractions and percentages") return 2;
  // Moderate
  if (lower.includes("fraction of an amount") || lower === "discrete grouping with remainder" || lower === "pure mixed arithmetic" || lower === "reverse fraction of an amount") return 3;
  // Harder
  if (lower.includes("mixed number") || lower.includes("multi-step") || lower.includes("linguistic parsing")) return 4;
  // Hardest
  if (lower.includes("sequential remainder") || lower.includes("working backwards")) return 5;
  return 3;
}

async function main() {
  const raw: RawQuestion[] = JSON.parse(
    readFileSync("/Users/jameshe/Desktop/new maths qss.json", "utf-8")
  );

  console.log(`Loaded ${raw.length} questions from JSON`);

  // Delete existing fractions questions with examBoard=GL for the maths fractions topic
  const deleted = await prisma.question.deleteMany({
    where: {
      topicId: "top_frac",
      examBoard: "GL",
    },
  });
  console.log(`Deleted ${deleted.count} existing GL fractions questions`);

  let created = 0;
  for (const q of raw) {
    const optionValues = [q.options.A, q.options.B, q.options.C, q.options.D];
    const correctIndex = OPTION_INDEX[q.correct_option];
    const explanation = q.explanation_steps.join(" ");
    const questionType = toQuestionType(q.sub_topic);
    const difficulty = assignDifficulty(q.sub_topic);

    await prisma.question.create({
      data: {
        topicId: "top_frac",
        subtopic: q.sub_topic,
        questionText: q.question_text,
        options: optionValues,
        correctAnswer: correctIndex,
        explanation,
        difficulty,
        tags: ["numerical_fluency", "fractions"],
        type: "mcq",
        ageRange: "10-11",
        examBoard: "GL",
        questionType,
      },
    });
    created++;
  }

  console.log(`Created ${created} new GL fractions questions`);

  // Show summary by questionType
  const summary: Record<string, number> = {};
  for (const q of raw) {
    const qt = toQuestionType(q.sub_topic);
    summary[qt] = (summary[qt] || 0) + 1;
  }
  console.log("\nQuestions by type:");
  for (const [qt, count] of Object.entries(summary).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${qt}: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
