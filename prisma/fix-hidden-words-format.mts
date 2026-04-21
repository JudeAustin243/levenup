import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixHiddenWordsFormat() {
  console.log("🔧 Fixing hidden words question formatting...\n");

  // Get all hidden words questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "hidden_words",
    },
  });

  console.log(`Found ${questions.length} hidden words questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Check if the format needs updating (instruction and sentence are together)
    // The pattern is: "...Find the hidden word. [SENTENCE]"
    const match = currentText.match(/^(In each sentence below.*?Find the hidden word\.)\s*(.+)$/s);

    if (match && !currentText.includes("\n")) {
      const instruction = match[1];
      const sentence = match[2];

      // New format with single newline to put sentence on separate line
      const newQuestionText = `${instruction}\n${sentence}`;

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

fixHiddenWordsFormat();
