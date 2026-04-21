import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Forming New Words questions...\n");

// First delete all existing forming_new_words questions
console.log("Deleting existing forming_new_words questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "forming_new_words" },
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
  console.log("No existing forming_new_words questions to delete\n");
}

// Forming New Words questions for ages 6-7 (very easy - goes BEFORE)
const formingNewWordsBefore6to7 = [
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nset   shine   flower",
    correctAnswer: "sun",
    explanation: "The word 'sun' goes before each word: sunset, sunshine, sunflower.",
    difficulty: 1,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nbow   coat   drop",
    correctAnswer: "rain",
    explanation: "The word 'rain' goes before each word: rainbow, raincoat, raindrop.",
    difficulty: 1,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nball   bag   made",
    correctAnswer: "hand",
    explanation: "The word 'hand' goes before each word: handball, handbag, handmade.",
    difficulty: 1,


  },
];

// Forming New Words questions for ages 6-7 (very easy - goes AFTER)
const formingNewWordsAfter6to7 = [
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfoot   basket   snow",
    correctAnswer: "ball",
    explanation: "The word 'ball' goes after each word: football, basketball, snowball.",
    difficulty: 1,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nbed   class   bath",
    correctAnswer: "room",
    explanation: "The word 'room' goes after each word: bedroom, classroom, bathroom.",
    difficulty: 1,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\ntext   note   story",
    correctAnswer: "book",
    explanation: "The word 'book' goes after each word: textbook, notebook, storybook.",
    difficulty: 1,


  },
];

// Forming New Words questions for ages 7-8 (easy - goes BEFORE)
const formingNewWordsBefore7to8 = [
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nman   place   fly",
    correctAnswer: "fire",
    explanation: "The word 'fire' goes before each word: fireman, fireplace, firefly.",
    difficulty: 2,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nflake   ball   man",
    correctAnswer: "snow",
    explanation: "The word 'snow' goes before each word: snowflake, snowball, snowman.",
    difficulty: 2,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nlight   beam   set",
    correctAnswer: "moon",
    explanation: "The word 'moon' goes before each word: moonlight, moonbeam, moonset.",
    difficulty: 2,


  },
];

// Forming New Words questions for ages 7-8 (easy - goes AFTER)
const formingNewWordsAfter7to8 = [
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nspace   rocket   friend",
    correctAnswer: "ship",
    explanation: "The word 'ship' goes after each word: spaceship, rocketship, friendship.",
    difficulty: 2,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nsky   high   sea",
    correctAnswer: "line",
    explanation: "The word 'line' goes after each word: skyline, highline, sealine.",
    difficulty: 2,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nrain   sand   hail",
    correctAnswer: "storm",
    explanation: "The word 'storm' goes after each word: rainstorm, sandstorm, hailstorm.",
    difficulty: 2,


  },
];

// Forming New Words questions for ages 8-9 (easier - goes BEFORE)
const formingNewWordsBefore8to9 = [
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nwhere   times   how",
    correctAnswer: "some",
    explanation: "The word 'some' goes before each word: somewhere, sometimes, somehow.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\ncome   low   fore",
    correctAnswer: "be",
    explanation: "The word 'be' goes before each word: become, below, before.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nball   bag   shake",
    correctAnswer: "hand",
    explanation: "The word 'hand' goes before each word: handball, handbag, handshake.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nway   light   chair",
    correctAnswer: "high",
    explanation: "The word 'high' goes before each word: highway, highlight, highchair.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nbow   drop   fall",
    correctAnswer: "rain",
    explanation: "The word 'rain' goes before each word: rainbow, raindrop, rainfall.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nman   work   woman",
    correctAnswer: "fire",
    explanation: "The word 'fire' goes before each word: fireman, firework, firewoman.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nset   rise   flower",
    correctAnswer: "sun",
    explanation: "The word 'sun' goes before each word: sunset, sunrise, sunflower.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nball   print   note",
    correctAnswer: "foot",
    explanation: "The word 'foot' goes before each word: football, footprint, footnote.",
    difficulty: 3,


  },
];

