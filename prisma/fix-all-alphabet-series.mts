import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixAllAlphabetSeries() {
  console.log("🔧 Fixing all alphabet_series questions...\n");

  const questions = await prisma.question.findMany({
    where: { questionType: "alphabet_series" },
    orderBy: [{ ageRange: "asc" }, { id: "asc" }],
  });

  console.log(`Found ${questions.length} alphabet series questions\n`);

  let fixedCount = 0;
  let errorCount = 0;

  for (const q of questions) {
    const opts = q.options as string[];
    const explanation = q.explanation || "";

    // Extract the expected answer from explanation (format: "So XY → ZZ.")
    const match = explanation.match(/So\s+\w+\s*→\s*(\w+)/i);

    if (!match) {
      console.log(`⚠️  Skipped ${q.id}: No "So ... → ANSWER" pattern in explanation`);
      errorCount++;
      continue;
    }

    const expectedAnswer = match[1].toUpperCase();
    const currentAnswerIndex = q.correctAnswer;

    // Find where the expected answer is in the options
    const correctIndex = opts.findIndex(opt => opt.toUpperCase() === expectedAnswer);

    if (correctIndex === -1) {
      console.log(`❌ Skipped ${q.id}: Expected answer "${expectedAnswer}" not found in options`);
      errorCount++;
      continue;
    }

    if (currentAnswerIndex !== correctIndex) {
      console.log(`🔧 Fixing question ${q.id} (${q.ageRange})`);
      console.log(`   Question: ${q.questionText?.split("\n")[1]?.substring(0, 50)}...`);
      console.log(`   Changing correctAnswer from ${currentAnswerIndex} (${opts[currentAnswerIndex]}) to ${correctIndex} (${expectedAnswer})`);

      await prisma.question.update({
        where: { id: q.id },
        data: {
          correctAnswer: correctIndex,
          correctAnswers: [correctIndex],
        },
      });

      fixedCount++;
      console.log(`   ✅ Fixed!\n`);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total questions checked: ${questions.length}`);
  console.log(`Questions fixed: ${fixedCount}`);
  console.log(`Errors/Skipped: ${errorCount}`);

  if (fixedCount > 0) {
    console.log("\n✅ All fixable alphabet series questions have been corrected!");
    console.log("🔄 Refresh your practice page to see the changes.");
  } else {
    console.log("\n✅ No fixes needed - all questions were already correct!");
  }

  await prisma.$disconnect();
}

fixAllAlphabetSeries();
