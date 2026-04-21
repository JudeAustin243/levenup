import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkAlphabetCount() {
  console.log("🔍 Checking alphabet_series questions for Ages 8-9...\n");

  const questions = await prisma.question.findMany({
    where: {
      questionType: "alphabet_series",
      ageRange: "8-9",
    },
    select: {
      id: true,
      questionText: true,
      options: true,
      correctAnswer: true,
    },
  });

  console.log(`Found ${questions.length} alphabet_series questions\n`);

  questions.forEach((q, idx) => {
    console.log(`${idx + 1}. ID: ${q.id}`);
    console.log(`   Question: ${q.questionText?.split("\n")[1]?.substring(0, 60) || q.questionText?.substring(0, 60)}...`);
    console.log(`   Options: ${(q.options as string[]).join(", ")}`);
    console.log("");
  });

  await prisma.$disconnect();
}

checkAlphabetCount();
