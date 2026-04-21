import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Verify the converted questions
const sentenceAnalogies = await prisma.question.findMany({
  where: { questionType: "sentence_completion_analogies", ageRange: "10-11" },
  select: { id: true, questionText: true, options: true, correctAnswers: true },
});

console.log("=== Sentence Completion Analogies (10-11) ===");
console.log("Total:", sentenceAnalogies.length, "\n");
sentenceAnalogies.forEach((q, i) => {
  const preview = q.questionText.split("\n").pop() || q.questionText;
  console.log(`${i + 1}. ${preview}`);
  console.log(`   Options: ${JSON.stringify(q.options)}`);
  console.log(`   Correct Answers: ${JSON.stringify(q.correctAnswers)}`);
  console.log("");
});

// Check if there are any remaining "analogies" type questions
const remainingAnalogies = await prisma.question.count({
  where: { questionType: "analogies" },
});

console.log(`\nRemaining "analogies" questions: ${remainingAnalogies}`);

await prisma.$disconnect();
