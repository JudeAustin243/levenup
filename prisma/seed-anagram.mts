import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Anagram questions...\n");

// First delete all existing anagram questions
console.log("Deleting existing anagram questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "anagram" },
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
  console.log("No existing anagram questions to delete\n");
}

// Anagram questions for ages 6-7 (very simple 3-4 letter words)
const anagram6to7 = [
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe TAC sat on the mat.",
    correctAnswer: "cat",
    explanation: "The anagram of TAC is 'cat', which is a pet that sits on a mat.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe ODG ran to fetch the ball.",
    correctAnswer: "dog",
    explanation: "The anagram of ODG is 'dog', which is a pet that fetches balls.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe NUS was shining in the sky.",
    correctAnswer: "sun",
    explanation: "The anagram of NUS is 'sun', which shines in the sky.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI put a TAH on my head.",
    correctAnswer: "hat",
    explanation: "The anagram of TAH is 'hat', which is something you wear on your head.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI go to sleep in my DEB every night.",
    correctAnswer: "bed",
    explanation: "The anagram of DEB is 'bed', which is where you sleep.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI drink milk from a PUC.",
    correctAnswer: "cup",
    explanation: "The anagram of PUC is 'cup', which you drink from.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI like to NUR in the park.",
    correctAnswer: "run",
    explanation: "The anagram of NUR is 'run', which means to move fast on your feet.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe elephant was very GIB.",
    correctAnswer: "big",
    explanation: "The anagram of GIB is 'big', meaning large in size.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nMy favourite colour is DER.",
    correctAnswer: "red",
    explanation: "The anagram of DER is 'red', which is a colour.",
    difficulty: 1,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe OPT spun round and round.",
    correctAnswer: "top",
    explanation: "The anagram of OPT is 'top', which is a spinning toy.",
    difficulty: 1,


  },
];

// Anagram questions for ages 7-8 (4-5 letter words)
const anagram7to8 = [
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe clown made me feel PAHPY.",
    correctAnswer: "happy",
    explanation: "The anagram of PAHPY is 'happy', meaning feeling glad or pleased.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe frog was ENREG and slimy.",
    correctAnswer: "green",
    explanation: "The anagram of ENREG is 'green', which is the colour of a frog.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI drank a glass of TAWER after my run.",
    correctAnswer: "water",
    explanation: "The anagram of TAWER is 'water', which is a drink.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nWe live in a big SOHUE with a garden.",
    correctAnswer: "house",
    explanation: "The anagram of SOHUE is 'house', which is a building where people live.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI like to LEEPS in my cosy bed.",
    correctAnswer: "sleep",
    explanation: "The anagram of LEEPS is 'sleep', meaning to rest with your eyes closed.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nWe had sandwiches for CUNLH at school.",
    correctAnswer: "lunch",
    explanation: "The anagram of CUNLH is 'lunch', which is the midday meal.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI brush my HEETT every morning and night.",
    correctAnswer: "teeth",
    explanation: "The anagram of HEETT is 'teeth', which are in your mouth and need brushing.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe baby gave me a big MILES.",
    correctAnswer: "smile",
    explanation: "The anagram of MILES is 'smile', which is a happy expression on your face.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe ARTNI went very fast along the tracks.",
    correctAnswer: "train",
    explanation: "The anagram of ARTNI is 'train', which is a vehicle that runs on tracks.",
    difficulty: 2,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI like to BILCM trees in the park.",
    correctAnswer: "climb",
    explanation: "The anagram of BILCM is 'climb', meaning to go up something.",
    difficulty: 2,


  },
];

