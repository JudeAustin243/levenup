import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

function generateSimilarOptions(correctAnswer: string): string[] {
  const [firstLetter, secondLetter] = correctAnswer.split("");
  const options: string[] = [correctAnswer];

  // Generate all possible letters (A-Z)
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Generate options with same first letter (different second letter)
  const sameFirstOptions = letters
    .filter(l => l !== secondLetter)
    .map(l => `${firstLetter}${l}`)
    .filter(opt => opt !== correctAnswer);

  // Generate options with same second letter (different first letter)
  const sameSecondOptions = letters
    .filter(l => l !== firstLetter)
    .map(l => `${l}${secondLetter}`)
    .filter(opt => opt !== correctAnswer);

  // Shuffle and pick options
  const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

  // Pick 2 options with same first letter
  const pickedSameFirst = shuffle(sameFirstOptions).slice(0, 2);

  // Pick 1 option with same second letter
  const pickedSameSecond = shuffle(sameSecondOptions).slice(0, 1);

  options.push(...pickedSameFirst, ...pickedSameSecond);

  // Shuffle all options to randomize position of correct answer
  return shuffle(options);
}

async function makeAlphabetHarder() {
  console.log("🔧 Making alphabet_series questions harder...\n");

  const questions = await prisma.question.findMany({
    where: {
      questionType: "alphabet_series",
      ageRange: { in: ["8-9", "9-10", "10-11"] },
    },
    orderBy: [{ ageRange: "asc" }, { id: "asc" }],
  });

  console.log(`Found ${questions.length} alphabet_series questions\n`);

  let updated = 0;

  for (const q of questions) {
    const oldOptions = q.options as string[];
    const correctAnswer = oldOptions[q.correctAnswer];

    // Generate new challenging options
    const newOptions = generateSimilarOptions(correctAnswer);
    const newCorrectIndex = newOptions.indexOf(correctAnswer);

    console.log(`🔧 Updating question ${q.id} (${q.ageRange})`);
    console.log(`   Question: ${q.questionText?.split("\n")[1]?.substring(0, 50) || ""}...`);
    console.log(`   Correct Answer: ${correctAnswer}`);
    console.log(`   Old Options: ${oldOptions.join(", ")}`);
    console.log(`   New Options: ${newOptions.join(", ")}`);
    console.log(`   New Index: ${newCorrectIndex}`);
    console.log("");

    await prisma.question.update({
      where: { id: q.id },
      data: {
        options: newOptions,
        correctAnswer: newCorrectIndex,
        correctAnswers: [newCorrectIndex],
      },
    });

    updated++;
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total questions updated: ${updated}`);
  console.log("\n✅ All alphabet series questions are now harder!");
  console.log("   Most options now share the first or second letter with the correct answer.");

  await prisma.$disconnect();
}

makeAlphabetHarder();
