import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Move a Letter questions...\n");

// First delete all existing move_a_letter questions
console.log("Deleting existing move_a_letter questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "move_a_letter" },
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
  console.log("No existing move_a_letter questions to delete\n");
}

// Move a Letter questions for ages 6-7 (easiest)
const moveALetter6to7 = [
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nstop   in",
    firstWord: "stop",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'stop' to make 'top', and add 's' to 'in' to make 'sin'. The letter that moves is 's'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nstar   at",
    firstWord: "star",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'star' to make 'tar', and add 's' to 'at' to make 'sat'. The letter that moves is 's'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspot   it",
    firstWord: "spot",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'spot' to make 'pot', and add 's' to 'it' to make 'sit'. The letter that moves is 's'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nflag   at",
    firstWord: "flag",
    correctAnswerLetter: "f",
    explanation: "Remove 'f' from 'flag' to make 'lag', and add 'f' to 'at' to make 'fat'. The letter that moves is 'f'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nslip   it",
    firstWord: "slip",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'slip' to make 'lip', and add 's' to 'it' to make 'sit'. The letter that moves is 's'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nblow   oat",
    firstWord: "blow",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'blow' to make 'low', and add 'b' to 'oat' to make 'boat'. The letter that moves is 'b'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nflap   ear",
    firstWord: "flap",
    correctAnswerLetter: "f",
    explanation: "Remove 'f' from 'flap' to make 'lap', and add 'f' to 'ear' to make 'fear'. The letter that moves is 'f'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nrate   ice",
    firstWord: "rate",
    correctAnswerLetter: "r",
    explanation: "Remove 'r' from 'rate' to make 'ate', and add 'r' to 'ice' to make 'rice'. The letter that moves is 'r'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ntrap   end",
    firstWord: "trap",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'trap' to make 'rap', and add 't' to 'end' to make 'tend'. The letter that moves is 't'.",
    difficulty: 1,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ncart   ash",
    firstWord: "cart",
    correctAnswerLetter: "c",
    explanation: "Remove 'c' from 'cart' to make 'art', and add 'c' to 'ash' to make 'cash'. The letter that moves is 'c'.",
    difficulty: 1,


  },
];

// Move a Letter questions for ages 7-8 (easy)
const moveALetter7to8 = [
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nbroom   all",
    firstWord: "broom",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'broom' to make 'room', and add 'b' to 'all' to make 'ball'. The letter that moves is 'b'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ntrack   his",
    firstWord: "track",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'track' to make 'rack', and add 't' to 'his' to make 'this'. The letter that moves is 't'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nsmall   end",
    firstWord: "small",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'small' to make 'mall', and add 's' to 'end' to make 'send'. The letter that moves is 's'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nsnail   end",
    firstWord: "snail",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'snail' to make 'nail', and add 's' to 'end' to make 'send'. The letter that moves is 's'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ngrain   ate",
    firstWord: "grain",
    correctAnswerLetter: "g",
    explanation: "Remove 'g' from 'grain' to make 'rain', and add 'g' to 'ate' to make 'gate'. The letter that moves is 'g'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nblame   rain",
    firstWord: "blame",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'blame' to make 'lame', and add 'b' to 'rain' to make 'brain'. The letter that moves is 'b'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nflame   are",
    firstWord: "flame",
    correctAnswerLetter: "f",
    explanation: "Remove 'f' from 'flame' to make 'lame', and add 'f' to 'are' to make 'fare'. The letter that moves is 'f'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\npeach   lot",
    firstWord: "peach",
    correctAnswerLetter: "p",
    explanation: "Remove 'p' from 'peach' to make 'each', and add 'p' to 'lot' to make 'plot'. The letter that moves is 'p'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ntrain   ape",
    firstWord: "train",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'train' to make 'rain', and add 't' to 'ape' to make 'tape'. The letter that moves is 't'.",
    difficulty: 2,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ndrain   are",
    firstWord: "drain",
    correctAnswerLetter: "d",
    explanation: "Remove 'd' from 'drain' to make 'rain', and add 'd' to 'are' to make 'dare'. The letter that moves is 'd'.",
    difficulty: 2,


  },
];

