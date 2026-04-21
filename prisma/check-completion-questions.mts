import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const threeLetterQuestions = await prisma.question.findMany({
  where: {
    OR: [
      { questionType: "three_letter_completion" },
      { questionType: "four_letter_completion" }
    ]
  },
  select: {
    id: true,
    questionType: true,
    questionText: true,
    options: true,
    correctAnswer: true,
    ageRange: true
  },
});

console.log("=== Current Letter Completion Questions ===\n");
console.log(`Total: ${threeLetterQuestions.length}\n`);

threeLetterQuestions.forEach((q, i) => {
  console.log(`${i + 1}. [${q.ageRange}] ${q.questionType}`);
  console.log(`   Text: ${q.questionText.substring(0, 100)}...`);
  console.log(`   Options: ${JSON.stringify(q.options)}`);
  console.log(`   Correct: ${q.correctAnswer}`);
  console.log("");
});

await prisma.$disconnect();
