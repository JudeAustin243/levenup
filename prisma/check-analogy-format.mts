import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkAnalogyFormat() {
  console.log("🔍 Checking analogy questions...\n");

  // Check for different possible analogy question types
  const possibleTypes = ["analogy", "analogies", "word_analogy", "verbal_analogy"];

  for (const type of possibleTypes) {
    const questions = await prisma.question.findMany({
      where: { questionType: type },
      take: 3,
      select: {
        id: true,
        questionType: true,
        questionText: true,
        ageRange: true,
      },
    });

    if (questions.length > 0) {
      console.log(`\n=== Found ${questions.length} questions with type: ${type} ===`);
      questions.forEach((q, idx) => {
        console.log(`\n${idx + 1}. ID: ${q.id} | Age: ${q.ageRange}`);
        console.log(`   QuestionText:`);
        console.log(`   "${q.questionText}"`);
        console.log(`   Has newline: ${q.questionText?.includes("\n")}`);
      });
    }
  }

  // Also check all question types to find analogy-related ones
  console.log("\n\n=== All unique question types in database ===");
  const allTypes = await prisma.question.findMany({
    select: { questionType: true },
    distinct: ["questionType"],
  });

  console.log(allTypes.map(t => t.questionType).sort().join(", "));

  await prisma.$disconnect();
}

checkAnalogyFormat();
