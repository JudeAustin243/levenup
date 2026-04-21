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

function toQuestionType(subTopic: string): string {
  return subTopic
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

const OPTION_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

function loadFile(path: string): RawQuestion[] {
  let raw = readFileSync(path, "utf-8").trim();
  raw = raw.replace(/\]\s*\[/g, ",");
  const all: RawQuestion[] = JSON.parse(raw);
  // Deduplicate by ID
  const byId = new Map<string, RawQuestion>();
  for (const q of all) {
    if (!byId.has(q.id)) byId.set(q.id, q);
  }
  return [...byId.values()];
}

function assignDifficultyAlgebra(subTopic: string): number {
  const lower = subTopic.toLowerCase();
  if (lower === "linear progression" || lower === "disguised algebra") return 2;
  if (lower === "grouped variable sums" || lower === "associated properties") return 3;
  if (lower === "linear intersection" || lower === "associated property logic" || lower === "simultaneous logic") return 4;
  if (lower.includes("simultaneous equations") || lower.includes("multi-variable")) return 5;
  return 3;
}

function assignDifficultyProbability(subTopic: string): number {
  const lower = subTopic.toLowerCase();
  if (lower === "qualitative likelihood" || lower === "expected frequency") return 2;
  if (lower === "complementary fractions" || lower === "probability from a set") return 3;
  if (lower.includes("sample space")) return 4;
  if (lower.includes("combined") || lower === "changing probability") return 5;
  return 3;
}

interface SeedConfig {
  file: string;
  topicId: string;
  topicName: string;
  subjectId: string;
  order: number;
  tags: string[];
  assignDifficulty: (subTopic: string) => number;
}

async function seedTopic(config: SeedConfig) {
  console.log(`\n=== ${config.topicName} ===`);

  // Create topic if it doesn't exist
  const existing = await prisma.topic.findUnique({ where: { id: config.topicId } });
  if (!existing) {
    await prisma.topic.create({
      data: {
        id: config.topicId,
        name: config.topicName,
        subjectId: config.subjectId,
        order: config.order,
      },
    });
    console.log(`Created topic: ${config.topicName} (${config.topicId})`);
  } else {
    console.log(`Topic already exists: ${existing.name} (${config.topicId})`);
  }

  const questions = loadFile(config.file);
  console.log(`Loaded ${questions.length} unique questions`);

  // Delete existing GL questions for this topic
  const deleted = await prisma.question.deleteMany({
    where: { topicId: config.topicId, examBoard: "GL" },
  });
  console.log(`Deleted ${deleted.count} existing GL questions`);

  let created = 0;
  for (const q of questions) {
    const optionValues = [q.options.A, q.options.B, q.options.C, q.options.D];
    const correctIndex = OPTION_INDEX[q.correct_option];
    const explanation = q.explanation_steps.join(" ");
    const questionType = toQuestionType(q.sub_topic);
    const difficulty = config.assignDifficulty(q.sub_topic);

    await prisma.question.create({
      data: {
        topicId: config.topicId,
        subtopic: q.sub_topic,
        questionText: q.question_text,
        options: optionValues,
        correctAnswer: correctIndex,
        explanation,
        difficulty,
        tags: config.tags,
        type: "mcq",
        ageRange: "10-11",
        examBoard: "GL",
        questionType,
      },
    });
    created++;
  }

  console.log(`Created ${created} new GL questions`);

  // Summary
  const summary: Record<string, number> = {};
  for (const q of questions) {
    const qt = toQuestionType(q.sub_topic);
    summary[qt] = (summary[qt] || 0) + 1;
  }
  console.log("By question type:");
  for (const [qt, count] of Object.entries(summary).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${qt}: ${count}`);
  }
}

async function main() {
  await seedTopic({
    file: "/Users/jameshe/Desktop/11plus_Algebra_database.json",
    topicId: "top_alg",
    topicName: "Algebra",
    subjectId: "sub_maths",
    order: 7,
    tags: ["numerical_fluency", "algebra"],
    assignDifficulty: assignDifficultyAlgebra,
  });

  await seedTopic({
    file: "/Users/jameshe/Desktop/11plus_Probability_database.json",
    topicId: "top_prob",
    topicName: "Probability & Statistics",
    subjectId: "sub_maths",
    order: 8,
    tags: ["numerical_fluency", "probability"],
    assignDifficulty: assignDifficultyProbability,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
