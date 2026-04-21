import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

console.log("🔄 Migrating letter completion questions to new CGP format...\n");

// Get all three_letter_completion questions
const oldQuestions = await prisma.question.findMany({
  where: { questionType: "three_letter_completion" },
  include: { _count: { select: { answers: true } } },
});

console.log(`Found ${oldQuestions.length} old format questions\n`);

// Check if any have answers
const questionsWithAnswers = oldQuestions.filter(q => q._count.answers > 0);
if (questionsWithAnswers.length > 0) {
  console.log(`⚠️  Warning: ${questionsWithAnswers.length} questions have student answers:`);
  questionsWithAnswers.forEach(q => {
    console.log(`   - Question ${q.id}: ${q._count.answers} answers`);
  });
  console.log("\nDeleting these questions will also delete the associated answers.");
  console.log("Consider exporting the data first if you want to preserve it.\n");
}

// Delete the old questions (this will cascade delete answers due to schema)
console.log("Deleting old three_letter_completion questions...");
const deleted = await prisma.question.deleteMany({
  where: { questionType: "three_letter_completion" },
});

console.log(`✅ Deleted ${deleted.count} questions\n`);

console.log("Next steps:");
console.log("1. Re-run the seed files to add the new format questions:");
console.log("   - For 10-11: npm run seed:gl-verbal (four_letter_completion)");
console.log("   - For 8-9: npm run seed:gl-verbal-8-9 (three_letter_completion)");

await prisma.$disconnect();
