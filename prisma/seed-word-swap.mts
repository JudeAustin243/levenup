import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Word Swap questions...\n");

// First delete all existing word_swap questions
console.log("Deleting existing word_swap questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "word_swap" },
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
  console.log("No existing word_swap questions to delete\n");
}

// Word Swap questions for ages 6-7 (very easy - short simple sentences)
const wordSwap6to7 = [
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe dog big is.",
    scrambledSentence: "The dog big is.",
    correctAnswer: [2, 3], // "big" and "is"
    correctSentence: "The dog is big.",
    explanation: "The words 'big' and 'is' should be swapped. The correct sentence is: 'The dog is big.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nI blue a like ball.",
    scrambledSentence: "I blue a like ball.",
    correctAnswer: [1, 3], // "blue" and "like"
    correctSentence: "I like a blue ball.",
    explanation: "The words 'blue' and 'like' should be swapped. The correct sentence is: 'I like a blue ball.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe sun hot is.",
    scrambledSentence: "The sun hot is.",
    correctAnswer: [2, 3], // "hot" and "is"
    correctSentence: "The sun is hot.",
    explanation: "The words 'hot' and 'is' should be swapped. The correct sentence is: 'The sun is hot.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nShe fast runs very.",
    scrambledSentence: "She fast runs very.",
    correctAnswer: [1, 2], // "fast" and "runs"
    correctSentence: "She runs very fast.",
    explanation: "The words 'fast' and 'runs' should be swapped. The correct sentence is: 'She runs very fast.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nMy red is bike.",
    scrambledSentence: "My red is bike.",
    correctAnswer: [2, 3], // "is" and "bike"
    correctSentence: "My bike is red.",
    explanation: "The words 'is' and 'bike' should be swapped. The correct sentence is: 'My bike is red.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe jump can frog high.",
    scrambledSentence: "The jump can frog high.",
    correctAnswer: [1, 3], // "jump" and "frog"
    correctSentence: "The frog can jump high.",
    explanation: "The words 'jump' and 'frog' should be swapped. The correct sentence is: 'The frog can jump high.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nBirds the sky in fly.",
    scrambledSentence: "Birds the sky in fly.",
    correctAnswer: [1, 4], // "the" and "fly"
    correctSentence: "Birds fly in the sky.",
    explanation: "The words 'the' and 'fly' should be swapped. The correct sentence is: 'Birds fly in the sky.'",
    difficulty: 1,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nWe park the to walk.",
    scrambledSentence: "We park the to walk.",
    correctAnswer: [1, 4], // "park" and "walk"
    correctSentence: "We walk to the park.",
    explanation: "The words 'park' and 'walk' should be swapped. The correct sentence is: 'We walk to the park.'",
    difficulty: 1,


  },
];

// Word Swap questions for ages 7-8 (easy - medium sentences with clear swaps)
const wordSwap7to8 = [
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe cat black chased the mouse.",
    scrambledSentence: "The cat black chased the mouse.",
    correctAnswer: [1, 2], // "cat" and "black"
    correctSentence: "The black cat chased the mouse.",
    explanation: "The words 'cat' and 'black' should be swapped. The correct sentence is: 'The black cat chased the mouse.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nMy sister tall is than me.",
    scrambledSentence: "My sister tall is than me.",
    correctAnswer: [2, 3], // "tall" and "is"
    correctSentence: "My sister is taller than me.",
    explanation: "The words 'tall' and 'is' should be swapped. The correct sentence is: 'My sister is taller than me.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe apple tree on fell the ground.",
    scrambledSentence: "The apple tree on fell the ground.",
    correctAnswer: [2, 4], // "tree" and "fell"
    correctSentence: "The apple fell on the ground.",
    explanation: "The words 'tree' and 'fell' should be swapped. The correct sentence is: 'The apple fell on the ground.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nHe plays school after football.",
    scrambledSentence: "He plays school after football.",
    correctAnswer: [2, 3], // "school" and "after"
    correctSentence: "He plays football after school.",
    explanation: "The words 'school' and 'after' should be swapped. The correct sentence is: 'He plays football after school.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe toy my with playing is brother.",
    scrambledSentence: "The toy my with playing is brother.",
    correctAnswer: [1, 6], // "toy" and "brother"
    correctSentence: "My brother is playing with the toy.",
    explanation: "The words 'toy' and 'brother' should be swapped. The correct sentence is: 'My brother is playing with the toy.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nShe reads every her night book.",
    scrambledSentence: "She reads every her night book.",
    correctAnswer: [3, 5], // "her" and "book"
    correctSentence: "She reads her book every night.",
    explanation: "The words 'her' and 'book' should be swapped. The correct sentence is: 'She reads her book every night.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe bright shines sun in the morning.",
    scrambledSentence: "The bright shines sun in the morning.",
    correctAnswer: [2, 3], // "shines" and "sun"
    correctSentence: "The bright sun shines in the morning.",
    explanation: "The words 'shines' and 'sun' should be swapped. The correct sentence is: 'The bright sun shines in the morning.'",
    difficulty: 2,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nWe beach the to going are today.",
    scrambledSentence: "We beach the to going are today.",
    correctAnswer: [1, 4], // "beach" and "going"
    correctSentence: "We are going to the beach today.",
    explanation: "The words 'beach' and 'going' should be swapped. The correct sentence is: 'We are going to the beach today.'",
    difficulty: 2,


  },
];