// Anagram questions for ages 9-10 (5-7 letter words)
const anagram9to10 = [
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nWe grow flowers in our DRAGEN.",
    correctAnswer: "garden",
    explanation: "The anagram of DRAGEN is 'garden', which is an area where you grow plants and flowers.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nWe like to LAVRET to new countries on holiday.",
    correctAnswer: "travel",
    explanation: "The anagram of LAVRET is 'travel', meaning to go on a journey.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nWe had roast chicken for NIDNER last night.",
    correctAnswer: "dinner",
    explanation: "The anagram of NIDNER is 'dinner', which is the evening meal.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe pond was ZFRONE solid in the cold winter.",
    correctAnswer: "frozen",
    explanation: "The anagram of ZFRONE is 'frozen', meaning turned to ice.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe HTBRIG stars lit up the night sky.",
    correctAnswer: "bright",
    explanation: "The anagram of HTBRIG is 'bright', meaning giving out a lot of light.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe king lived in a huge LASTCE on the hill.",
    correctAnswer: "castle",
    explanation: "The anagram of LASTCE is 'castle', which is a large fortified building where royalty lived.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI looked out of the DOWNIW at the rain.",
    correctAnswer: "window",
    explanation: "The anagram of DOWNIW is 'window', which is the glass opening in a wall.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nMars is a TANLEP in our solar system.",
    correctAnswer: "planet",
    explanation: "The anagram of TANLEP is 'planet', which is a large body that orbits a star.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe pirate found a DENHID treasure chest.",
    correctAnswer: "hidden",
    explanation: "The anagram of DENHID is 'hidden', meaning concealed or not easily found.",
    difficulty: 4,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe GRANDO flew high above the village.",
    correctAnswer: "dragon",
    explanation: "The anagram of GRANDO is 'dragon', which is a mythical flying creature.",
    difficulty: 4,


  },
];

// Anagram questions for ages 8-9 (easier words)
const anagram8to9 = [
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI eat SIFH and chips every Friday evening.",
    correctAnswer: "fish",
    explanation: "The anagram of SIFH is 'fish', which makes sense in the context of eating fish and chips.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe girl sat on a ARCIH.",
    correctAnswer: "chair",
    explanation: "The anagram of ARCIH is 'chair', which is a piece of furniture you sit on.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe children JONYEED playing on the swings.",
    correctAnswer: "enjoyed",
    explanation: "The anagram of JONYEED is 'enjoyed', which means they had fun playing.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe SRIBD sang in the trees.",
    correctAnswer: "birds",
    explanation: "The anagram of SRIBD is 'birds', which are animals that sing in trees.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nMy cat Norman got PARTPED in the garage.",
    correctAnswer: "trapped",
    explanation: "The anagram of PARTPED is 'trapped', meaning the cat got stuck or couldn't get out.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe water PERPIDD from the broken tap.",
    correctAnswer: "dripped",
    explanation: "The anagram of PERPIDD is 'dripped', which describes water falling in drops.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe UDEPDL was much deeper than it looked.",
    correctAnswer: "puddle",
    explanation: "The anagram of UDEPDL is 'puddle', which is a small pool of water.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe KROCS bobbed up and down on the lake.",
    correctAnswer: "corks",
    explanation: "The anagram of KROCS is 'corks', which float on water. Note that 'rocks' would not make sense as rocks don't float.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI DILMCEB the tree because my friend dared me.",
    correctAnswer: "climbed",
    explanation: "The anagram of DILMCEB is 'climbed', meaning to go up something.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe jockey put the DADLES on his horse.",
    correctAnswer: "saddle",
    explanation: "The anagram of DADLES is 'saddle', which is what you sit on when riding a horse.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe lights DARKPELS on the Christmas tree.",
    correctAnswer: "sparkled",
    explanation: "The anagram of DARKPELS is 'sparkled', meaning shone brightly with little flashes of light.",
    difficulty: 3,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI made some DELUSCIIO blueberry cupcakes.",
    correctAnswer: "delicious",
    explanation: "The anagram of DELUSCIIO is 'delicious', meaning very tasty.",
    difficulty: 3,


  },
];

