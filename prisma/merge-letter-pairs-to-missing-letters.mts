import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function mergeLetterPairsToMissingLetters() {
  console.log("🔧 Merging Letter Pair Completion into Missing Letters...\n");

  // Get all letter_pair_completion questions
  const questions = await prisma.question.findMany({
    where: {
      questionType: "letter_pair_completion",
    },
  });

  console.log(`Found ${questions.length} letter pair questions to convert\n`);

  let updated = 0;

  for (const question of questions) {
    await prisma.question.update({
      where: { id: question.id },
      data: {
        questionType: "letter_completion_double"
      },
    });

    console.log(`✓ Converted to Missing Letters: ${question.id}`);
    updated++;
  }

  console.log(`\n✅ Converted ${updated} questions from Letter Pairs to Missing Letters`);

  await prisma.$disconnect();
}

mergeLetterPairsToMissingLetters();