// Forming New Words questions for ages 8-9 (easier - goes AFTER)
const formingNewWordsAfter8to9 = [
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nside   card   dart",
    correctAnswer: "board",
    explanation: "The word 'board' goes after each word: sideboard, cardboard, dartboard.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfoot   base   net",
    correctAnswer: "ball",
    explanation: "The word 'ball' goes after each word: football, baseball, netball.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nhead   flood   sun",
    correctAnswer: "light",
    explanation: "The word 'light' goes after each word: headlight, floodlight, sunlight.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nbed   living   class",
    correctAnswer: "room",
    explanation: "The word 'room' goes after each word: bedroom, living room, classroom.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nspace   battle   war",
    correctAnswer: "ship",
    explanation: "The word 'ship' goes after each word: spaceship, battleship, warship.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfire   horse   man",
    correctAnswer: "power",
    explanation: "The word 'power' goes after each word: firepower, horsepower, manpower.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nrain   snow   hail",
    correctAnswer: "storm",
    explanation: "The word 'storm' goes after each word: rainstorm, snowstorm, hailstorm.",
    difficulty: 3,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nsand   news   wall",
    correctAnswer: "paper",
    explanation: "The word 'paper' goes after each word: sandpaper, newspaper, wallpaper.",
    difficulty: 3,


  },
];

// Forming New Words questions for ages 9-10 (medium - goes BEFORE)
const formingNewWordsBefore9to10 = [
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nground   come   look",
    correctAnswer: "over",
    explanation: "The word 'over' goes before each word: overground, overcome, overlook.",
    difficulty: 4,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nstand   water   wear",
    correctAnswer: "under",
    explanation: "The word 'under' goes before each word: understand, underwater, underwear.",
    difficulty: 4,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nway   road   ways",
    correctAnswer: "mid",
    explanation: "The word 'mid' goes before each word: midway, midroad, midways.",
    difficulty: 4,


  },
];

// Forming New Words questions for ages 9-10 (medium - goes AFTER)
const formingNewWordsAfter9to10 = [
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nhome   wood   ground",
    correctAnswer: "work",
    explanation: "The word 'work' goes after each word: homework, woodwork, groundwork.",
    difficulty: 4,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfire   work   market",
    correctAnswer: "place",
    explanation: "The word 'place' goes after each word: fireplace, workplace, marketplace.",
    difficulty: 4,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nair   sea   steam",
    correctAnswer: "port",
    explanation: "The word 'port' goes after each word: airport, seaport, steamport.",
    difficulty: 4,


  },
];

// Forming New Words questions for ages 10-11 (harder - goes BEFORE)
const formingNewWordsBefore10to11 = [
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nband   line   master",
    correctAnswer: "head",
    explanation: "The word 'head' goes before each word: headband, headline, headmaster.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nright   roar   stairs",
    correctAnswer: "up",
    explanation: "The word 'up' goes before each word: upright, uproar, upstairs.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nstand   ground   coat",
    correctAnswer: "under",
    explanation: "The word 'under' goes before each word: understand, underground, undercoat.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nground   head   cast",
    correctAnswer: "over",
    explanation: "The word 'over' goes before each word: overground, overhead, overcast.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\npack   ground   bone",
    correctAnswer: "back",
    explanation: "The word 'back' goes before each word: backpack, background, backbone.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nside   cast   look",
    correctAnswer: "out",
    explanation: "The word 'out' goes before each word: outside, outcast, outlook.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\nspring   beat   shore",
    correctAnswer: "off",
    explanation: "The word 'off' goes before each word: offspring, offbeat, offshore.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go in front of each of these words to form three new compound words:\n\ncast   fall   turn",
    correctAnswer: "down",
    explanation: "The word 'down' goes before each word: downcast, downfall, downturn.",
    difficulty: 5,


  },
];

