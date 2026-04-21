import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function verifyAllAlphabetSeries() {
  console.log("🔍 Checking all alphabet_series questions...\n");

  const questions = await prisma.question.findMany({
    where: { questionType: "alphabet_series" },
    orderBy: [{ ageRange: "asc" }, { id: "asc" }],
  });

  console.log(`Found ${questions.length} alphabet series questions\n`);

  const errors: Array<{
    id: string;
    ageRange: string | null;
    questionText: string;
    issue: string;
    currentAnswer: string;
    expectedAnswer: string;
    correctIndex: number;
  }> = [];

  for (const q of questions) {
    const opts = q.options as string[];
    const explanation = q.explanation || "";

    // Extract the expected answer from explanation (format: "So XY → ZZ.")
    const match = explanation.match(/So\s+\w+\s*→\s*(\w+)/i);

    if (!match) {
      console.log(`⚠️  Question ${q.id} (${q.ageRange}): No "So ... → ANSWER" pattern in explanation`);
      continue;
    }

    const expectedAnswer = match[1].toUpperCase();
    const currentAnswerIndex = q.correctAnswer;
    const currentAnswer = opts[currentAnswerIndex];

    // Find where the expected answer is in the options
    const correctIndex = opts.findIndex(opt => opt.toUpperCase() === expectedAnswer);

    if (correctIndex === -1) {
      console.log(`❌ Question ${q.id} (${q.ageRange}): Expected answer "${expectedAnswer}" not found in options!`);
      console.log(`   Options: ${opts.join(", ")}`);
      errors.push({
        id: q.id,
        ageRange: q.ageRange,
        questionText: q.questionText?.substring(0, 60) + "..." || "",
        issue: "Expected answer not in options",
        currentAnswer,
        expectedAnswer,
        correctIndex: -1,
      });
      continue;
    }

    if (currentAnswerIndex !== correctIndex) {
      console.log(`❌ Question ${q.id} (${q.ageRange}): MISMATCH`);
      console.log(`   Question: ${q.questionText?.split("\n")[1]?.substring(0, 50)}...`);
      console.log(`   Current answer (index ${currentAnswerIndex}): ${currentAnswer}`);
      console.log(`   Expected answer (index ${correctIndex}): ${expectedAnswer}`);
      console.log(`   Options: ${opts.join(", ")}`);
      console.log("");

      errors.push({
        id: q.id,
        ageRange: q.ageRange,
        questionText: q.questionText?.substring(0, 60) + "..." || "",
        issue: "Wrong correctAnswer index",
        currentAnswer,
        expectedAnswer,
        correctIndex,
      });
    } else {
      console.log(`✓ Question ${q.id} (${q.ageRange}): Correct`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total questions checked: ${questions.length}`);
  console.log(`Errors found: ${errors.length}`);

  if (errors.length > 0) {
    console.log("\n❌ ERRORS FOUND:\n");
    errors.forEach((err) => {
      console.log(`ID: ${err.id} | Age: ${err.ageRange || "N/A"}`);
      console.log(`   Issue: ${err.issue}`);
      console.log(`   Current: ${err.currentAnswer} | Expected: ${err.expectedAnswer}`);
      if (err.correctIndex >= 0) {
        console.log(`   Fix: Update correctAnswer from current to ${err.correctIndex}`);
      }
      console.log("");
    });

    console.log("\n🔧 To fix these errors, run: npx tsx prisma/fix-all-alphabet-series.mts");
  } else {
    console.log("\n✅ All alphabet series questions are correct!");
  }

  await prisma.$disconnect();
}

verifyAllAlphabetSeries();
