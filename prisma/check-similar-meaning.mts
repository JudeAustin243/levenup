import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const similar = await prisma.question.findMany({
  where: { questionType: "similar_meaning", ageRange: "10-11" },
  select: { id: true, questionText: true, options: true, correctAnswer: true, correctAnswers: true },
  take: 3,
});

console.log("=== Current Similar Meaning Format ===\n");
similar.forEach((q, i) => {
  console.log(`${i + 1}. ${q.questionText.substring(0, 80)}...`);
  console.log(`   Options (${q.options?.length}):`, q.options);
  console.log(`   Correct Answer:`, q.correctAnswer);
  console.log(`   Correct Answers:`, q.correctAnswers);
  console.log("");
});

await prisma.$disconnect();
