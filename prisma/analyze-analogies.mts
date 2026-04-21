import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Get all analogies questions for 10-11
const analogies = await prisma.question.findMany({
  where: { questionType: "analogies", ageRange: "10-11" },
  select: { id: true, questionText: true, options: true, correctAnswer: true },
});

console.log("=== Analogies Questions (10-11) ===");
console.log("Total:", analogies.length);
analogies.slice(0, 5).forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.questionText}`);
  console.log("Options:", q.options);
  console.log("Correct:", q.correctAnswer);
});

// Get opposite_meaning format
const opposite = await prisma.question.findFirst({
  where: { questionType: "opposite_meaning" },
  select: {
    questionText: true,
    options: true,
    correctAnswer: true,
    correctAnswers: true,
  },
});

console.log("\n\n=== Opposite Meaning Format Example ===");
console.log("Question:", opposite?.questionText);
console.log("Options:", opposite?.options);
console.log("Correct Answer:", opposite?.correctAnswer);
console.log("Correct Answers:", opposite?.correctAnswers);

// Get sentence_completion_analogies format
const sentenceAnalogy = await prisma.question.findFirst({
  where: { questionType: "sentence_completion_analogies" },
  select: {
    questionText: true,
    options: true,
    correctAnswer: true,
    correctAnswers: true,
  },
});

console.log("\n\n=== Sentence Completion Analogies Format Example ===");
console.log("Question:", sentenceAnalogy?.questionText);
console.log("Options:", sentenceAnalogy?.options);
console.log("Correct Answer:", sentenceAnalogy?.correctAnswer);
console.log("Correct Answers:", sentenceAnalogy?.correctAnswers);

await prisma.$disconnect();
