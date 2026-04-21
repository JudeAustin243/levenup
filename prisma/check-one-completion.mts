import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const question = await prisma.question.findFirst({
  where: { questionType: "four_letter_completion" },
  select: {
    id: true,
    questionType: true,
    questionText: true,
    options: true,
    correctAnswer: true,
    ageRange: true,
    explanation: true
  },
});

if (question) {
  console.log("=== Sample Four-Letter Completion Question ===\n");
  console.log(`Type: ${question.questionType}`);
  console.log(`Age Range: ${question.ageRange}`);
  console.log(`\nQuestion Text:\n${question.questionText}`);
  console.log(`\nOptions: ${JSON.stringify(question.options)}`);
  console.log(`Correct Answer: ${question.correctAnswer} (${(question.options as string[])[question.correctAnswer]})`);
  console.log(`\nExplanation: ${question.explanation}`);
}

await prisma.$disconnect();
