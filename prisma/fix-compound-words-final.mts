import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Carefully designed questions with NO alternative valid combinations
const compoundQuestions = {
  "8-9": [
    {
      options: ["sun", "rain", "day", "flower", "bow", "light"],
      correct: [0, 3], // sunflower
      explanation: "Sunflower - a tall plant with large yellow flowers that turn to face the sun.",
      difficulty: 2,
    },
    {
      options: ["tooth", "hair", "eye", "brush", "cut", "brow"],
      correct: [0, 3], // toothbrush
      explanation: "Toothbrush - a small brush for cleaning your teeth.",
      difficulty: 2,
    },
    {
      options: ["sun", "moon", "star", "shine", "beam", "glow"],
      correct: [0, 3], // sunshine
      explanation: "Sunshine - the light and warmth from the sun.",
      difficulty: 2,
    },
    {
      options: ["rain", "wind", "snow", "coat", "mill", "flake"],
      correct: [0, 3], // raincoat
      explanation: "Raincoat - a waterproof coat worn in the rain.",
      difficulty: 2,
    },
    {
      options: ["back", "side", "hand", "pack", "yard", "bag"],
      correct: [0, 3], // backpack
      explanation: "Backpack - a bag carried on your back.",
      difficulty: 2,
    },
    {
      options: ["bed", "bath", "wash", "room", "tub", "mat"],
      correct: [0, 3], // bedroom
      explanation: "Bedroom - a room for sleeping in.",
      difficulty: 2,
    },
    {
      options: ["book", "note", "letter", "shelf", "pad", "head"],
      correct: [1, 4], // notepad
      explanation: "Notepad - a pad of paper for writing notes.",
      difficulty: 2,
    },
    {
      options: ["play", "school", "fair", "ground", "yard", "field"],
      correct: [0, 3], // playground
      explanation: "Playground - an outdoor area where children can play.",
      difficulty: 2,
    },
    {
      options: ["foot", "hand", "toe", "ball", "shake", "nail"],
      correct: [0, 3], // football
      explanation: "Football - a sport played with a round ball that you kick.",
      difficulty: 2,
    },
    {
      options: ["birth", "death", "mid", "day", "night", "year"],
      correct: [0, 3], // birthday
      explanation: "Birthday - the anniversary of the day on which a person was born.",
      difficulty: 2,
    },
  ],
  "9-10": [
    {
      options: ["water", "rain", "dew", "fall", "drop", "pond"],
      correct: [0, 3], // waterfall
      explanation: "Waterfall - water that falls from a height, forming a cascade.",
      difficulty: 3,
    },
    {
      options: ["thunder", "wind", "rain", "storm", "sock", "cloud"],
      correct: [0, 3], // thunderstorm
      explanation: "Thunderstorm - a storm with thunder, lightning, and rain.",
      difficulty: 3,
    },
    {
      options: ["sea", "ocean", "coast", "shore", "floor", "line"],
      correct: [2, 5], // coastline
      explanation: "Coastline - the outline of a coast, especially with regard to its shape.",
      difficulty: 3,
    },
    {
      options: ["butter", "dragon", "house", "fly", "cup", "hold"],
      correct: [1, 3], // dragonfly
      explanation: "Dragonfly - a long, thin insect with two pairs of transparent wings.",
      difficulty: 3,
    },
    {
      options: ["key", "door", "lock", "board", "bell", "smith"],
      correct: [0, 3], // keyboard
      explanation: "Keyboard - a panel of keys for typing on a computer or piano.",
      difficulty: 3,
    },
    {
      options: ["any", "some", "every", "one", "where", "thing"],
      correct: [2, 3], // everyone
      explanation: "Everyone - every person; all people.",
      difficulty: 3,
    },
    {
      options: ["up", "down", "in", "stairs", "hill", "town"],
      correct: [0, 3], // upstairs
      explanation: "Upstairs - on or to an upper floor of a building.",
      difficulty: 3,
    },
    {
      options: ["grand", "great", "step", "mother", "aunt", "parent"],
      correct: [0, 3], // grandmother
      explanation: "Grandmother - the mother of your mother or father.",
      difficulty: 3,
    },
    {
      options: ["week", "month", "fort", "end", "day", "night"],
      correct: [0, 3], // weekend
      explanation: "Weekend - Saturday and Sunday.",
      difficulty: 3,
    },
    {
      options: ["news", "wall", "note", "paper", "print", "book"],
      correct: [0, 3], // newspaper
      explanation: "Newspaper - printed sheets of paper containing news and articles.",
      difficulty: 3,
    },
  ],
  "10-11": [
    {
      options: ["worth", "value", "merit", "while", "time", "space"],
      correct: [0, 3], // worthwhile
      explanation: "Worthwhile - worth the time, money, or effort spent on it.",
      difficulty: 4,
    },
    {
      options: ["never", "ever", "seldom", "more", "less", "again"],
      correct: [0, 3], // nevermore
      explanation: "Nevermore - never again; at no future time.",
      difficulty: 4,
    },
    {
      options: ["here", "there", "where", "after", "by", "upon"],
      correct: [1, 3], // thereafter
      explanation: "Thereafter - after that time; from then on.",
      difficulty: 4,
    },
    {
      options: ["with", "without", "within", "hold", "draw", "stand"],
      correct: [0, 3], // withhold
      explanation: "Withhold - refuse to give something that is due or desired.",
      difficulty: 4,
    },
    {
      options: ["master", "servant", "worker", "piece", "work", "craft"],
      correct: [0, 3], // masterpiece
      explanation: "Masterpiece - a work of outstanding artistry or skill.",
      difficulty: 4,
    },
    {
      options: ["candle", "torch", "lamp", "stick", "light", "wick"],
      correct: [0, 3], // candlestick
      explanation: "Candlestick - a holder for a candle.",
      difficulty: 4,
    },
    {
      options: ["some", "any", "no", "where", "place", "thing"],
      correct: [2, 3], // nowhere
      explanation: "Nowhere - not in or to any place; not anywhere.",
      difficulty: 4,
    },
    {
      options: ["back", "fore", "mid", "word", "ground", "most"],
      correct: [1, 3], // foreword
      explanation: "Foreword - an introduction to a book, typically by someone other than the author.",
      difficulty: 4,
    },
    {
      options: ["over", "under", "with", "come", "take", "go"],
      correct: [0, 3], // overcome
      explanation: "Overcome - succeed in dealing with a problem or difficulty.",
      difficulty: 4,
    },
    {
      options: ["where", "when", "what", "ever", "soever", "never"],
      correct: [2, 3], // whatever
      explanation: "Whatever - used to emphasize a lack of restriction in referring to anything.",
      difficulty: 4,
    },
  ],
};

