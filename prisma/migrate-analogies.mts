import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function migrateAnalogies() {
  console.log("🔄 Migrating analogies to sentence_completion_analogies format...\n");

  // Get all analogies questions
  const analogies = await prisma.question.findMany({
    where: { questionType: "analogies" },
  });

  console.log(`Found ${analogies.length} analogies questions to convert\n`);

  const converted = [];

  for (const q of analogies) {
    // Parse the question text to extract the analogy structure
    // Example: "Complete the analogy.\nCow is to barn as sheep is to ___"
    const text = q.questionText;
    const lines = text.split("\n");
    const analogyLine = lines[lines.length - 1]; // Last line has the actual analogy

    // Extract parts: "X is to ___ as Y is to ___"
    // For now, we'll create a simple mapping based on the original question

    // Original question has one blank, we need to convert to two-column format
    // "Cow is to barn as sheep is to ___" with options ['field', 'pen', 'wool', 'farm']
    // We need to restructure this as:
    // "Cow is to ___ as sheep is to ___" with 6 options split into 2 columns

    console.log(`Converting: ${analogyLine}`);
    console.log(`Original options: ${JSON.stringify(q.options)}`);
    console.log(`Correct answer index: ${q.correctAnswer}`);

    // For the example "Cow is to barn as sheep is to ___", correct answer is index 1 (pen)
    // We need to convert this to: "Cow is to ___ as sheep is to ___"
    // with options split as [barn, grass, calf] and [pen, wool, farm]

    // Since we can't automatically determine all the options for both blanks,
    // let's manually specify the conversions based on the known questions

    let newQuestionText = "";
    let newOptions: string[] = [];
    let correctAnswers: number[] = [];

    if (analogyLine.includes("Cow is to barn as sheep is to")) {
      newQuestionText = "Mark two words, one from each column, that complete the sentence in the most sensible way.\n\nCow is to ___ as sheep is to ___.";
      newOptions = ["barn", "grass", "calf", "pen", "wool", "lamb"];
      correctAnswers = [0, 3]; // barn, pen
    } else if (analogyLine.includes("Book is to read as song is to")) {
      newQuestionText = "Mark two words, one from each column, that complete the sentence in the most sensible way.\n\nBook is to ___ as song is to ___.";
      newOptions = ["read", "write", "chapter", "listen", "sing", "music"];
      correctAnswers = [0, 3]; // read, listen
    } else {
      console.log(`⚠️  Unknown analogy format, skipping: ${analogyLine}`);
      continue;
    }

    converted.push({
      id: q.id,
      ageRange: q.ageRange,
      newQuestionText,
      newOptions,
      correctAnswers,
      oldQuestionText: q.questionText,
    });
  }

  console.log(`\n✅ Converted ${converted.length} questions\n`);

  // Now update or create these as sentence_completion_analogies
  for (const c of converted) {
    console.log(`Updating question ${c.id}...`);
    await prisma.question.update({
      where: { id: c.id },
      data: {
        questionType: "sentence_completion_analogies",
        questionText: c.newQuestionText,
        options: c.newOptions,
        correctAnswer: 0, // Not used for multi-select, but keep for backwards compatibility
        correctAnswers: c.correctAnswers,
      },
    });
  }

  console.log("\n✅ Migration complete!");
  await prisma.$disconnect();
}

migrateAnalogies();
