import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Get a "find the word" type question
const question = await prisma.question.findFirst({
  where: {
    questionType: "number_codes",
    questionText: { contains: "Find the word that has" },
  },
});

if (question) {
  console.log("Question Text:");
  console.log(question.questionText);
  console.log("\nOptions:", question.options);
  console.log("Correct Answer Index:", question.correctAnswer);
  console.log("Correct Answer:", (question.options as string[])[question.correctAnswer]);
}

await prisma.$disconnect();