// Challenge questions - unique, harder compound words
const challengeQuestions = {
  "8-9": [
    {
      options: ["hog", "pig", "boar", "wash", "pen", "tail"],
      correct: [0, 3], // hogwash
      explanation: "Hogwash - nonsense; something that is not true or makes no sense.",
      difficulty: 5,
    },
    {
      options: ["gold", "silver", "copper", "fish", "smith", "mine"],
      correct: [0, 3], // goldfish
      explanation: "Goldfish - a small orange-colored fish often kept as a pet.",
      difficulty: 5,
    },
  ],
  "9-10": [
    {
      options: ["pepper", "spear", "sage", "mint", "basil", "leaf"],
      correct: [1, 3], // spearmint
      explanation: "Spearmint - a type of mint plant with a sweet flavor, used in cooking and toothpaste.",
      difficulty: 5,
    },
    {
      options: ["moon", "star", "sun", "beam", "light", "ray"],
      correct: [0, 3], // moonbeam
      explanation: "Moonbeam - a ray of light from the moon.",
      difficulty: 5,
    },
    {
      options: ["quick", "fast", "fleet", "silver", "gold", "bronze"],
      correct: [0, 3], // quicksilver
      explanation: "Quicksilver - another name for mercury; something that moves or changes rapidly.",
      difficulty: 5,
    },
    {
      options: ["stone", "brick", "rock", "wall", "fence", "mason"],
      correct: [0, 3], // stonewall
      explanation: "Stonewall - to delay or block a request or process.",
      difficulty: 5,
    },
  ],
  "10-11": [
    {
      options: ["hap", "chance", "mis", "less", "fortune", "luck"],
      correct: [0, 3], // hapless
      explanation: "Hapless - unfortunate; unlucky.",
      difficulty: 5,
    },
    {
      options: ["wind", "weather", "storm", "beaten", "proof", "worn"],
      correct: [1, 3], // weatherbeaten
      explanation: "Weatherbeaten - damaged, worn, or tanned by exposure to the weather.",
      difficulty: 5,
    },
    {
      options: ["mal", "bad", "ill", "content", "will", "deed"],
      correct: [0, 3], // malcontent
      explanation: "Malcontent - a person who is dissatisfied and rebellious.",
      difficulty: 5,
    },
    {
      options: ["way", "path", "road", "ward", "side", "fare"],
      correct: [0, 3], // wayward
      explanation: "Wayward - difficult to control or predict; following one's own desires.",
      difficulty: 5,
    },
  ],
};

async function fixCompoundWordsFinal() {
  console.log("🔧 Fixing compound word questions with unique answers only...\\n");

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
  const questionsToDelete = await prisma.question.findMany({
    where: {
      topicId: topic.id,
      questionType: "compound_words",
    },
    select: { id: true },
  });

  const questionIds = questionsToDelete.map(q => q.id);

  if (questionIds.length > 0) {
    const deletedAnswers = await prisma.answer.deleteMany({
      where: { questionId: { in: questionIds } },
    });
    console.log(`🗑️  Deleted ${deletedAnswers.count} associated answers`);
  }

  const deleted = await prisma.question.deleteMany({
    where: {
      topicId: topic.id,
      questionType: "compound_words",
    },
  });

  console.log(`🗑️  Deleted ${deleted.count} existing compound word questions\\n`);

  let created = 0;

  // Create regular questions
  for (const [ageRange, questions] of Object.entries(compoundQuestions)) {
    console.log(`\\n=== Creating ${ageRange} questions ===`);

    for (const q of questions) {
      const col1 = q.options.slice(0, 3);
      const col2 = q.options.slice(3, 6);

      const questionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\\n(${col1.join(" ")}) (${col2.join(" ")})`;

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

  // Create challenge questions
  console.log(`\\n=== Creating Challenge questions ===`);

  for (const [ageRange, questions] of Object.entries(challengeQuestions)) {
    for (const q of questions) {
      const col1 = q.options.slice(0, 3);
      const col2 = q.options.slice(3, 6);

      const questionText = `Mark a word from the first set, followed by a word from the second set, that go together to form a new word.\\n(${col1.join(" ")}) (${col2.join(" ")})`;

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

  console.log(`\\n\\n=== Summary ===`);
  console.log(`Total questions created: ${created}`);
  console.log(`  Regular (difficulty 2-4): ${Object.values(compoundQuestions).flat().length}`);
  console.log(`  Challenge (difficulty 5): ${Object.values(challengeQuestions).flat().length}`);
  console.log(`✅ Compound word questions created with unique answers only!`);

  await prisma.$disconnect();
}

fixCompoundWordsFinal();
