import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const questions = await prisma.question.findMany({
  where: { questionType: "number_codes" },
  take: 5,
});

questions.forEach((q, i) => {
  console.log(`\n--- Question ${i + 1} ---`);
  console.log("Text:", q.questionText);
  console.log("Correct Answer Index:", q.correctAnswer);
  console.log("Options:", q.options);
});

await prisma.$disconnect();