// Forming New Words questions for ages 10-11 (harder - goes AFTER)
const formingNewWordsAfter10to11 = [
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nwhen   how   what",
    correctAnswer: "ever",
    explanation: "The word 'ever' goes after each word: whenever, however, whatever.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nlight   green   ware",
    correctAnswer: "house",
    explanation: "The word 'house' goes after each word: lighthouse, greenhouse, warehouse.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\ncross   rain   long",
    correctAnswer: "bow",
    explanation: "The word 'bow' goes after each word: crossbow, rainbow, longbow.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfore   hind   eye",
    correctAnswer: "sight",
    explanation: "The word 'sight' goes after each word: foresight, hindsight, eyesight.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nhope   help   care",
    correctAnswer: "less",
    explanation: "The word 'less' goes after each word: hopeless, helpless, careless.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nhome   farm   school",
    correctAnswer: "work",
    explanation: "The word 'work' goes after each word: homework, farmwork, schoolwork.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nany   some   every",
    correctAnswer: "where",
    explanation: "The word 'where' goes after each word: anywhere, somewhere, everywhere.",
    difficulty: 5,


  },
  {
    questionText: "Find a word that can go after each of these words to form three new compound words:\n\nfire   work   birth",
    correctAnswer: "place",
    explanation: "The word 'place' goes after each word: fireplace, workplace, birthplace.",
    difficulty: 5,


  },
];

// Insert 6-7 questions (BEFORE)
for (const q of formingNewWordsBefore6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsBefore6to7.length} Forming New Words (BEFORE) questions (ages 6-7)`);

// Insert 6-7 questions (AFTER)
for (const q of formingNewWordsAfter6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsAfter6to7.length} Forming New Words (AFTER) questions (ages 6-7)`);

// Insert 7-8 questions (BEFORE)
for (const q of formingNewWordsBefore7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsBefore7to8.length} Forming New Words (BEFORE) questions (ages 7-8)`);

// Insert 7-8 questions (AFTER)
for (const q of formingNewWordsAfter7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsAfter7to8.length} Forming New Words (AFTER) questions (ages 7-8)`);

// Insert 8-9 questions (BEFORE)
for (const q of formingNewWordsBefore8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "compound_words"],
      type: "typed",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsBefore8to9.length} Forming New Words (BEFORE) questions (ages 8-9)`);

// Insert 8-9 questions (AFTER)
for (const q of formingNewWordsAfter8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "compound_words"],
      type: "typed",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsAfter8to9.length} Forming New Words (AFTER) questions (ages 8-9)`);

// Insert 9-10 questions (BEFORE)
for (const q of formingNewWordsBefore9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsBefore9to10.length} Forming New Words (BEFORE) questions (ages 9-10)`);

// Insert 9-10 questions (AFTER)
for (const q of formingNewWordsAfter9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "vocabulary"],
      type: "typed",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsAfter9to10.length} Forming New Words (AFTER) questions (ages 9-10)`);

// Insert 10-11 questions (BEFORE)
for (const q of formingNewWordsBefore10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "compound_words"],
      type: "typed",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsBefore10to11.length} Forming New Words (BEFORE) questions (ages 10-11)`);

// Insert 10-11 questions (AFTER)
for (const q of formingNewWordsAfter10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "forming_new_words", "compound_words"],
      type: "typed",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "forming_new_words",
    },
  });
}

console.log(`✅ Added ${formingNewWordsAfter10to11.length} Forming New Words (AFTER) questions (ages 10-11)`);

const totalQuestions = formingNewWordsBefore6to7.length + formingNewWordsAfter6to7.length +
                       formingNewWordsBefore7to8.length + formingNewWordsAfter7to8.length +
                       formingNewWordsBefore8to9.length + formingNewWordsAfter8to9.length +
                       formingNewWordsBefore9to10.length + formingNewWordsAfter9to10.length +
                       formingNewWordsBefore10to11.length + formingNewWordsAfter10to11.length;

console.log(`\n🎉 Total: ${totalQuestions} Forming New Words questions added!`);

await prisma.$disconnect();
