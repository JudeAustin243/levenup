import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Format: [word1_col1, word2_col1, word3_col1, word1_col2, word2_col2, word3_col2]
const compoundQuestions = {
  "8-9": [
    {
      options: ["butter", "dragon", "lady", "fly", "bug", "bird"],
      correct: [0, 3],
      explanation: "Butterfly - an insect with large, often colorful wings that flies during the day.",
      difficulty: 2,
    },
    {
      options: ["straw", "blue", "rasp", "berry", "fruit", "jam"],
      correct: [0, 3],
      explanation: "Strawberry - a sweet red fruit with small seeds on the outside.",
      difficulty: 2,
    },
    {
      options: ["bed", "bath", "living", "room", "tub", "space"],
      correct: [0, 3],
      explanation: "Bedroom - a room for sleeping in.",
      difficulty: 2,
    },
    {
      options: ["water", "honey", "candle", "melon", "dew", "wax"],
      correct: [0, 3],
      explanation: "Watermelon - a large fruit with green skin, red flesh, and black seeds.",
      difficulty: 2,
    },
    {
      options: ["pan", "cup", "cheese", "cake", "size", "board"],
      correct: [0, 3],
      explanation: "Pancake - a flat, round cake made from batter and fried in a pan.",
      difficulty: 2,
    },
    {
      options: ["tooth", "ear", "head", "ache", "ring", "band"],
      correct: [0, 3],
      explanation: "Toothache - pain in a tooth or teeth.",
      difficulty: 2,
    },
    {
      options: ["sand", "snow", "ice", "castle", "man", "berg"],
      correct: [0, 3],
      explanation: "Sandcastle - a model of a castle built out of sand, typically on a beach.",
      difficulty: 2,
    },
    {
      options: ["pop", "sweet", "candy", "corn", "wheat", "floss"],
      correct: [0, 3],
      explanation: "Popcorn - kernels of corn that have been heated until they burst open and become fluffy.",
      difficulty: 2,
    },
    {
      options: ["fire", "dragon", "glow", "fly", "worm", "bug"],
      correct: [0, 3],
      explanation: "Firefly - a flying insect that glows in the dark.",
      difficulty: 2,
    },
    {
      options: ["foot", "finger", "hand", "print", "nail", "shake"],
      correct: [0, 3],
      explanation: "Footprint - the mark left by a foot or shoe on the ground or floor.",
      difficulty: 2,
    },
  ],
  "9-10": [
    {
      options: ["green", "light", "dog", "house", "bulb", "kennel"],
      correct: [0, 3],
      explanation: "Greenhouse - a glass building in which plants are grown.",
      difficulty: 3,
    },
    {
      options: ["air", "sea", "train", "port", "dock", "station"],
      correct: [0, 3],
      explanation: "Airport - a place where aircraft take off and land, with buildings for passengers.",
      difficulty: 3,
    },
    {
      options: ["sea", "black", "blue", "gull", "bird", "jay"],
      correct: [0, 3],
      explanation: "Seagull - a common gray or white bird that lives near the sea.",
      difficulty: 3,
    },
    {
      options: ["basket", "foot", "hand", "ball", "kick", "shake"],
      correct: [0, 3],
      explanation: "Basketball - a game in which two teams try to score points by throwing a ball through a high net.",
      difficulty: 3,
    },
    {
      options: ["thunder", "rain", "snow", "storm", "drop", "flake"],
      correct: [0, 3],
      explanation: "Thunderstorm - a storm with thunder, lightning, and heavy rain.",
      difficulty: 3,
    },
    {
      options: ["grand", "god", "step", "father", "mother", "parent"],
      correct: [0, 3],
      explanation: "Grandfather - the father of one's mother or father.",
      difficulty: 3,
    },
    {
      options: ["pass", "tick", "badge", "port", "et", "card"],
      correct: [0, 3],
      explanation: "Passport - an official document that allows you to travel to foreign countries.",
      difficulty: 3,
    },
    {
      options: ["neck", "arm", "wrist", "lace", "band", "let"],
      correct: [0, 3],
      explanation: "Necklace - a piece of jewelry worn around the neck.",
      difficulty: 3,
    },
    {
      options: ["out", "in", "up", "doors", "side", "stairs"],
      correct: [0, 3],
      explanation: "Outdoors - outside a building; in the open air.",
      difficulty: 3,
    },
    {
      options: ["down", "up", "rain", "pour", "lift", "fall"],
      correct: [0, 3],
      explanation: "Downpour - a heavy fall of rain.",
      difficulty: 3,
    },
  ],
  "10-11": [
    {
      options: ["shore", "sea", "land", "ward", "side", "scape"],
      correct: [0, 3],
      explanation: "Shoreward - toward the shore; in the direction of the land from the sea.",
      difficulty: 4,
    },
    {
      options: ["goose", "straw", "rasp", "berry", "fruit", "jam"],
      correct: [0, 3],
      explanation: "Gooseberry - a round edible yellowish-green berry with a thin translucent hairy skin.",
      difficulty: 4,
    },
    {
      options: ["back", "fore", "hind", "bite", "stab", "sight"],
      correct: [0, 3],
      explanation: "Backbite - to say unpleasant and unkind things about someone who is not present; to slander.",
      difficulty: 4,
    },
    {
      options: ["by", "fore", "after", "gone", "word", "noon"],
      correct: [0, 3],
      explanation: "Bygone - belonging to an earlier time; past and no longer in existence.",
      difficulty: 4,
    },
    {
      options: ["fare", "god", "good", "well", "speed", "bye"],
      correct: [0, 3],
      explanation: "Farewell - used to express good wishes when parting or at the end of something.",
      difficulty: 4,
    },
    {
      options: ["up", "down", "mid", "stream", "river", "flow"],
      correct: [0, 3],
      explanation: "Upstream - moving or situated in the opposite direction from that in which a stream flows.",
      difficulty: 4,
    },
    {
      options: ["pepper", "spear", "winter", "mint", "green", "fresh"],
      correct: [0, 3],
      explanation: "Peppermint - a plant of the mint family with aromatic leaves that yield a pungent oil.",
      difficulty: 4,
    },
    {
      options: ["bare", "naked", "empty", "foot", "hand", "bone"],
      correct: [0, 3],
      explanation: "Barefoot - wearing nothing on the feet; without shoes or socks.",
      difficulty: 4,
    },
    {
      options: ["day", "night", "pipe", "dream", "mare", "vision"],
      correct: [0, 3],
      explanation: "Daydream - a series of pleasant thoughts about something you would prefer to be doing or something you would like to achieve.",
      difficulty: 4,
    },
    {
      options: ["pad", "dead", "grid", "lock", "bolt", "key"],
      correct: [0, 3],
      explanation: "Padlock - a detachable lock hanging by a pivoted hook on the object fastened.",
      difficulty: 4,
    },
  ],
};

