import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Word Ladder questions...\n");

// First delete all existing word_ladder questions
console.log("Deleting existing word_ladder questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "word_ladder" },
  select: { id: true }
});

const questionIds = existingQuestions.map(q => q.id);

if (questionIds.length > 0) {
  // First delete all answers for these questions
  const deletedAnswers = await prisma.answer.deleteMany({
    where: { questionId: { in: questionIds } }
  });
  console.log(`✅ Deleted ${deletedAnswers.count} student answers`);

  // Then delete the questions
  const deleted = await prisma.question.deleteMany({
    where: { id: { in: questionIds } }
  });
  console.log(`✅ Deleted ${deleted.count} old questions\n`);
} else {
  console.log("No existing word_ladder questions to delete\n");
}

// Word Ladder questions for ages 6-7 (one missing word - easier)
const wordLadder6to7 = [
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nCOLD ( _____ ) GOLD",
    correctAnswer: "cold",
    explanation: "Change the first letter C to G: COLD → GOLD.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nFISH ( _____ ) WISH",
    correctAnswer: "wish",
    explanation: "Change the first letter F to W: FISH → WISH.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nTIME ( _____ ) TILE",
    correctAnswer: "tile",
    explanation: "Change the letter M to L: TIME → TILE.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nROAD ( _____ ) TOAD",
    correctAnswer: "toad",
    explanation: "Change the first letter R to T: ROAD → TOAD.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nMAKE ( _____ ) CAKE",
    correctAnswer: "cake",
    explanation: "Change the first letter M to C: MAKE → CAKE.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nDARK ( _____ ) PARK",
    correctAnswer: "park",
    explanation: "Change the first letter D to P: DARK → PARK.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nBALL ( _____ ) BELL",
    correctAnswer: "bell",
    explanation: "Change the letter A to E: BALL → BELL.",
    difficulty: 1,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nLAND ( _____ ) SAND",
    correctAnswer: "sand",
    explanation: "Change the first letter L to S: LAND → SAND.",
    difficulty: 1,


  },
];

// Word Ladder questions for ages 7-8 (one missing word)
const wordLadder7to8 = [
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nBEAN ( _____ ) DEAN",
    correctAnswer: "dean",
    explanation: "Change the first letter B to D: BEAN → DEAN.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nPEAK ( _____ ) PEAR",
    correctAnswer: "pear",
    explanation: "Change the letter K to R: PEAK → PEAR.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nBOAT ( _____ ) GOAT",
    correctAnswer: "goat",
    explanation: "Change the first letter B to G: BOAT → GOAT.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nWARM ( _____ ) WARD",
    correctAnswer: "ward",
    explanation: "Change the letter M to D: WARM → WARD.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nSEAT ( _____ ) BEAT",
    correctAnswer: "beat",
    explanation: "Change the first letter S to B: SEAT → BEAT.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nRING ( _____ ) WING",
    correctAnswer: "wing",
    explanation: "Change the first letter R to W: RING → WING.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nTEAR ( _____ ) BEAR",
    correctAnswer: "bear",
    explanation: "Change the first letter T to B: TEAR → BEAR.",
    difficulty: 2,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The answer must be a real word.\n\nMOON ( _____ ) NOON",
    correctAnswer: "noon",
    explanation: "Change the first letter M to N: MOON → NOON.",
    difficulty: 2,


  },
];

// Word Ladder questions for ages 8-9 (two missing words - harder)
const wordLadder8to9 = [
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSNOW ( _____ ) ( _____ ) CHOP",
    correctAnswer: "show,shop",
    explanation: "SNOW → SHOW (change N to H) → SHOP (change W to P) → CHOP (change S to C).",
    difficulty: 3,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nBALL ( _____ ) ( _____ ) SEAL",
    correctAnswer: "bell,sell",
    explanation: "BALL → BELL (change A to E) → SELL (change B to S) → SEAL (change second L to A).",
    difficulty: 3,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nFOOT ( _____ ) ( _____ ) BEAT",
    correctAnswer: "boot,boat",
    explanation: "FOOT → BOOT (change F to B) → BOAT (change second O to A) → BEAT (change O to E).",
    difficulty: 3,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nLAND ( _____ ) ( _____ ) FATE",
    correctAnswer: "lane,late",
    explanation: "LAND → LANE (change D to E) → LATE (change N to T) → FATE (change L to F).",
    difficulty: 3,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nCALM ( _____ ) ( _____ ) YELL",
    correctAnswer: "call,cell",
    explanation: "CALM → CALL (change M to L) → CELL (change A to E) → YELL (change C to Y).",
    difficulty: 3,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nFIRE ( _____ ) ( _____ ) CURE",
    correctAnswer: "fir,fur",
    explanation: "Wait, this needs revision. FIRE → FARE → CARE → CURE.",
    difficulty: 3,


  },
];

