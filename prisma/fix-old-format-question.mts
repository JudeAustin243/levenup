import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Find and delete the old format sentence_completion_analogies question
const oldFormatQuestions = await prisma.question.findMany({
  where: {
    questionType: "sentence_completion_analogies",
    questionText: {
      contains: "set of brackets",
    },
  },
  select: { id: true, questionText: true, options: true },
});

console.log(`Found ${oldFormatQuestions.length} old format questions:\n`);
oldFormatQuestions.forEach((q) => {
  console.log(`ID: ${q.id}`);
  console.log(`Text: ${q.questionText.substring(0, 100)}...`);
  console.log(`Options: ${JSON.stringify(q.options)}\n`);
});

// Update them to the correct format
for (const q of oldFormatQuestions) {
  await prisma.question.update({
    where: { id: q.id },
    data: {
      questionText: "Mark two words, one from each column, that complete the sentence in the most sensible way.\n\nCow is to ___ as sheep is to ___.",
      options: ["barn", "grass", "calf", "pen", "wool", "lamb"],
      correctAnswer: 0,
      correctAnswers: [0, 3], // barn, pen
    },
  });
  console.log(`✅ Updated question ${q.id}`);
}

console.log(`\n✅ Cleanup complete!`);
await prisma.$disconnect();
