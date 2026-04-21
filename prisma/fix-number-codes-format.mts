import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function fixNumberCodesFormat() {
  console.log("🔧 Fixing number codes question formatting...\n");

  const questions = await prisma.question.findMany({
    where: {
      questionType: "number_codes",
    },
  });

  console.log(`Found ${questions.length} number codes questions to update\n`);

  let updated = 0;

  for (const question of questions) {
    const currentText = question.questionText;

    // Parse the current format: "... Work out the code. PINE=1234, TONE=5624, KITE=7354. Find the code for the word TENT."
    // Extract the mappings and the final question
    const match = currentText.match(/^(The number codes for three of these four words are listed in a random order\. Work out the code)\. (.+?)\. (Find .+)$/);

    if (match) {
      const instruction = match[1];
      const mappings = match[2]; // e.g., "PINE=1234, TONE=5624, KITE=7354"
      const finalQuestion = match[3]; // e.g., "Find the code for the word TENT"

      // Parse the mappings to extract words and codes
      const pairs = mappings.split(", ").map(pair => {
        const [word, code] = pair.split("=");
        return { word, code };
      });

      // Build the list of all 4 words (3 with codes + 1 target)
      const wordsWithCodes = pairs.map(p => p.word);
      let allWords = [...wordsWithCodes];

      // Extract the 4th word based on question type
      const wordTargetMatch = finalQuestion.match(/Find the code for the word (\w+)/);
      if (wordTargetMatch) {
        // Type 1: "Find the code for the word X" - X is the 4th word
        const targetWord = wordTargetMatch[1];
        if (!wordsWithCodes.includes(targetWord)) {
          allWords.push(targetWord);
        }
      } else {
        // Type 2: "Find the word that has the number code Y" - need to get 4th word from options
        const options = question.options as string[];
        const correctAnswerIndex = question.correctAnswer;
        const correctWord = options[correctAnswerIndex];
        if (!wordsWithCodes.includes(correctWord)) {
          allWords.push(correctWord);
        }
      }

      // Extract just the codes
      const codes = pairs.map(p => p.code);

      // New format with single newlines
      const newQuestionText = `${instruction} to answer the questions.\n${allWords.join(" ")}\n${codes.join(" ")}\n${finalQuestion}`;

      // Only update if different
      if (currentText !== newQuestionText) {
        await prisma.question.update({
          where: { id: question.id },
          data: { questionText: newQuestionText },
        });

        console.log(`✓ Updated: ${question.id}`);
        updated++;
      }
    } else {
      console.log(`⚠️  Could not parse question ${question.id}: ${currentText}\n`);
    }
  }

  console.log(`\n✅ Updated ${updated} questions`);

  await prisma.$disconnect();
}

fixNumberCodesFormat();
