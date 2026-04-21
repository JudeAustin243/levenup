import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkExplanations() {
  console.log("\n=== Regular Questions ===\n");

  const regularQ = await prisma.question.findFirst({
    where: {
      questionType: "compound_words",
      difficulty: { lt: 5 },
    },
  });

  if (regularQ) {
    console.log(`Question: ${regularQ.questionText}`);
    console.log(`Options: ${(regularQ.options as string[]).join(", ")}`);
    console.log(`Correct Answer: ${regularQ.correctAnswers}`);
    console.log(`Explanation: ${regularQ.explanation}\n`);
  }

  console.log("\n=== Challenge Questions ===\n");

  const challengeQ = await prisma.question.findFirst({
    where: {
      questionType: "compound_words",
      difficulty: { gte: 5 },
    },
  });

  if (challengeQ) {
    console.log(`Question: ${challengeQ.questionText}`);
    console.log(`Options: ${(challengeQ.options as string[]).join(", ")}`);
    console.log(`Correct Answer: ${challengeQ.correctAnswers}`);
    console.log(`Explanation: ${challengeQ.explanation}\n`);
  }

  await prisma.$disconnect();
}

checkExplanations();
