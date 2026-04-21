import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixLetterCompletionDoubleFormat() {
  console.log("🔧 Fixing letter completion double question formatting...\n");

  // Get all letter_completion_double questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "letter_completion_double",
    },
  });

  console.log(`Found ${questions.length} letter completion double questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Match the instruction and word pairs (with or without newlines)
    // Pattern: "Find the letter...both pairs. [WORD PAIRS]"
    const match = currentText.match(/^(Find the letter that will finish the first word and start the second word of each pair\. The same letter must be used for both pairs\.)\s*(.+)$/s);

    if (match) {
      const instruction = match[1].trim();
      const wordPairs = match[2].trim();

      // New format with single newline - word pairs on separate line
      const newQuestionText = `${instruction}\n${wordPairs}`;

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

fixLetterCompletionDoubleFormat();