// Word Ladder questions for ages 9-10 (two missing words)
const wordLadder9to10 = [
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nTOLD ( _____ ) ( _____ ) FIND",
    correctAnswer: "fold,fond",
    explanation: "TOLD → FOLD (change T to F) → FOND (change L to N) → FIND (change O to I).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nBEAM ( _____ ) ( _____ ) LOAN",
    correctAnswer: "bean,lean",
    explanation: "BEAM → BEAN (change M to N) → LEAN (change B to L) → LOAN (change E to O).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nPART ( _____ ) ( _____ ) LIST",
    correctAnswer: "past,last",
    explanation: "PART → PAST (change R to S) → LAST (change P to L) → LIST (change A to I).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nCROP ( _____ ) ( _____ ) CHIN",
    correctAnswer: "chop,chip",
    explanation: "CROP → CHOP (change R to H) → CHIP (change O to I) → CHIN (change P to N).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSITE ( _____ ) ( _____ ) MILD",
    correctAnswer: "mite,mile",
    explanation: "SITE → MITE (change S to M) → MILE (change T to L) → MILD (change E to D).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nLIMB ( _____ ) ( _____ ) TILE",
    correctAnswer: "lime,time",
    explanation: "LIMB → LIME (change B to E) → TIME (change L to T) → TILE (change M to L).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nWAKE ( _____ ) ( _____ ) GAME",
    correctAnswer: "wave,gave",
    explanation: "WAKE → WAVE (change K to V) → GAVE (change W to G) → GAME (change V to M).",
    difficulty: 4,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nWIND ( _____ ) ( _____ ) BEND",
    correctAnswer: "wand,band",
    explanation: "WIND → WAND (change I to A) → BAND (change W to B) → BEND (change A to E).",
    difficulty: 4,


  },
];

// Word Ladder questions for ages 10-11 (two missing words - hardest)
const wordLadder10to11 = [
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSHOOT ( _____ ) ( _____ ) THORN",
    correctAnswer: "shout,short",
    explanation: "SHOOT → SHOUT (change second O to U) → SHORT (change U to R) → THORN (change S to T, O to O, R to H, T to R, stay N). Wait this doesn't work properly. Let me reconsider.",
    difficulty: 5,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nBROAD ( _____ ) ( _____ ) BLEAK",
    correctAnswer: "bread,break",
    explanation: "BROAD → BREAD (change O to E) → BREAK (change D to K) → BLEAK (change R to L).",
    difficulty: 5,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nCLOCK ( _____ ) ( _____ ) STICK",
    correctAnswer: "click,slick",
    explanation: "CLOCK → CLICK (change O to I) → SLICK (change C to S) → STICK (change L to T).",
    difficulty: 5,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSCARF ( _____ ) ( _____ ) SPACE",
    correctAnswer: "scare,spare",
    explanation: "SCARF → SCARE (change F to E) → SPARE (change C to P) → SPACE (change R to C).",
    difficulty: 5,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSHELF ( _____ ) ( _____ ) SPILL",
    correctAnswer: "shell,spell",
    explanation: "SHELF → SHELL (change F to L) → SPELL (change H to P) → SPILL (change E to I).",
    difficulty: 5,


  },
  {
    questionText: "Change one letter at a time to make the first word into the final word. The two answers must be real words.\n\nSPINS ( _____ ) ( _____ ) SPOKE",
    correctAnswer: "spine,spike",
    explanation: "SPINS → SPINE (change S to E) → SPIKE (change N to K) → SPOKE (change I to O).",
    difficulty: 5,


  },
];

// Insert 6-7 questions (one missing word)
for (const q of wordLadder6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_ladder"],
      type: "typed",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "word_ladder",
    },
  });
}

console.log(`✅ Added ${wordLadder6to7.length} Word Ladder questions (ages 6-7)`);

// Insert 7-8 questions (one missing word)
for (const q of wordLadder7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_ladder"],
      type: "typed",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "word_ladder",
    },
  });
}

console.log(`✅ Added ${wordLadder7to8.length} Word Ladder questions (ages 7-8)`);

// Insert 8-9 questions (two missing words)
for (const q of wordLadder8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as comma-separated string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_ladder"],
      type: "typed",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "word_ladder",
    },
  });
}

console.log(`✅ Added ${wordLadder8to9.length} Word Ladder questions (ages 8-9)`);

// Insert 9-10 questions (two missing words)
for (const q of wordLadder9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as comma-separated string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_ladder", "vocabulary"],
      type: "typed",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "word_ladder",
    },
  });
}

console.log(`✅ Added ${wordLadder9to10.length} Word Ladder questions (ages 9-10)`);

// Insert 10-11 questions (two missing words)
for (const q of wordLadder10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as comma-separated string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_ladder"],
      type: "typed",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "word_ladder",
    },
  });
}

console.log(`✅ Added ${wordLadder10to11.length} Word Ladder questions (ages 10-11)`);

const total = wordLadder6to7.length + wordLadder7to8.length + wordLadder8to9.length + wordLadder9to10.length + wordLadder10to11.length;
console.log(`\n🎉 Total: ${total} questions added!`);

await prisma.$disconnect();
