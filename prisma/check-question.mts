import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkQuestion() {
  const question = await prisma.question.findFirst({
    where: {
      questionText: { contains: "DG is to WT as HL is to" }
    }
  });

  if (question) {
    console.log("\n=== Question Found ===");
    console.log("ID:", question.id);
    console.log("Question:", question.questionText);
    console.log("Options:", question.options);
    console.log("Correct Answer Index:", question.correctAnswer);
    console.log("Correct Answers Array:", question.correctAnswers);
    console.log("Explanation:", question.explanation);
    console.log("\n=== Analysis ===");
    const opts = question.options as string[];
    console.log(`Option at index ${question.correctAnswer}:`, opts[question.correctAnswer]);
    console.log("\nShould be: SO (according to explanation)");
  } else {
    console.log("Question not found in database");
  }

  await prisma.$disconnect();
}

checkQuestion();
