import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function debugCompoundQuestions() {
  console.log("\n=== Checking Compound Words Questions ===\n");

  // Get all compound word questions
  const allQuestions = await prisma.question.findMany({
    where: {
      questionType: "compound_words",
    },
    orderBy: [
      { ageRange: "asc" },
      { difficulty: "asc" },
    ],
  });

  console.log(`Total compound word questions: ${allQuestions.length}\n`);

  // Group by age range and difficulty
  const byAgeRange = allQuestions.reduce((acc, q) => {
    const key = q.ageRange || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {} as Record<string, typeof allQuestions>);

  for (const [ageRange, questions] of Object.entries(byAgeRange)) {
    console.log(`\n=== Age Range: ${ageRange} ===`);
    console.log(`Total: ${questions.length} questions`);

    // Group by difficulty
    const byDifficulty = questions.reduce((acc, q) => {
      const key = q.difficulty;
      if (!acc[key]) acc[key] = [];
      acc[key].push(q);
      return acc;
    }, {} as Record<number, typeof questions>);

    for (const [difficulty, qs] of Object.entries(byDifficulty)) {
      console.log(`  Difficulty ${difficulty}: ${qs.length} questions`);
    }

    // Show each question
    questions.forEach((q, i) => {
      const options = q.options as string[];
      const correctAnswers = q.correctAnswers as number[];
      const word = options[correctAnswers[0]] + options[correctAnswers[1]];
      console.log(`  ${i + 1}. ${word} (difficulty ${q.difficulty})`);
      console.log(`     Options: ${options.join(", ")}`);

      // Check for alternative valid combinations
      const alternatives = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 6; j++) {
          if (i !== correctAnswers[0] || j !== correctAnswers[1]) {
            const combo = options[i] + options[j];
            alternatives.push(combo);
          }
        }
      }
      console.log(`     Other combos: ${alternatives.join(", ")}`);
      console.log("");
    });
  }

  await prisma.$disconnect();
}

debugCompoundQuestions();