// Move a Letter questions for ages 8-9 (easier)
const moveALetter8to9 = [
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nbone   lame",
    firstWord: "bone",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'bone' to make 'one', and add 'b' to 'lame' to make 'blame'. The letter that moves is 'b'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nstile   old",
    firstWord: "stile",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'stile' to make 'tile', and add 's' to 'old' to make 'sold'. The letter that moves is 's'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nplace   and",
    firstWord: "place",
    correctAnswerLetter: "l",
    explanation: "Remove 'l' from 'place' to make 'pace', and add 'l' to 'and' to make 'land'. The letter that moves is 'l'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ngreed   son",
    firstWord: "greed",
    correctAnswerLetter: "g",
    explanation: "Remove 'g' from 'greed' to make 'reed', and add 'g' to 'son' to make 'song'. The letter that moves is 'g'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspat   our",
    firstWord: "spat",
    correctAnswerLetter: "p",
    explanation: "Remove 'p' from 'spat' to make 'sat', and add 'p' to 'our' to make 'pour'. The letter that moves is 'p'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nhedge   cap",
    firstWord: "hedge",
    correctAnswerLetter: "h",
    explanation: "Remove 'h' from 'hedge' to make 'edge', and add 'h' to 'cap' to make 'chap'. The letter that moves is 'h'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nslide   ink",
    firstWord: "slide",
    correctAnswerLetter: "l",
    explanation: "Remove 'l' from 'slide' to make 'side', and add 'l' to 'ink' to make 'link'. The letter that moves is 'l'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspeed   hat",
    firstWord: "speed",
    correctAnswerLetter: "e",
    explanation: "Remove 'e' from 'speed' to make 'sped', and add 'e' to 'hat' to make 'heat'. The letter that moves is 'e'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nbrand   ace",
    firstWord: "brand",
    correctAnswerLetter: "r",
    explanation: "Remove 'r' from 'brand' to make 'band', and add 'r' to 'ace' to make 'race'. The letter that moves is 'r'.",
    difficulty: 3,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nplane   each",
    firstWord: "plane",
    correctAnswerLetter: "p",
    explanation: "Remove 'p' from 'plane' to make 'lane', and add 'p' to 'each' to make 'peach'. The letter that moves is 'p'.",
    difficulty: 3,


  },
];

// Move a Letter questions for ages 9-10 (medium)
const moveALetter9to10 = [
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ncheat   lad",
    firstWord: "cheat",
    correctAnswerLetter: "c",
    explanation: "Remove 'c' from 'cheat' to make 'heat', and add 'c' to 'lad' to make 'clad'. The letter that moves is 'c'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ntrain   able",
    firstWord: "train",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'train' to make 'rain', and add 't' to 'able' to make 'table'. The letter that moves is 't'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspell   lit",
    firstWord: "spell",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'spell' to make 'pell', and add 's' to 'lit' to make 'slit'. The letter that moves is 's'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ncrash   link",
    firstWord: "crash",
    correctAnswerLetter: "c",
    explanation: "Remove 'c' from 'crash' to make 'rash', and add 'c' to 'link' to make 'clink'. The letter that moves is 'c'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nslash   late",
    firstWord: "slash",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'slash' to make 'lash', and add 's' to 'late' to make 'slate'. The letter that moves is 's'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nbeast   row",
    firstWord: "beast",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'beast' to make 'east', and add 'b' to 'row' to make 'brow'. The letter that moves is 'b'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspark   age",
    firstWord: "spark",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'spark' to make 'park', and add 's' to 'age' to make 'sage'. The letter that moves is 's'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ncharm   lap",
    firstWord: "charm",
    correctAnswerLetter: "c",
    explanation: "Remove 'c' from 'charm' to make 'harm', and add 'c' to 'lap' to make 'clap'. The letter that moves is 'c'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nshake   are",
    firstWord: "shake",
    correctAnswerLetter: "h",
    explanation: "Remove 'h' from 'shake' to make 'sake', and add 'h' to 'are' to make 'hare'. The letter that moves is 'h'.",
    difficulty: 4,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ngrace   love",
    firstWord: "grace",
    correctAnswerLetter: "g",
    explanation: "Remove 'g' from 'grace' to make 'race', and add 'g' to 'love' to make 'glove'. The letter that moves is 'g'.",
    difficulty: 4,


  },
];

