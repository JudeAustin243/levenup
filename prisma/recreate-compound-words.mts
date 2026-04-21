import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Each question has: [word1_col1, word2_col1, word3_col1, word1_col2, word2_col2, word3_col2]
// correctAnswers: [index_from_col1, index_from_col2]

const compoundQuestions = {
  "8-9": [
    {
      options: ["sun", "rain", "snow", "flower", "bow", "ball"],
      correct: [0, 3], // sunflower
      explanation: "Sun + flower = sunflower (a type of plant)",
      difficulty: 2,
    },
    {
      options: ["cup", "tea", "pan", "cake", "pot", "cake"],
      correct: [0, 3], // cupcake
      explanation: "Cup + cake = cupcake (a small cake)",
      difficulty: 2,
    },
    {
      options: ["butter", "dragon", "lady", "fly", "bug", "bird"],
      correct: [1, 3], // dragonfly
      explanation: "Dragon + fly = dragonfly (a flying insect)",
      difficulty: 2,
    },
    {
      options: ["foot", "base", "basket", "ball", "court", "board"],
      correct: [0, 3], // football
      explanation: "Foot + ball = football (a sport)",
      difficulty: 2,
    },
    {
      options: ["back", "hand", "school", "pack", "bag", "yard"],
      correct: [0, 3], // backpack
      explanation: "Back + pack = backpack (a bag worn on the back)",
      difficulty: 2,
    },
    {
      options: ["tooth", "hair", "nail", "brush", "comb", "cut"],
      correct: [0, 3], // toothbrush
      explanation: "Tooth + brush = toothbrush (for cleaning teeth)",
      difficulty: 2,
    },
    {
      options: ["bed", "bath", "living", "room", "tub", "couch"],
      correct: [0, 3], // bedroom
      explanation: "Bed + room = bedroom (a room for sleeping)",
      difficulty: 2,
    },
    {
      options: ["sun", "moon", "star", "shine", "light", "beam"],
      correct: [0, 3], // sunshine
      explanation: "Sun + shine = sunshine (sunlight)",
      difficulty: 2,
    },
    {
      options: ["sand", "snow", "ice", "castle", "man", "cream"],
      correct: [0, 3], // sandcastle
      explanation: "Sand + castle = sandcastle (a castle made of sand)",
      difficulty: 2,
    },
    {
      options: ["rain", "sun", "wind", "coat", "hat", "mill"],
      correct: [0, 3], // raincoat
      explanation: "Rain + coat = raincoat (a waterproof coat)",
      difficulty: 2,
    },
  ],
  "9-10": [
    {
      options: ["news", "note", "post", "paper", "book", "card"],
      correct: [0, 3], // newspaper
      explanation: "News + paper = newspaper (printed news publication)",
      difficulty: 3,
    },
    {
      options: ["play", "school", "basket", "ground", "yard", "ball"],
      correct: [0, 3], // playground
      explanation: "Play + ground = playground (area for children to play)",
      difficulty: 3,
    },
    {
      options: ["grass", "cricket", "beetle", "hopper", "jumper", "bug"],
      correct: [0, 3], // grasshopper
      explanation: "Grass + hopper = grasshopper (a jumping insect)",
      difficulty: 3,
    },
    {
      options: ["skate", "snow", "surf", "board", "flake", "wave"],
      correct: [0, 3], // skateboard
      explanation: "Skate + board = skateboard (board with wheels for skating)",
      difficulty: 3,
    },
    {
      options: ["thunder", "rain", "lightning", "storm", "cloud", "bolt"],
      correct: [0, 3], // thunderstorm
      explanation: "Thunder + storm = thunderstorm (a storm with thunder)",
      difficulty: 3,
    },
    {
      options: ["water", "snow", "rain", "fall", "flake", "drop"],
      correct: [0, 3], // waterfall
      explanation: "Water + fall = waterfall (water falling from a height)",
      difficulty: 3,
    },
    {
      options: ["finger", "foot", "toe", "print", "step", "nail"],
      correct: [0, 3], // fingerprint
      explanation: "Finger + print = fingerprint (unique mark from a finger)",
      difficulty: 3,
    },
    {
      options: ["ear", "nose", "finger", "ring", "stud", "band"],
      correct: [0, 3], // earring
      explanation: "Ear + ring = earring (jewelry worn on the ear)",
      difficulty: 3,
    },
    {
      options: ["snow", "rain", "ice", "flake", "drop", "cube"],
      correct: [0, 3], // snowflake
      explanation: "Snow + flake = snowflake (a crystal of snow)",
      difficulty: 3,
    },
    {
      options: ["light", "watch", "fire", "house", "tower", "place"],
      correct: [0, 3], // lighthouse
      explanation: "Light + house = lighthouse (tower with light for ships)",
      difficulty: 3,
    },
  ],
  "10-11": [
    {
      options: ["under", "over", "never", "stand", "take", "theless"],
      correct: [2, 5], // nevertheless
      explanation: "Never + theless = nevertheless (in spite of that)",
      difficulty: 4,
    },
    {
      options: ["mean", "some", "any", "while", "time", "where"],
      correct: [0, 3], // meanwhile
      explanation: "Mean + while = meanwhile (at the same time)",
      difficulty: 4,
    },
    {
      options: ["where", "there", "here", "abouts", "fore", "after"],
      correct: [0, 3], // whereabouts
      explanation: "Where + abouts = whereabouts (the place where someone is)",
      difficulty: 4,
    },
    {
      options: ["candle", "lamp", "torch", "stick", "shade", "light"],
      correct: [0, 3], // candlestick
      explanation: "Candle + stick = candlestick (a holder for a candle)",
      difficulty: 4,
    },
    {
      options: ["hand", "head", "arm", "writing", "ache", "band"],
      correct: [1, 4], // headache
      explanation: "Head + ache = headache (pain in the head)",
      difficulty: 4,
    },
    {
      options: ["under", "over", "super", "ground", "head", "market"],
      correct: [0, 3], // underground
      explanation: "Under + ground = underground (beneath the surface)",
      difficulty: 4,
    },
    {
      options: ["finger", "thumb", "hand", "nail", "tack", "cuff"],
      correct: [2, 5], // handcuff
      explanation: "Hand + cuff = handcuff (restraint for wrists)",
      difficulty: 4,
    },
    {
      options: ["book", "note", "type", "case", "pad", "writer"],
      correct: [1, 4], // notepad
      explanation: "Note + pad = notepad (pad of paper for notes)",
      difficulty: 4,
    },
    {
      options: ["over", "under", "super", "coat", "wear", "visor"],
      correct: [0, 3], // overcoat
      explanation: "Over + coat = overcoat (a long warm coat)",
      difficulty: 4,
    },
    {
      options: ["some", "any", "every", "where", "place", "time"],
      correct: [2, 4], // everyplace
      explanation: "Every + place = everyplace (in all places; everywhere)",
      difficulty: 4,
    },
  ],
};

