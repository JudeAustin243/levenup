import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkCompoundWords() {
  const questions = await prisma.question.findMany({
    where: { questionType: "compound_words" },
    include: { topic: true },
    take: 5,
  });

  console.log(`\nFound ${questions.length} compound word questions:`);
  questions.forEach((q) => {
    console.log(`\nQuestion: ${q.questionText?.substring(0, 80)}...`);
    console.log(`Topic: ${q.topic.name} (ID: ${q.topicId})`);
    console.log(`Options: ${(q.options as string[]).join(", ")}`);
  });

  await prisma.$disconnect();
}

checkCompoundWords();