// Move a Letter questions for ages 10-11 (harder)
const moveALetter10to11 = [
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ngroom   lad",
    firstWord: "groom",
    correctAnswerLetter: "g",
    explanation: "Remove 'g' from 'groom' to make 'room', and add 'g' to 'lad' to make 'glad'. The letter that moves is 'g'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nfrill   tip",
    firstWord: "frill",
    correctAnswerLetter: "r",
    explanation: "Remove 'r' from 'frill' to make 'fill', and add 'r' to 'tip' to make 'trip'. The letter that moves is 'r'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nstale   rim",
    firstWord: "stale",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'stale' to make 'sale', and add 't' to 'rim' to make 'trim'. The letter that moves is 't'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nspine   and",
    firstWord: "spine",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'spine' to make 'pine', and add 's' to 'and' to make 'sand'. The letter that moves is 's'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nblack   rim",
    firstWord: "black",
    correctAnswerLetter: "b",
    explanation: "Remove 'b' from 'black' to make 'lack', and add 'b' to 'rim' to make 'brim'. The letter that moves is 'b'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\ntable   rip",
    firstWord: "table",
    correctAnswerLetter: "t",
    explanation: "Remove 't' from 'table' to make 'able', and add 't' to 'rip' to make 'trip'. The letter that moves is 't'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nreach   pat",
    firstWord: "reach",
    correctAnswerLetter: "r",
    explanation: "Remove 'r' from 'reach' to make 'each', and add 'r' to 'pat' to make 'part'. The letter that moves is 'r'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\njoker   fee",
    firstWord: "joker",
    correctAnswerLetter: "r",
    explanation: "Remove 'r' from 'joker' to make 'joke', and add 'r' to 'fee' to make 'free'. The letter that moves is 'r'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nglove   rate",
    firstWord: "glove",
    correctAnswerLetter: "g",
    explanation: "Remove 'g' from 'glove' to make 'love', and add 'g' to 'rate' to make 'grate'. The letter that moves is 'g'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\naural   how",
    firstWord: "aural",
    correctAnswerLetter: "l",
    explanation: "Remove 'l' from 'aural' to make 'aura', and add 'l' to 'how' to make 'howl'. The letter that moves is 'l'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nsnore   pie",
    firstWord: "snore",
    correctAnswerLetter: "n",
    explanation: "Remove 'n' from 'snore' to make 'sore', and add 'n' to 'pie' to make 'pine'. The letter that moves is 'n'.",
    difficulty: 5,


  },
  {
    questionText: "Remove one letter from the first word and add it to the second word to make two new words. Do not change the order of the other letters. Which letter moves?\n\nchairs   kit",
    firstWord: "chairs",
    correctAnswerLetter: "s",
    explanation: "Remove 's' from 'chairs' to make 'chair', and add 's' to 'kit' to make 'skit'. The letter that moves is 's'.",
    difficulty: 5,


  },
];

// Insert 6-7 questions
for (const q of moveALetter6to7) {
  const options = q.firstWord.toLowerCase().split("");
  const correctAnswer = options.indexOf(q.correctAnswerLetter.toLowerCase());

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: options,
      correctAnswer: correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "move_a_letter"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "move_a_letter",
    },
  });
}

console.log(`✅ Added ${moveALetter6to7.length} Move a Letter questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of moveALetter7to8) {
  const options = q.firstWord.toLowerCase().split("");
  const correctAnswer = options.indexOf(q.correctAnswerLetter.toLowerCase());

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: options,
      correctAnswer: correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "move_a_letter"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "move_a_letter",
    },
  });
}

console.log(`✅ Added ${moveALetter7to8.length} Move a Letter questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of moveALetter8to9) {
  const options = q.firstWord.toLowerCase().split("");
  const correctAnswer = options.indexOf(q.correctAnswerLetter.toLowerCase());

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: options,
      correctAnswer: correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "move_a_letter"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "move_a_letter",
    },
  });
}

console.log(`✅ Added ${moveALetter8to9.length} Move a Letter questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of moveALetter9to10) {
  const options = q.firstWord.toLowerCase().split("");
  const correctAnswer = options.indexOf(q.correctAnswerLetter.toLowerCase());

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: options,
      correctAnswer: correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "move_a_letter"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "move_a_letter",
    },
  });
}

console.log(`✅ Added ${moveALetter9to10.length} Move a Letter questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of moveALetter10to11) {
  const options = q.firstWord.toLowerCase().split("");
  const correctAnswer = options.indexOf(q.correctAnswerLetter.toLowerCase());

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: options,
      correctAnswer: correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "move_a_letter"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "move_a_letter",
    },
  });
}

console.log(`✅ Added ${moveALetter10to11.length} Move a Letter questions (ages 10-11)`);
console.log(`\n🎉 Total: ${moveALetter6to7.length + moveALetter7to8.length + moveALetter8to9.length + moveALetter9to10.length + moveALetter10to11.length} questions added!`);

await prisma.$disconnect();
