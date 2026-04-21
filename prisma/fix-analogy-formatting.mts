import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixAnalogyFormatting() {
  console.log("🔧 Fixing analogy question formatting...\n");

  const questions = await prisma.question.findMany({
    where: { questionType: "analogies" },
  });

  console.log(`Found ${questions.length} analogy questions\n`);

  let updated = 0;

  for (const q of questions) {
    if (!q.questionText) continue;

    // Check if already formatted (has newline)
    if (q.questionText.includes("\n")) {
      console.log(`✓ Question ${q.id} already formatted correctly`);
      continue;
    }

    // Split at the first sentence (after "Complete the analogy.")
    const match = q.questionText.match(/(Complete the analogy\.\s*)(.+)/i);

    if (!match) {
      console.log(`⚠️  Skipped question ${q.id} - pattern not matched`);
      console.log(`   Text: ${q.questionText}`);
      continue;
    }

    const instruction = match[1].trim();
    const actualQuestion = match[2].trim();
    const newText = `${instruction}\n${actualQuestion}`;

    console.log(`🔧 Updating question ${q.id} (${q.ageRange})`);
    console.log(`   Before: ${q.questionText}`);
    console.log(`   After:  ${newText}`);
    console.log("");

    await prisma.question.update({
      where: { id: q.id },
      data: { questionText: newText },
    });

    updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total questions updated: ${updated}`);

  await prisma.$disconnect();
}

fixAnalogyFormatting();