// Challenge questions from the third, fourth, and fifth images
const challengeQuestions = {
  "8-9": [
    {
      options: ["hog", "pig", "farm", "wash", "sty", "pen"],
      correct: [0, 3],
      explanation: "Hogwash - nonsense; rubbish; something completely untrue or silly.",
      difficulty: 5,
    },
    {
      options: ["scape", "escape", "cape", "goat", "route", "wear"],
      correct: [0, 3],
      explanation: "Scapegoat - a person who is unfairly blamed for the mistakes or wrongdoings of others.",
      difficulty: 5,
    },
  ],
  "9-10": [
    {
      options: ["carpet", "bag", "rug", "bagger", "man", "weaver"],
      correct: [0, 3],
      explanation: "Carpetbagger - an outsider who moves into an area mainly to profit, especially in politics.",
      difficulty: 5,
    },
    {
      options: ["back", "false", "fair", "friend", "weather", "enemy"],
      correct: [0, 3],
      explanation: "Backfriend - a false friend; someone who is friendly to your face but not loyal behind your back.",
      difficulty: 5,
    },
    {
      options: ["belly", "feast", "hunger", "cheer", "joy", "pang"],
      correct: [0, 3],
      explanation: "Bellycheer - (archaic) feasting; hearty enjoyment of food and drink.",
      difficulty: 5,
    },
    {
      options: ["lick", "boot", "tongue", "spittle", "licker", "wag"],
      correct: [0, 3],
      explanation: "Lickspittle - a servile flatterer; an obsequious follower who seeks favor through flattery.",
      difficulty: 5,
    },
  ],
  "10-11": [
    {
      options: ["rag", "trash", "mess", "tag", "heap", "pile"],
      correct: [0, 3],
      explanation: "Ragtag - untidy, disorganized, or made up of mixed and often inferior elements.",
      difficulty: 5,
    },
    {
      options: ["under", "over", "out", "belly", "head", "side"],
      correct: [0, 3],
      explanation: "Underbelly - the hidden, vulnerable, or morally questionable side of something (figuratively); or the underside of an animal (literally).",
      difficulty: 5,
    },
    {
      options: ["under", "over", "other", "world", "whelm", "realm"],
      correct: [0, 3],
      explanation: "Underworld - the world of organized crime and illegal activity; or in mythology, the world of the dead.",
      difficulty: 5,
    },
    {
      options: ["belly", "tooth", "head", "ache", "pain", "throb"],
      correct: [0, 3],
      explanation: "Bellyache - a stomach ache (noun); or to complain persistently (verb).",
      difficulty: 5,
    },
  ],
};

