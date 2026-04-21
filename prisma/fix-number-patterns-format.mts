import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixNumberPatternsFormat() {
  console.log("🔧 Fixing number patterns question formatting...\n");

  const questions = await prisma.question.findMany({
    where: {
      questionType: "number_patterns",
    },
  });

  console.log(`Found ${questions.length} number patterns questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Match the instruction and the pattern
    // Pattern: "Find the number that completes... two sets. 2 (11) 9, 5 (13) 8, 6 ( ___ ) 10"
    const match = currentText.match(/^(Find the number that completes the final set of numbers in the same way as the first two sets\.)\s*(.+)$/);

    if (match) {
      const instruction = match[1].trim();
      const pattern = match[2].trim();

      // New format with single newline - pattern on separate line
      const newQuestionText = `${instruction}\n${pattern}`;

      // Only update if different
      if (currentText !== newQuestionText) {
        await prisma.question.update({
          where: { id: question.id },
          data: { questionText: newQuestionText },
        });

        console.log(`✓ Updated: ${question.id}`);
        updated++;
      }
    }
  }

  console.log(`\n✅ Updated ${updated} questions`);

  await prisma.$disconnect();
}

fixNumberPatternsFormat();
