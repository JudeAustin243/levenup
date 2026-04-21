import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixQuestion() {
  console.log("Finding question...\n");

  const question = await prisma.question.findFirst({
    where: {
      questionText: { contains: "DG is to WT as HL is to" }
    }
  });

  if (!question) {
    console.log("❌ Question not found in database");
    await prisma.$disconnect();
    return;
  }

  console.log("=== Current Data ===");
  console.log("Options:", question.options);
  console.log("Correct Answer:", question.correctAnswer);
  console.log("Correct Answers:", question.correctAnswers);

  const opts = question.options as string[];
  const soIndex = opts.indexOf("SO");

  if (soIndex === -1) {
    console.log("\n❌ 'SO' not found in options array!");
    await prisma.$disconnect();
    return;
  }

  console.log(`\n✓ Found 'SO' at index ${soIndex}`);
  console.log(`\nUpdating correctAnswer from ${question.correctAnswer} to ${soIndex}...`);

  await prisma.question.update({
    where: { id: question.id },
    data: {
      correctAnswer: soIndex,
      correctAnswers: [soIndex]
    }
  });

  console.log("\n✅ Question fixed!");
  console.log(`Correct answer is now index ${soIndex}: SO`);

  await prisma.$disconnect();
}

fixQuestion();
