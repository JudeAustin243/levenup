import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

console.log("🔄 Migrating similar_meaning to two-column format...\n");

// Get all similar_meaning questions
const similarQuestions = await prisma.question.findMany({
  where: { questionType: "similar_meaning" },
});

console.log(`Found ${similarQuestions.length} similar_meaning questions to convert\n`);

// Conversion mapping based on the seed file patterns
const conversions: Record<
  string,
  { newQuestionText: string; newOptions: string[]; correctAnswers: number[] }
> = {
  // Pattern: (big large) (huge giant) tiny small great enormous mighty
  "big large": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["big", "large", "huge", "enormous", "giant", "mighty"],
    correctAnswers: [0, 3], // big and enormous
  },
  // Pattern: (fast quick) (rapid swift) slow speedy lazy hasty calm
  "fast quick": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["fast", "quick", "rapid", "speedy", "swift", "hasty"],
    correctAnswers: [0, 3], // fast and speedy
  },
  // Pattern: (happy glad) (cheerful jolly) sad joyful upset merry gloomy
  "happy glad": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["happy", "glad", "cheerful", "joyful", "jolly", "merry"],
    correctAnswers: [0, 3], // happy and joyful
  },
  // Pattern: (small tiny) (little petite) large miniature huge short big
  "small tiny": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["small", "tiny", "little", "miniature", "petite", "short"],
    correctAnswers: [0, 3], // small and miniature
  },
  // Pattern: (brave bold) (courageous daring) fearful timid valiant scared heroic
  "brave bold": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["brave", "bold", "courageous", "valiant", "daring", "heroic"],
    correctAnswers: [0, 3], // brave and valiant
  },
  // Pattern: (clever smart) (intelligent bright) dull wise stupid brilliant foolish
  "clever smart": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["clever", "smart", "intelligent", "brilliant", "bright", "wise"],
    correctAnswers: [0, 3], // clever and brilliant
  },
  // Pattern: (cold chilly) (freezing icy) warm frosty hot cool mild
  "cold chilly": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["cold", "chilly", "freezing", "frosty", "icy", "cool"],
    correctAnswers: [0, 3], // cold and frosty
  },
  // Pattern: (old ancient) (aged elderly) young antique modern senior youthful
  "old ancient": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["old", "ancient", "aged", "antique", "elderly", "senior"],
    correctAnswers: [0, 3], // old and antique
  },
  // Pattern: (loud noisy) (deafening booming) quiet thunderous silent soft peaceful
  "loud noisy": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["loud", "noisy", "deafening", "thunderous", "booming", "roaring"],
    correctAnswers: [0, 3], // loud and thunderous
  },
  // Pattern: (wet damp) (moist soaked) dry soggy arid parched humid
  "wet damp": {
    newQuestionText:
      "Mark two words, one from each column, that have a similar meaning.",
    newOptions: ["wet", "damp", "moist", "soggy", "soaked", "humid"],
    correctAnswers: [0, 3], // wet and soggy
  },
};

// Update each question
for (const q of similarQuestions) {
  const text = q.questionText.toLowerCase();

  // Try to match the question to a conversion pattern
  let matched = false;
  for (const [pattern, conversion] of Object.entries(conversions)) {
    if (text.includes(pattern)) {
      console.log(`Updating question ${q.id}: ${pattern}`);
      await prisma.question.update({
        where: { id: q.id },
        data: {
          questionText: conversion.newQuestionText,
          options: conversion.newOptions,
          correctAnswer: 0, // Keep for backwards compatibility
          correctAnswers: conversion.correctAnswers,
        },
      });
      matched = true;
      break;
    }
  }

  if (!matched) {
    console.log(`⚠️  Could not match question ${q.id}, skipping`);
  }
}

console.log("\n✅ Migration complete!");
await prisma.$disconnect();