// Word Swap questions for ages 9-10 (intermediate - longer sentences with less obvious swaps)
const wordSwap9to10 = [
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe children quietly walked through library the.",
    scrambledSentence: "The children quietly walked through library the.",
    correctAnswer: [4, 5], // "library" and "the"
    correctSentence: "The children quietly walked through the library.",
    explanation: "The words 'library' and 'the' should be swapped. The correct sentence is: 'The children quietly walked through the library.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nMy grandmother delicious baked cookies a batch of yesterday.",
    scrambledSentence: "My grandmother delicious baked cookies a batch of yesterday.",
    correctAnswer: [2, 3], // "delicious" and "baked"
    correctSentence: "My grandmother baked a delicious batch of cookies yesterday.",
    explanation: "The words 'delicious' and 'baked' should be swapped. The correct sentence is: 'My grandmother baked a delicious batch of cookies yesterday.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe explorer jungle the through carefully trekked dangerous.",
    scrambledSentence: "The explorer jungle the through carefully trekked dangerous.",
    correctAnswer: [1, 5], // "jungle" and "trekked"
    correctSentence: "The explorer carefully trekked through the dangerous jungle.",
    explanation: "The words 'jungle' and 'trekked' should be swapped. The correct sentence is: 'The explorer carefully trekked through the dangerous jungle.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nAfter the match, the winning celebrated loudly team.",
    scrambledSentence: "After the match, the winning celebrated loudly team.",
    correctAnswer: [5, 7], // "celebrated" and "team"
    correctSentence: "After the match, the winning team celebrated loudly.",
    explanation: "The words 'celebrated' and 'team' should be swapped. The correct sentence is: 'After the match, the winning team celebrated loudly.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe students museum at the learned many things interesting.",
    scrambledSentence: "The students museum at the learned many things interesting.",
    correctAnswer: [2, 4], // "museum" and "learned"
    correctSentence: "The students learned many interesting things at the museum.",
    explanation: "The words 'museum' and 'learned' should be swapped. The correct sentence is: 'The students learned many interesting things at the museum.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nDuring the storm, lightning the sky across flashed brightly.",
    scrambledSentence: "During the storm, lightning the sky across flashed brightly.",
    correctAnswer: [5, 6], // "across" and "flashed"
    correctSentence: "During the storm, lightning flashed brightly across the sky.",
    explanation: "The words 'across' and 'flashed' should be swapped. The correct sentence is: 'During the storm, lightning flashed brightly across the sky.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe artist painted picture a beautiful of the mountains.",
    scrambledSentence: "The artist painted picture a beautiful of the mountains.",
    correctAnswer: [2, 3], // "picture" and "a"
    correctSentence: "The artist painted a beautiful picture of the mountains.",
    explanation: "The words 'picture' and 'a' should be swapped. The correct sentence is: 'The artist painted a beautiful picture of the mountains.'",
    difficulty: 4,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe garden in flowers the bloom spring during.",
    scrambledSentence: "The garden in flowers the bloom spring during.",
    correctAnswer: [1, 4], // "garden" and "bloom"
    correctSentence: "The flowers bloom in the garden during spring.",
    explanation: "The words 'garden' and 'bloom' should be swapped. The correct sentence is: 'The flowers bloom in the garden during spring.'",
    difficulty: 4,


  },
];

