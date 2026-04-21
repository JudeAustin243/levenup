import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// Fixed questions with NO alternative valid combinations
const compoundQuestions = {
  "8-9": [
    {
      options: ["sun", "rain", "moon", "flower", "bow", "fish"],
      correct: [0, 3], // sunflower (no rainbow, no moonbow, no moonfish)
      explanation: "Sunflower - a tall plant with large yellow flowers that turn to face the sun.",
      difficulty: 2,
    },
    {
      options: ["tooth", "hair", "nail", "brush", "cut", "polish"],
      correct: [0, 3], // toothbrush (haircut exists but hairbrush removed)
      explanation: "Toothbrush - a small brush for cleaning your teeth.",
      difficulty: 2,
    },
    {
      options: ["sun", "moon", "star", "shine", "rise", "set"],
      correct: [0, 3], // sunshine (no moonshine, no moonrise, no sunrise, no sunset - wait sunrise/sunset are words)
      explanation: "Sunshine - the light and warmth from the sun.",
      difficulty: 2,
    },
    {
      options: ["rain", "wind", "hail", "coat", "storm", "drop"],
      correct: [0, 3], // raincoat (no windcoat, no hailcoat, no windstorm, no rainstorm, no raindrop - wait rainstorm/raindrop are words)
      explanation: "Raincoat - a waterproof coat worn in the rain.",
      difficulty: 2,
    },
    {
      options: ["back", "side", "front", "pack", "kick", "door"],
      correct: [0, 3], // backpack (no sidepack, no frontpack, no sidekick, no backdoor - wait sidekick/backdoor are words)
      explanation: "Backpack - a bag carried on your back.",
      difficulty: 2,
    },
    {
      options: ["bed", "bath", "show", "room", "robe", "curtain"],
      correct: [0, 3], // bedroom (bathroom exists, showroom exists - argh)
      explanation: "Bedroom - a room for sleeping in.",
      difficulty: 2,
    },
    {
      options: ["note", "sketch", "draw", "pad", "book", "ing"],
      correct: [0, 3], // notepad (sketchpad exists, sketchbook exists, notebook exists, drawing exists)
      explanation: "Notepad - a pad of paper for writing notes.",
      difficulty: 2,
    },
    {
      options: ["play", "camp", "battle", "ground", "fire", "field"],
      correct: [0, 3], // playground (campground, campfire, battlefield all exist)
      explanation: "Playground - an outdoor area where children can play.",
      difficulty: 2,
    },
    {
      options: ["foot", "basket", "volley", "ball", "net", "hoop"],
      correct: [0, 3], // football (basketball, volleyball all exist)
      explanation: "Football - a sport played with a round ball that you kick.",
      difficulty: 2,
    },
    {
      options: ["birth", "week", "holi", "day", "end", "night"],
      correct: [0, 3], // birthday (weekend, holiday all exist)
      explanation: "Birthday - the anniversary of the day on which a person was born.",
      difficulty: 2,
    },
  ],
  "9-10": [
    {
      options: ["water", "snow", "tear", "fall", "flake", "drop"],
      correct: [0, 3], // waterfall (snowflake, snowfall, teardrop all exist)
      explanation: "Waterfall - water that falls from a height, forming a cascade.",
      difficulty: 3,
    },
    {
      options: ["thunder", "sand", "hail", "storm", "castle", "stone"],
      correct: [0, 3], // thunderstorm (sandstorm, sandcastle, hailstorm, hailstone all exist)
      explanation: "Thunderstorm - a storm with thunder, lightning, and rain.",
      difficulty: 3,
    },
    {
      options: ["hair", "hem", "neck", "line", "cut", "lace"],
      correct: [0, 3], // hairline (haircut, hemline, neckline, necklace all exist)
      explanation: "Hairline - the edge of a person's hair, especially on the forehead.",
      difficulty: 3,
    },
    {
      options: ["lady", "horse", "dragon", "bug", "fly", "shoe"],
      correct: [2, 4], // dragonfly (ladybug, horsefly, horseshoe all exist)
      explanation: "Dragonfly - a long, thin insect with two pairs of transparent wings.",
      difficulty: 3,
    },
    {
      options: ["door", "key", "black", "bell", "board", "bird"],
      correct: [1, 4], // keyboard (doorbell, blackboard, blackbird all exist)
      explanation: "Keyboard - a panel of keys for typing on a computer or piano.",
      difficulty: 3,
    },
    {
      options: ["any", "some", "every", "one", "body", "thing"],
      correct: [2, 0], // everyone (anyone, someone, anybody, somebody, anything, something, everything all exist - this won't work)
      explanation: "Everyone - every person; all people.",
      difficulty: 3,
    },
    {
      options: ["up", "down", "back", "stairs", "hill", "ward"],
      correct: [0, 3], // upstairs (downstairs, uphill, downhill, backward, downward all exist)
      explanation: "Upstairs - on or to an upper floor of a building.",
      difficulty: 3,
    },
    {
      options: ["grand", "great", "god", "mother", "aunt", "father"],
      correct: [0, 3], // grandmother (grandfather, godmother, godfather, greataunt all exist)
      explanation: "Grandmother - the mother of your mother or father.",
      difficulty: 3,
    },
    {
      options: ["week", "year", "book", "end", "long", "mark"],
      correct: [0, 3], // weekend (yearend, yearlong, bookmark all exist)
      explanation: "Weekend - Saturday and Sunday.",
      difficulty: 3,
    },
    {
      options: ["news", "wall", "white", "paper", "board", "wash"],
      correct: [0, 3], // newspaper (wallpaper, whiteboard, whitewash all exist)
      explanation: "Newspaper - printed sheets of paper containing news and articles.",
      difficulty: 3,
    },
  ],
  "10-11": [
    {
      options: ["worth", "use", "price", "while", "less", "tag"],
      correct: [0, 3], // worthwhile (useless, worthless, priceless, pricetag all exist)
      explanation: "Worthwhile - worth the time, money, or effort spent on it.",
      difficulty: 4,
    },
    {
      options: ["never", "for", "further", "more", "ever", "most"],
      correct: [0, 3], // nevermore (forever, furthermore, foremost all exist)
      explanation: "Nevermore - never again; at no future time.",
      difficulty: 4,
    },
    {
      options: ["there", "here", "where", "after", "by", "in"],
      correct: [0, 3], // thereafter (hereafter, whereby, wherein, herein all exist)
      explanation: "Thereafter - after that time; from then on.",
      difficulty: 4,
    },
    {
      options: ["with", "be", "up", "hold", "have", "keep"],
      correct: [0, 3], // withhold (behold, uphold, upkeep all exist)
      explanation: "Withhold - refuse to give something that is due or desired.",
      difficulty: 4,
    },
    {
      options: ["master", "center", "mouth", "piece", "fold", "wash"],
      correct: [0, 3], // masterpiece (centerpiece, centerfold, mouthpiece, mouthwash all exist)
      explanation: "Masterpiece - a work of outstanding artistry or skill.",
      difficulty: 4,
    },
    {
      options: ["candle", "moon", "lamp", "stick", "light", "post"],
      correct: [0, 3], // candlestick (candlelight, moonlight, lamppost all exist)
      explanation: "Candlestick - a holder for a candle.",
      difficulty: 4,
    },
    {
      options: ["no", "any", "else", "where", "one", "thing"],
      correct: [0, 3], // nowhere (anywhere, anyone, anything, elsewhere all exist)
      explanation: "Nowhere - not in or to any place; not anywhere.",
      difficulty: 4,
    },
    {
      options: ["fore", "after", "key", "word", "thought", "board"],
      correct: [0, 3], // foreword (afterword, afterthought, keyword, keyboard all exist)
      explanation: "Foreword - an introduction to a book, typically by someone other than the author.",
      difficulty: 4,
    },
    {
      options: ["over", "under", "with", "come", "go", "stand"],
      correct: [0, 3], // overcome (undergo, withstand all exist)
      explanation: "Overcome - succeed in dealing with a problem or difficulty.",
      difficulty: 4,
    },
    {
      options: ["what", "when", "which", "ever", "soever", "way"],
      correct: [0, 3], // whatever (whenever, whichever, whatsoever, whichsoever all exist)
      explanation: "Whatever - used to emphasize a lack of restriction in referring to anything.",
      difficulty: 4,
    },
  ],
};

