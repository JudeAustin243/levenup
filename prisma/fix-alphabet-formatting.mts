import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixAlphabetFormatting() {
  console.log("🔧 Fixing alphabet_series question formatting...\n");

  const questions = await prisma.question.findMany({
    where: { questionType: "alphabet_series" },
  });

  console.log(`Found ${questions.length} alphabet_series questions\n`);

  let updated = 0;

  for (const q of questions) {
    if (!q.questionText) continue;

    const lines = q.questionText.split("\n");

    // Check if it's the problematic format (all on one line with instruction + question)
    if (lines.length === 1 && q.questionText.includes("Mark the pair of letters")) {
      const match = q.questionText.match(/(.*?help you\.\s*)(.+)/i);

      if (match) {
        const instruction = match[1].trim();
        const actualQuestion = match[2].trim();
        const newText = `${instruction}\n${actualQuestion}`;

        console.log(`🔧 Updating question ${q.id} (${q.ageRange})`);
        console.log(`   Before: ${q.questionText.substring(0, 80)}...`);
        console.log(`   After:  ${newText.substring(0, 80)}...`);
        console.log("");

        await prisma.question.update({
          where: { id: q.id },
          data: { questionText: newText },
        });

        updated++;
      }
    }

    // Also fix correctAnswers if it's null
    if (q.correctAnswers === null && q.correctAnswer !== null) {
      console.log(`🔧 Fixing correctAnswers for question ${q.id}`);
      await prisma.question.update({
        where: { id: q.id },
        data: { correctAnswers: [q.correctAnswer] },
      });
      updated++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total questions updated: ${updated}`);

  await prisma.$disconnect();
}

fixAlphabetFormatting();