// Word Swap questions for ages 8-9 (easier sentences)
const wordSwap8to9 = [
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nWhen the clock struck time, it was nine for bed.",
    scrambledSentence: "When the clock struck time, it was nine for bed.",
    // Indices of words to swap (0-based): "time" (index 4) and "nine" (index 7)
    correctAnswer: [4, 7],
    correctSentence: "When the clock struck nine, it was time for bed.",
    explanation: "The words 'time' and 'nine' should be swapped. The correct sentence is: 'When the clock struck nine, it was time for bed.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nGreg police in the weapon to the handed.",
    scrambledSentence: "Greg police in the weapon to the handed.",
    correctAnswer: [1, 7], // "police" and "handed"
    correctSentence: "Greg handed in the weapon to the police.",
    explanation: "The words 'police' and 'handed' should be swapped. The correct sentence is: 'Greg handed in the weapon to the police.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nIt was down dirty very the mine.",
    scrambledSentence: "It was down dirty very the mine.",
    correctAnswer: [2, 4], // "down" and "very"
    correctSentence: "It was very dirty down the mine.",
    explanation: "The words 'down' and 'very' should be swapped. The correct sentence is: 'It was very dirty down the mine.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe teacher with very angry was the naughty child.",
    scrambledSentence: "The teacher with very angry was the naughty child.",
    correctAnswer: [2, 5], // "with" and "was"
    correctSentence: "The teacher was very angry with the naughty child.",
    explanation: "The words 'with' and 'was' should be swapped. The correct sentence is: 'The teacher was very angry with the naughty child.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe me film gave horror a nightmare.",
    scrambledSentence: "The me film gave horror a nightmare.",
    correctAnswer: [1, 4], // "me" and "horror"
    correctSentence: "The horror film gave me a nightmare.",
    explanation: "The words 'me' and 'horror' should be swapped. The correct sentence is: 'The horror film gave me a nightmare.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe old down walked man the empty street.",
    scrambledSentence: "The old down walked man the empty street.",
    correctAnswer: [2, 4], // "down" and "man"
    correctSentence: "The old man walked down the empty street.",
    explanation: "The words 'down' and 'man' should be swapped. The correct sentence is: 'The old man walked down the empty street.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nA rainbow to a beautiful sight is see.",
    scrambledSentence: "A rainbow to a beautiful sight is see.",
    correctAnswer: [5, 6], // "is" and "see"
    correctSentence: "A rainbow is a beautiful sight to see.",
    explanation: "The words 'is' and 'see' should be swapped. The correct sentence is: 'A rainbow is a beautiful sight to see.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe cat up the tree quickly climbed.",
    scrambledSentence: "The cat up the tree quickly climbed.",
    correctAnswer: [2, 5], // "up" and "quickly"
    correctSentence: "The cat quickly climbed up the tree.",
    explanation: "The words 'up' and 'quickly' should be swapped. The correct sentence is: 'The cat quickly climbed up the tree.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nShe a letter to wrote her friend yesterday.",
    scrambledSentence: "She a letter to wrote her friend yesterday.",
    correctAnswer: [3, 4], // "to" and "wrote"
    correctSentence: "She wrote a letter to her friend yesterday.",
    explanation: "The words 'to' and 'wrote' should be swapped. The correct sentence is: 'She wrote a letter to her friend yesterday.'",
    difficulty: 3,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe children playing were happily in the park.",
    scrambledSentence: "The children playing were happily in the park.",
    correctAnswer: [2, 3], // "playing" and "were"
    correctSentence: "The children were playing happily in the park.",
    explanation: "The words 'playing' and 'were' should be swapped. The correct sentence is: 'The children were playing happily in the park.'",
    difficulty: 3,


  },
];