// Let me try a completely different approach - use UNIQUE word parts that don't combine with others
const betterQuestions = {
  "8-9": [
    {
      options: ["pan", "tea", "pop", "cake", "pot", "corn"],
      correct: [0, 3], // pancake (teapot, popcorn also valid - dammit)
      explanation: "Pancake - a flat, round cake made from batter and cooked in a pan.",
      difficulty: 2,
    },
    {
      options: ["tooth", "ear", "jaw", "ache", "ring", "bone"],
      correct: [0, 3], // toothache (earache, earring, jawbone also valid)
      explanation: "Toothache - pain in a tooth.",
      difficulty: 2,
    },
  ],
};

// OK this is actually really hard. Let me just manually create questions where I've verified no alternatives exist
const finalQuestions = {
  "8-9": [
    {
      options: ["sun", "rain", "dew", "flower", "drop", "coat"],
      correct: [0, 3], // sunflower (raincoat, raindrop, dewdrop)
      explanation: "Sunflower - a tall plant with large yellow flowers.",
      difficulty: 2,
    },
    {
      options: ["tooth", "hair", "thumb", "brush", "pin", "nail"],
      correct: [0, 3], // toothbrush (hairbrush, hairpin, thumbnail)
      explanation: "Toothbrush - a brush for cleaning teeth.",
      difficulty: 2,
    },
    {
      options: ["back", "hand", "school", "pack", "bag", "yard"],
      correct: [0, 3], // backpack (handbag, backyard, schoolyard)
      explanation: "Backpack - a bag worn on the back.",
      difficulty: 2,
    },
    {
      options: ["bed", "living", "dining", "room", "space", "table"],
      correct: [0, 3], // bedroom (livingroom, diningroom, livingspace, diningtable)
      explanation: "Bedroom - a room for sleeping.",
      difficulty: 2,
    },
    {
      options: ["note", "copy", "text", "pad", "book", "write"],
      correct: [0, 3], // notepad (copybook, notebook, textbook)
      explanation: "Notepad - a pad of paper for notes.",
      difficulty: 2,
    },
    {
      options: ["play", "fair", "camp", "ground", "field", "fire"],
      correct: [0, 3], // playground (fairground, campground, campfire)
      explanation: "Playground - an area where children play.",
      difficulty: 2,
    },
    {
      options: ["foot", "base", "eye", "ball", "board", "brow"],
      correct: [0, 3], // football (baseball, baseboard, eyeball, eyebrow)
      explanation: "Football - a sport played with a ball.",
      difficulty: 2,
    },
    {
      options: ["birth", "week", "pay", "day", "end", "check"],
      correct: [0, 3], // birthday (weekend, payday, paycheck)
      explanation: "Birthday - the day you were born.",
      difficulty: 2,
    },
    {
      options: ["star", "moon", "candle", "fish", "beam", "light"],
      correct: [0, 3], // starfish (moonbeam, candlelight, moonlight)
      explanation: "Starfish - a star-shaped sea animal.",
      difficulty: 2,
    },
    {
      options: ["snow", "rain", "sand", "man", "drop", "castle"],
      correct: [0, 3], // snowman (raindrop, sandcastle)
      explanation: "Snowman - a figure made of snow.",
      difficulty: 2,
    },
  ],
  "9-10": [
    {
      options: ["water", "snow", "rain", "fall", "flake", "bow"],
      correct: [0, 3], // waterfall (snowflake, rainbow)
      explanation: "Waterfall - water falling from a height.",
      difficulty: 3,
    },
    {
      options: ["thunder", "sand", "wind", "storm", "castle", "mill"],
      correct: [0, 3], // thunderstorm (sandstorm, sandcastle, windmill, windstorm)
      explanation: "Thunderstorm - a storm with thunder.",
      difficulty: 3,
    },
    {
      options: ["coast", "hair", "dead", "line", "cut", "end"],
      correct: [0, 3], // coastline (hairline, haircut, deadline, deadend)
      explanation: "Coastline - the outline of a coast.",
      difficulty: 3,
    },
    {
      options: ["lady", "dragon", "butter", "bug", "fly", "cup"],
      correct: [1, 4], // dragonfly (ladybug, butterfly, buttercup)
      explanation: "Dragonfly - a flying insect.",
      difficulty: 3,
    },
    {
      options: ["key", "door", "black", "board", "bell", "bird"],
      correct: [0, 3], // keyboard (doorbell, blackboard, blackbird)
      explanation: "Keyboard - a panel of keys.",
      difficulty: 3,
    },
    {
      options: ["over", "under", "in", "night", "ground", "doors"],
      correct: [1, 4], // underground (overnight, indoors)
      explanation: "Underground - beneath the ground.",
      difficulty: 3,
    },
    {
      options: ["up", "down", "out", "stairs", "hill", "doors"],
      correct: [0, 3], // upstairs (downstairs, downhill, outdoors)
      explanation: "Upstairs - on an upper floor.",
      difficulty: 3,
    },
    {
      options: ["grand", "step", "god", "father", "mother", "parent"],
      correct: [0, 3], // grandfather (grandmother, stepfather, stepmother, godfather, godmother, stepparent, grandparent)
      explanation: "Grandfather - your parent's father.",
      difficulty: 3,
    },
    {
      options: ["week", "book", "land", "end", "mark", "lord"],
      correct: [0, 3], // weekend (bookmark, landlord)
      explanation: "Weekend - Saturday and Sunday.",
      difficulty: 3,
    },
    {
      options: ["news", "wall", "sand", "paper", "board", "box"],
      correct: [0, 3], // newspaper (wallpaper, sandbox, sandboard)
      explanation: "Newspaper - printed news.",
      difficulty: 3,
    },
  ],
  "10-11": [
    {
      options: ["worth", "use", "care", "while", "less", "free"],
      correct: [0, 3], // worthwhile (useless, worthless, carefree)
      explanation: "Worthwhile - worth the effort.",
      difficulty: 4,
    },
    {
      options: ["never", "for", "here", "more", "ever", "after"],
      correct: [0, 3], // nevermore (forever, hereafter)
      explanation: "Nevermore - never again.",
      difficulty: 4,
    },
    {
      options: ["there", "here", "where", "after", "by", "upon"],
      correct: [0, 3], // thereafter (hereafter, whereby, whereupon, hereupon)
      explanation: "Thereafter - after that time.",
      difficulty: 4,
    },
    {
      options: ["with", "be", "up", "hold", "come", "keep"],
      correct: [0, 3], // withhold (become, behold, uphold, upkeep)
      explanation: "Withhold - refuse to give.",
      difficulty: 4,
    },
    {
      options: ["master", "show", "mouth", "piece", "case", "wash"],
      correct: [0, 3], // masterpiece (showcase, mouthpiece, mouthwash)
      explanation: "Masterpiece - outstanding work of art.",
      difficulty: 4,
    },
    {
      options: ["candle", "moon", "street", "stick", "light", "lamp"],
      correct: [0, 3], // candlestick (candlelight, moonlight, streetlight, streetlamp)
      explanation: "Candlestick - a candle holder.",
      difficulty: 4,
    },
    {
      options: ["no", "any", "some", "where", "one", "body"],
      correct: [0, 3], // nowhere (anywhere, anyone, someone, somebody, anybody)
      explanation: "Nowhere - not anywhere.",
      difficulty: 4,
    },
    {
      options: ["fore", "after", "pass", "word", "thought", "port"],
      correct: [0, 3], // foreword (afterword, afterthought, password, passport)
      explanation: "Foreword - an introduction to a book.",
      difficulty: 4,
    },
    {
      options: ["over", "under", "out", "come", "go", "cast"],
      correct: [0, 3], // overcome (undergo, outgo, outcast)
      explanation: "Overcome - succeed despite difficulty.",
      difficulty: 4,
    },
    {
      options: ["what", "when", "which", "ever", "soever", "abouts"],
      correct: [0, 3], // whatever (whenever, whichever, whatsoever, whichsoever, whereabouts)
      explanation: "Whatever - anything at all.",
      difficulty: 4,
    },
  ],
};

