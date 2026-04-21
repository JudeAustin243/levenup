import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const question = await prisma.question.findFirst({
  where: { questionType: "number_codes" },
});

if (question) {
  console.log("Question Text:", question.questionText);
  console.log("Options:", question.options);
  console.log("Correct Answer:", question.correctAnswer);
  console.log("Metadata:", question.metadata);
}

await prisma.$disconnect();