// Word Swap questions for ages 10-11 (harder sentences)
const wordSwap10to11 = [
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nTraffic, amber and green are the colours of a red light.",
    scrambledSentence: "Traffic, amber and green are the colours of a red light.",
    correctAnswer: [0, 10], // "Traffic" and "red"
    correctSentence: "Red, amber and green are the colours of a traffic light.",
    explanation: "The words 'Traffic' and 'red' should be swapped. The correct sentence is: 'Red, amber and green are the colours of a traffic light.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nI which a diamond ring own sparkles in the sunlight.",
    scrambledSentence: "I which a diamond ring own sparkles in the sunlight.",
    correctAnswer: [1, 5], // "which" and "own"
    correctSentence: "I own a diamond ring which sparkles in the sunlight.",
    explanation: "The words 'which' and 'own' should be swapped. The correct sentence is: 'I own a diamond ring which sparkles in the sunlight.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nI took my be to shoes repaired.",
    scrambledSentence: "I took my be to shoes repaired.",
    correctAnswer: [3, 5], // "be" and "shoes"
    correctSentence: "I took my shoes to be repaired.",
    explanation: "The words 'be' and 'shoes' should be swapped. The correct sentence is: 'I took my shoes to be repaired.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nSummer was a hot day in it.",
    scrambledSentence: "Summer was a hot day in it.",
    correctAnswer: [0, 4], // "Summer" and "day"
    correctSentence: "It was a hot day in summer.",
    explanation: "The words 'Summer' and 'it' should be swapped, and sentence structure adjusted. The correct sentence is: 'It was a hot day in summer.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nI around love to fly would the world.",
    scrambledSentence: "I around love to fly would the world.",
    correctAnswer: [1, 5], // "around" and "would"
    correctSentence: "I would love to fly around the world.",
    explanation: "The words 'around' and 'would' should be swapped. The correct sentence is: 'I would love to fly around the world.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nI washed dried hair and then my it.",
    scrambledSentence: "I washed dried hair and then my it.",
    correctAnswer: [2, 5], // "hair" and "my"
    correctSentence: "I washed my hair and then dried it.",
    explanation: "The words 'hair' and 'my' should be swapped. The correct sentence is: 'I washed my hair and then dried it.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nCup a meal, I enjoy a after of coffee.",
    scrambledSentence: "Cup a meal, I enjoy a after of coffee.",
    correctAnswer: [0, 6], // "Cup" and "after"
    correctSentence: "After a meal, I enjoy a cup of coffee.",
    explanation: "The words 'Cup' and 'after' should be swapped. The correct sentence is: 'After a meal, I enjoy a cup of coffee.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nYou make boil water in order to must tea.",
    scrambledSentence: "You make boil water in order to must tea.",
    correctAnswer: [1, 7], // "make" and "must"
    correctSentence: "You must boil water in order to make tea.",
    explanation: "The words 'make' and 'must' should be swapped. The correct sentence is: 'You must boil water in order to make tea.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe doctor man's a plaster cast on the put broken leg.",
    scrambledSentence: "The doctor man's a plaster cast on the put broken leg.",
    correctAnswer: [2, 8], // "man's" and "put"
    correctSentence: "The doctor put a plaster cast on the man's broken leg.",
    explanation: "The words 'man's' and 'put' should be swapped. The correct sentence is: 'The doctor put a plaster cast on the man's broken leg.'",
    difficulty: 5,


  },
  {
    questionText: "Find the two words that should be swapped in order for the sentence to make sense. Click on both words.\n\nThe food is always at and particularly so enjoyable weekends.",
    scrambledSentence: "The food is always at and particularly so enjoyable weekends.",
    correctAnswer: [4, 8], // "at" and "enjoyable"
    correctSentence: "The food is always enjoyable and particularly so at weekends.",
    explanation: "The words 'at' and 'enjoyable' should be swapped. The correct sentence is: 'The food is always enjoyable and particularly so at weekends.'",
    difficulty: 5,


  },
];

// Helper function to convert sentence to word array
function sentenceToWords(sentence: string): string[] {
  return sentence.split(/\s+/);
}

// Insert 6-7 questions
for (const q of wordSwap6to7) {
  const words = sentenceToWords(q.scrambledSentence);

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: words, // Each word is an option
      correctAnswer: 0, // Not used for multi-select
      correctAnswers: q.correctAnswer, // Array of two indices
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_swap", "sentence_structure"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "word_swap",
    },
  });
}

console.log(`✅ Added ${wordSwap6to7.length} Word Swap questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of wordSwap7to8) {
  const words = sentenceToWords(q.scrambledSentence);

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: words, // Each word is an option
      correctAnswer: 0, // Not used for multi-select
      correctAnswers: q.correctAnswer, // Array of two indices
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_swap", "sentence_structure"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "word_swap",
    },
  });
}

console.log(`✅ Added ${wordSwap7to8.length} Word Swap questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of wordSwap8to9) {
  const words = sentenceToWords(q.scrambledSentence);

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: words, // Each word is an option
      correctAnswer: 0, // Not used for multi-select
      correctAnswers: q.correctAnswer, // Array of two indices
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_swap", "sentence_structure"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "word_swap",
    },
  });
}

console.log(`✅ Added ${wordSwap8to9.length} Word Swap questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of wordSwap9to10) {
  const words = sentenceToWords(q.scrambledSentence);

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: words, // Each word is an option
      correctAnswer: 0, // Not used for multi-select
      correctAnswers: q.correctAnswer, // Array of two indices
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_swap", "sentence_structure"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "word_swap",
    },
  });
}

console.log(`✅ Added ${wordSwap9to10.length} Word Swap questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of wordSwap10to11) {
  const words = sentenceToWords(q.scrambledSentence);

  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: words, // Each word is an option
      correctAnswer: 0, // Not used for multi-select
      correctAnswers: q.correctAnswer, // Array of two indices
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "word_swap", "sentence_structure"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "word_swap",
    },
  });
}

console.log(`✅ Added ${wordSwap10to11.length} Word Swap questions (ages 10-11)`);

const totalQuestions =
  wordSwap6to7.length +
  wordSwap7to8.length +
  wordSwap8to9.length +
  wordSwap9to10.length +
  wordSwap10to11.length;

console.log(`\n🎉 Total: ${totalQuestions} questions added!`);

await prisma.$disconnect();