// Anagram questions for ages 10-11 (harder words)
const anagram10to11 = [
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI'm tired of IESNVRGI for this exam.",
    correctAnswer: "revising",
    explanation: "The anagram of IESNVRGI is 'revising', which means studying for an exam.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe man fell over and hurt his HODSULER.",
    correctAnswer: "shoulder",
    explanation: "The anagram of HODSULER is 'shoulder', which is part of the body.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nAn SHONET person will never tell lies.",
    correctAnswer: "honest",
    explanation: "The anagram of SHONET is 'honest', meaning truthful and trustworthy.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI'm IRDANEG a novel about magicians.",
    correctAnswer: "reading",
    explanation: "The anagram of IRDANEG is 'reading', meaning looking at and understanding written text.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe goldfish I won at the UFNAFRI is still asleep.",
    correctAnswer: "unfair",
    explanation: "The anagram of UFNAFRI is 'unfair'. This should be 'funfair' - a travelling amusement show with rides and games.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI have a huge collection of TOLABFLO cards.",
    correctAnswer: "football",
    explanation: "The anagram of TOLABFLO is 'football', a sport played with teams kicking a ball.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe criminal PESCADE from the police officer.",
    correctAnswer: "escaped",
    explanation: "The anagram of PESCADE is 'escaped', meaning got away or broke free.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nTop LAYQUIT goods are expensive to buy.",
    correctAnswer: "quality",
    explanation: "The anagram of LAYQUIT is 'quality', meaning the standard of something.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nI misread the ECRIEP and used jam instead of ham.",
    correctAnswer: "recipe",
    explanation: "The anagram of ECRIEP is 'recipe', which is a set of instructions for cooking.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe tennis players GUTHOF to win each point.",
    correctAnswer: "fought",
    explanation: "The anagram of GUTHOF is 'fought', meaning competed or struggled.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nBeau was LECTSEED for the tiddlywinks team.",
    correctAnswer: "selected",
    explanation: "The anagram of LECTSEED is 'selected', meaning chosen or picked.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe TAINUMNO path was steep and dangerous.",
    correctAnswer: "mountain",
    explanation: "The anagram of TAINUMNO is 'mountain', a large natural elevation of the earth's surface.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nShe wrote a FLITUABEU poem about nature.",
    correctAnswer: "beautiful",
    explanation: "The anagram of FLITUABEU is 'beautiful', meaning very attractive or pleasing.",
    difficulty: 5,


  },
  {
    questionText: "Rearrange the letters in capitals to make a word that fits in the sentence.\n\nThe MOPINRATT decision affected everyone.",
    correctAnswer: "important",
    explanation: "The anagram of MOPINRATT is 'important', meaning of great significance or value.",
    difficulty: 5,


  },
];

// Insert 6-7 questions
for (const q of anagram6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "anagram"],
      type: "typed",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "anagram",
    },
  });
}

console.log(`✅ Added ${anagram6to7.length} Anagram questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of anagram7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "anagram"],
      type: "typed",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "anagram",
    },
  });
}

console.log(`✅ Added ${anagram7to8.length} Anagram questions (ages 7-8)`);

// Insert 9-10 questions
for (const q of anagram9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "anagram"],
      type: "typed",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "anagram",
    },
  });
}

console.log(`✅ Added ${anagram9to10.length} Anagram questions (ages 9-10)`);

// Insert 8-9 questions
for (const q of anagram8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "anagram"],
      type: "typed",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "anagram",
    },
  });
}

console.log(`✅ Added ${anagram8to9.length} Anagram questions (ages 8-9)`);

// Insert 10-11 questions
for (const q of anagram10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: [], // Empty array for typed answers
      correctAnswer: 0, // Not used for typed questions
      correctAnswers: q.correctAnswer, // Store the correct answer as string
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "anagram"],
      type: "typed",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "anagram",
    },
  });
}

console.log(`✅ Added ${anagram10to11.length} Anagram questions (ages 10-11)`);
console.log(`\n🎉 Total: ${anagram6to7.length + anagram7to8.length + anagram8to9.length + anagram9to10.length + anagram10to11.length} questions added!`);

await prisma.$disconnect();