async function recreateCompoundWords() {
  console.log("🔧 Recreating compound word questions...\n");

  // Find the Verbal Reasoning subject and topic
  const subject = await prisma.subject.findFirst({
    where: { slug: "verbal-reasoning" },
  });

  if (!subject) {
    console.log("❌ Verbal Reasoning subject not found");
    await prisma.$disconnect();
    return;
  }

  const topic = await prisma.topic.findFirst({
    where: {
      subjectId: subject.id,
      name: "Word Patterns",
    },
  });

  if (!topic) {
    console.log("❌ Word Patterns topic not found");
    await prisma.$disconnect();
    return;
  }

  // Delete existing compound word questions
  const deleted = await prisma.question.deleteMany({
    where: {
      topicId: topic.id,
      questionType: "compound_words",
    },
  });

  console.log(`🗑️  Deleted ${deleted.count} existing compound word questions\n`);

  // Create new questions
  let created = 0;

  for (const [ageRange, questions] of Object.entries(compoundQuestions)) {
    console.log(`\n=== Creating ${ageRange} questions ===`);

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const col1 = q.options.slice(0, 3);
      const col2 = q.options.slice(3, 6);

      const questionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\n(${col1.join(" ")}) (${col2.join(" ")})`;

      await prisma.question.create({
        data: {
          topicId: topic.id,
          questionType: "compound_words",
          questionText,
          options: q.options,
          correctAnswer: q.correct[0], // Legacy field
          correctAnswers: q.correct,
          explanation: q.explanation,
          difficulty: q.difficulty,
          ageRange,
          examBoard: "GL",
        },
      });

      const correctWord = q.options[q.correct[0]] + q.options[q.correct[1]];
      console.log(`✓ Created: ${col1.join(", ")} + ${col2.join(", ")} → ${correctWord}`);
      created++;
    }
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`Total questions created: ${created}`);
  console.log(`✅ Compound word questions recreated with 2-column format!`);

  await prisma.$disconnect();
}

recreateCompoundWords();
