import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixMissingNumberEquationsFormat() {
  console.log("🔧 Fixing missing number equations question formatting...\n");

  // Get all missing_number_equations questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "missing_number_equations",
    },
  });

  console.log(`Found ${questions.length} missing number equations questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Match the instruction and equation (with or without newlines)
    // Pattern: "Find the missing number to complete each sum. [EQUATION]"
    const match = currentText.match(/^(Find the missing number to complete each sum\.)\s*(.+)$/s);

    if (match) {
      const instruction = match[1].trim();
      const equation = match[2].trim();

      // New format with single newline - equation on separate line
      const newQuestionText = `${instruction}\n${equation}`;

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

fixMissingNumberEquationsFormat();