async function createCompoundFromImages() {
  console.log("🔧 Creating compound word questions from images...\n");

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

  // Delete existing compound word questions and their answers
  // First, get all question IDs to delete
  const questionsToDelete = await prisma.question.findMany({
    where: {
      topicId: topic.id,
      questionType: "compound_words",
    },
    select: { id: true },
  });

  const questionIds = questionsToDelete.map(q => q.id);

  // Delete associated answers first
  if (questionIds.length > 0) {
    const deletedAnswers = await prisma.answer.deleteMany({
      where: { questionId: { in: questionIds } },
    });
    console.log(`🗑️  Deleted ${deletedAnswers.count} associated answers`);
  }

  // Now delete the questions
  const deleted = await prisma.question.deleteMany({
    where: {
      topicId: topic.id,
      questionType: "compound_words",
    },
  });

  console.log(`🗑️  Deleted ${deleted.count} existing compound word questions\n`);

  let created = 0;

  // Create regular questions (ages 8-9, 9-10, 10-11)
  for (const [ageRange, questions] of Object.entries(compoundQuestions)) {
    console.log(`\n=== Creating ${ageRange} questions ===`);

    for (const q of questions) {
      const col1 = q.options.slice(0, 3);
      const col2 = q.options.slice(3, 6);

      const questionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\n(${col1.join(" ")}) (${col2.join(" ")})`;

      await prisma.question.create({
        data: {
          topicId: topic.id,
          questionType: "compound_words",
          questionText,
          options: q.options,
          correctAnswer: q.correct[0],
          correctAnswers: q.correct,
          explanation: q.explanation,
          difficulty: q.difficulty,
          ageRange,
          examBoard: "GL",
        },
      });

      const correctWord = q.options[q.correct[0]] + q.options[q.correct[1]];
      console.log(`✓ Created: ${correctWord} - ${q.explanation.split(" - ")[1]?.substring(0, 50) || ""}...`);
      created++;
    }
  }

  // Create challenge questions (difficulty 5)
  console.log(`\n=== Creating Challenge questions ===`);

  for (const [ageRange, questions] of Object.entries(challengeQuestions)) {
    for (const q of questions) {
      const col1 = q.options.slice(0, 3);
      const col2 = q.options.slice(3, 6);

      const questionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\n(${col1.join(" ")}) (${col2.join(" ")})`;

      await prisma.question.create({
        data: {
          topicId: topic.id,
          questionType: "compound_words",
          questionText,
          options: q.options,
          correctAnswer: q.correct[0],
          correctAnswers: q.correct,
          explanation: q.explanation,
          difficulty: q.difficulty,
          ageRange,
          examBoard: "GL",
        },
      });

      const correctWord = q.options[q.correct[0]] + q.options[q.correct[1]];
      console.log(`✓ Created: ${correctWord} (Challenge) - ${q.explanation.split(" - ")[1]?.substring(0, 50) || ""}...`);
      created++;
    }
  }

  console.log(`\n\n=== Summary ===`);
  console.log(`Total questions created: ${created}`);
  console.log(`  Regular (difficulty 2-4): ${Object.values(compoundQuestions).flat().length}`);
  console.log(`  Challenge (difficulty 5): ${Object.values(challengeQuestions).flat().length}`);
  console.log(`✅ Compound word questions created with definitions!`);

  await prisma.$disconnect();
}

createCompoundFromImages();
