import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixAlphabetCount() {
  console.log("🔧 Fixing alphabet_series count for Ages 8-9...\n");

  const questions = await prisma.question.findMany({
    where: {
      questionType: "alphabet_series",
      ageRange: "8-9",
    },
    orderBy: { id: "desc" }, // Get the most recently added one
    take: 1,
  });

  if (questions.length === 0) {
    console.log("No questions to delete");
    await prisma.$disconnect();
    return;
  }

  const toDelete = questions[0];
  const lines = toDelete.questionText?.split("\n") || [];
  const actualQ = lines.length > 1 ? lines[1] : lines[0];

  console.log("⚠️  Will delete the most recent question:");
  console.log(`   ID: ${toDelete.id}`);
  console.log(`   Question: ${actualQ}`);
  console.log(`   Options: ${(toDelete.options as string[]).join(", ")}`);
  console.log("");

  // First, delete any associated answers
  const answers = await prisma.answer.deleteMany({
    where: { questionId: toDelete.id },
  });

  if (answers.count > 0) {
    console.log(`   Deleted ${answers.count} associated answer(s)`);
  }

  // Now delete the question
  await prisma.question.delete({
    where: { id: toDelete.id },
  });

  console.log("✅ Question deleted!");
  console.log("   Ages 8-9 alphabet_series now has 10 questions\n");

  await prisma.$disconnect();
}

fixAlphabetCount();
