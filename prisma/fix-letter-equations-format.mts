import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixLetterEquationsFormat() {
  console.log("🔧 Fixing letter equations question formatting...\n");

  // Get all letter equations questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "letter_equations",
    },
  });

  console.log(`Found ${questions.length} letter equations questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Match the instruction and everything after it (with or without newlines)
    // Split after "letter." - values and equation stay together
    const match = currentText.match(/^(Each letter stands for a number\. Work out the answer to each sum as a letter\.)\s*(.+)$/s);

    if (match) {
      const instruction = match[1].trim();
      const valuesAndEquation = match[2].trim();

      // New format with single newline - values and equation stay together on line 2
      const newQuestionText = `${instruction}\n${valuesAndEquation}`;

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

fixLetterEquationsFormat();
