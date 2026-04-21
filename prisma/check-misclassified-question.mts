import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkQuestion() {
  const question = await prisma.question.findUnique({
    where: { id: "cmm5t1c3l00638urzi0nyilpb" },
  });

  if (!question) {
    console.log("Question not found");
    await prisma.$disconnect();
    return;
  }

  console.log("=== Potentially Misclassified Question ===\n");
  console.log("ID:", question.id);
  console.log("Question Type:", question.questionType);
  console.log("Age Range:", question.ageRange);
  console.log("\nFull Question Text:");
  console.log(question.questionText);
  console.log("\nOptions:", question.options);
  console.log("Correct Answer Index:", question.correctAnswer);
  console.log("Correct Answers:", question.correctAnswers);
  console.log("\nExplanation:");
  console.log(question.explanation);

  await prisma.$disconnect();
}

checkQuestion();
