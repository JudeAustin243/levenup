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
  if (
    lower === "fraction of an amount" ||
    lower === "discrete grouping" ||
    lower === "fractions and decimals" ||
    lower === "fractions and percentages" ||
    lower === "comparing fractions" ||
    lower === "multiplying fractions"
  )
    return 2;
  // Moderate
  if (
    lower.includes("fraction of an amount") ||
    lower === "discrete grouping with remainder" ||
    lower === "pure mixed arithmetic" ||
    lower === "reverse fraction of an amount" ||
    lower === "fractions and money" ||
    lower === "fractions and time" ||
    lower === "fractions and ratios" ||
    lower === "fraction of a fraction" ||
    lower === "adding mixed numbers" ||
    lower === "subtracting mixed numbers"
  )
    return 3;
  // Harder
  if (
    lower.includes("mixed number") ||
    lower.includes("mixed numbers") ||
    lower.includes("mixed arithmetic") ||
    lower.includes("multi-step") ||
    lower.includes("multi_step") ||
    lower.includes("linguistic parsing") ||
    lower.includes("distance") ||
    lower.includes("conversion") ||
    lower.includes("finding the whole")
  )
    return 4;
  // Hardest
  if (
    lower.includes("sequential") ||
    lower.includes("working backwards")
  )
    return 5;
  return 3;
}

async function main() {
  // Load all 3 files
  const file1: RawQuestion[] = JSON.parse(
    readFileSync("/Users/jameshe/Desktop/new maths qss.json", "utf-8")
  );
  const file2: RawQuestion[] = JSON.parse(
    readFileSync("/Users/jameshe/Desktop/11plus_Fractions_database copy.json", "utf-8")
  );

  // File 3 has concatenated JSON arrays - fix by replacing ][ with ,
  let raw3 = readFileSync("/Users/jameshe/Desktop/11plus_Fractions_database.json", "utf-8").trim();
  raw3 = raw3.replace(/\]\s*\[/g, ",");
  const file3: RawQuestion[] = JSON.parse(raw3);

  console.log(`File 1: ${file1.length}, File 2: ${file2.length}, File 3: ${file3.length}`);

  // Deduplicate across all files
  const allById = new Map<string, RawQuestion>();
  const alreadySeededIds = new Set(file1.map((q) => q.id));

  for (const q of [...file1, ...file2, ...file3]) {
    if (!allById.has(q.id)) {
      allById.set(q.id, q);
    }
  }

  const newQuestions = [...allById.values()].filter(
    (q) => !alreadySeededIds.has(q.id)
  );
  console.log(
    `Total unique: ${allById.size}, already seeded: ${alreadySeededIds.size}, new: ${newQuestions.length}`
  );

  if (newQuestions.length === 0) {
    console.log("No new questions to seed.");
    return;
  }

  let created = 0;
  let skipped = 0;
  for (const q of newQuestions) {
    // Check if question already exists by looking for matching questionText + topicId
    const existing = await prisma.question.findFirst({
      where: {
        topicId: "top_frac",
        questionText: q.question_text,
        examBoard: "GL",
      },
      select: { id: true },
    });

    if (existing) {
      skipped++;
      continue;
    }

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

  console.log(`Created ${created} new GL fractions questions (skipped ${skipped} duplicates)`);

  // Show summary by questionType
  const summary: Record<string, number> = {};
  for (const q of newQuestions) {
    const qt = toQuestionType(q.sub_topic);
    summary[qt] = (summary[qt] || 0) + 1;
  }
  console.log("\nNew questions by type:");
  for (const [qt, count] of Object.entries(summary).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
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