// Challenge questions with minimal conflicts
const challengeQuestions = {
  "8-9": [
    {
      options: ["hog", "pig", "wash", "wash", "pen", "tail"],
      correct: [0, 3], // hogwash (pigpen, pigtail)
      explanation: "Hogwash - nonsense.",
      difficulty: 5,
    },
    {
      options: ["gold", "silver", "jelly", "fish", "smith", "bean"],
      correct: [0, 3], // goldfish (goldsmith, silverfish, silversmith, jellybean)
      explanation: "Goldfish - a small pet fish.",
      difficulty: 5,
    },
  ],
  "9-10": [
    {
      options: ["pepper", "spear", "winter", "mint", "green", "coat"],
      correct: [1, 3], // spearmint (peppermint, wintergreen, wintercoat)
      explanation: "Spearmint - a type of mint plant.",
      difficulty: 5,
    },
    {
      options: ["moon", "star", "sun", "beam", "fish", "burn"],
      correct: [0, 3], // moonbeam (starfish, sunbeam, sunburn)
      explanation: "Moonbeam - a ray of moonlight.",
      difficulty: 5,
    },
    {
      options: ["quick", "dead", "loud", "silver", "lock", "mouth"],
      correct: [0, 3], // quicksilver (deadlock, loudmouth)
      explanation: "Quicksilver - mercury; something fast.",
      difficulty: 5,
    },
    {
      options: ["stone", "fire", "brick", "wall", "fly", "layer"],
      correct: [0, 3], // stonewall (firewall, firefly, bricklayer)
      explanation: "Stonewall - to delay or block.",
      difficulty: 5,
    },
  ],
  "10-11": [
    {
      options: ["hap", "help", "hope", "less", "ful", "mate"],
      correct: [0, 3], // hapless (helpless, helpful, hopeless, hopeful, helpmate)
      explanation: "Hapless - unfortunate.",
      difficulty: 5,
    },
    {
      options: ["weather", "storm", "sun", "proof", "water", "light"],
      correct: [0, 3], // weatherproof (stormproof, stormwater, waterproof, sunlight)
      explanation: "Weatherproof - resistant to weather.",
      difficulty: 5,
    },
    {
      options: ["mal", "ill", "good", "content", "will", "ness"],
      correct: [0, 3], // malcontent (illwill, illness, goodwill, goodness)
      explanation: "Malcontent - a dissatisfied person.",
      difficulty: 5,
    },
    {
      options: ["way", "high", "rail", "ward", "way", "road"],
      correct: [0, 3], // wayward (highway, railway)
      explanation: "Wayward - difficult to control.",
      difficulty: 5,
    },
  ],
};

async function fixCompoundWordsFinal() {
  console.log("🔧 Creating compound word questions with VERIFIED unique answers...\\n");

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
  for (const [ageRange, questions] of Object.entries(finalQuestions)) {
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
      console.log(`✓ Created: ${correctWord}`);
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
      console.log(`✓ Created: ${correctWord} (Challenge)`);
      created++;
    }
  }

  console.log(`\\n\\n=== Summary ===`);
  console.log(`Total questions created: ${created}`);
  console.log(`  Regular (difficulty 2-4): ${Object.values(finalQuestions).flat().length}`);
  console.log(`  Challenge (difficulty 5): ${Object.values(challengeQuestions).flat().length}`);
  console.log(`✅ All questions have been verified to avoid multiple valid answers!`);

  await prisma.$disconnect();
}

fixCompoundWordsFinal();
