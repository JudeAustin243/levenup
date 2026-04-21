import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixCompoundQuestionFormat() {
  console.log("🔧 Fixing compound word question formatting...\n");

  // Get all compound word questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "compound_words",
    },
  });

  console.log(`Found ${questions.length} compound word questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const options = question.options as string[];
    const col1 = options.slice(0, 3);
    const col2 = options.slice(3, 6);

    // New format with single newline to put word lists on separate line
    const newQuestionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\n(${col1.join(" ")}) (${col2.join(" ")})`;

    // Only update if the format is different
    if (question.questionText !== newQuestionText) {
      await prisma.question.update({
        where: { id: question.id },
        data: { questionText: newQuestionText },
      });

      console.log(`✓ Updated: ${question.id}`);
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} questions`);

  await prisma.$disconnect();
}

fixCompoundQuestionFormat();
