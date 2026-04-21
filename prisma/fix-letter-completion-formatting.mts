import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixQuestionFormatting() {
  console.log("Updating question formatting...\n");

  // Question types that need formatting with their split patterns
  const questionPatterns = [
    {
      type: "letter_completion_double",
      pattern: /(.*?pairs\.\s*)(.+)/i,
      description: "Letter Completion"
    },
    {
      type: "alphabet_series",
      pattern: /(.*?help you\.\s*)(.+)/i,
      description: "Alphabet Series"
    }
  ];

  let totalUpdated = 0;

  for (const { type, pattern, description } of questionPatterns) {
    console.log(`\n=== Processing ${description} (${type}) ===`);

    const questions = await prisma.question.findMany({
      where: { questionType: type },
    });

    console.log(`Found ${questions.length} question(s)\n`);

    for (const question of questions) {
      // Check if questionText needs formatting
      const needsUpdate = question.questionText &&
        (question.questionText.includes("\n\n") || !question.questionText.includes("\n"));

      if (needsUpdate) {
        const hasPattern = question.questionText.match(pattern);

        if (hasPattern) {
          const instructions = hasPattern[1].trim();
          const questionPart = hasPattern[2].trim();
          const newText = `${instructions}\n${questionPart}`;

          await prisma.question.update({
            where: { id: question.id },
            data: { questionText: newText },
          });

          console.log(`✓ Updated question ID: ${question.id}`);
          console.log(`  Before: ${question.questionText.substring(0, 80)}...`);
          console.log(`  After:  ${newText.substring(0, 80)}...`);
          console.log("");
          totalUpdated++;
        } else {
          console.log(`⚠ Skipped question ${question.id} - pattern not matched`);
        }
      } else {
        console.log(`✓ Skipped question ${question.id} - already formatted correctly`);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total questions updated: ${totalUpdated}`);
  await prisma.$disconnect();
}

fixQuestionFormatting();
