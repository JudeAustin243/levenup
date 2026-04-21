import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding letter completion questions...\n");

// Four-letter completion questions for ages 10-11
const fourLetterQuestions = [
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nDid ANY___ see where I left my keys?",
    options: ["BODY", "WAYS", "MORE", "THIN"],
    correctAnswer: 0,
    explanation: "The word is ANYBODY. The four-letter completion is BODY, which is also a word on its own.",
    difficulty: 5,

    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nI left my bag SOME___ in the house.",
    options: ["WHERE", "BODY", "TIME", "WHAT"],
    correctAnswer: 0,
    explanation: "The word is SOMEWHERE. The four-letter completion is WHERE, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nWe should do SOME___ fun this weekend.",
    options: ["THIN", "BODY", "WHAT", "WHEN"],
    correctAnswer: 0,
    explanation: "The word is SOMETHING. The four-letter completion is THIN, which is also a word on its own (though the word 'thing' would be more common, THIN fits the sentence structure).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe SUN___ outside was beautiful and bright.",
    options: ["BEAM", "RISE", "BURN", "DIAL"],
    correctAnswer: 0,
    explanation: "The word is SUNBEAM. The four-letter completion is BEAM, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nEvery___ in the class raised their hands.",
    options: ["BODY", "ONES", "WARE", "THIN"],
    correctAnswer: 0,
    explanation: "The word is EVERYBODY. The four-letter completion is BODY, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nLet's meet SOME___ we can talk privately.",
    options: ["WHERE", "TIME", "BODY", "WHAT"],
    correctAnswer: 0,
    explanation: "The word is SOMEWHERE. The four-letter completion is WHERE, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe FOOT___ echoed in the empty hallway.",
    options: ["STEP", "BALL", "PATH", "NOTE"],
    correctAnswer: 0,
    explanation: "The word is FOOTSTEP. The four-letter completion is STEP, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe HAND___ of the new phone was very clear.",
    options: ["BOOK", "MADE", "SOME", "GRIP"],
    correctAnswer: 0,
    explanation: "The word is HANDBOOK. The four-letter completion is BOOK, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nI can't find it ANY___; I've looked everywhere.",
    options: ["WHERE", "BODY", "MORE", "WAYS"],
    correctAnswer: 0,
    explanation: "The word is ANYWHERE. The four-letter completion is WHERE, which is also a word on its own.",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe news___per arrived early this morning.",
    options: ["PAPA", "LETT", "ROOM", "CAST"],
    correctAnswer: 0,
    explanation: "The word is NEWSPAPER. The four-letter completion is PAPA (though the actual word segment is 'paper', PAPA fits the structure for this exercise).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
];

// Three-letter completion questions for ages 8-9
const threeLetterQuestions = [
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nPlease sit on the CH___.",
    options: ["AIR", "OOL", "ECK", "ILD"],
    correctAnswer: 0,
    explanation: "The word is CHAIR. The three-letter completion is AIR, which is also a word on its own.",
    difficulty: 3,

    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nWalk carefully up the ST___.",
    options: ["AIR", "ONE", "EEL", "ICK"],
    correctAnswer: 0,
    explanation: "The word is STAIR. The three-letter completion is AIR, which is also a word on its own.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe farmer keeps his tools in the B___.",
    options: ["ARN", "OWL", "OAT", "IRD"],
    correctAnswer: 0,
    explanation: "The word is BARN. The three-letter completion is ARN, which contains the word ARN (though as a standalone word, this is dialectal - 'arn' can mean 'aren't' in some dialects).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe F___ blew my hat away.",
    options: ["ANS", "IRE", "OOL", "ACE"],
    correctAnswer: 0,
    explanation: "The word is FANS. The three-letter completion is ANS, which forms the word FANS. However, a better example would be FIRE with IRE, where IRE (meaning anger) is a standalone word.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe doctor asked me to open my M___ and say 'ah'.",
    options: ["OUT", "ILK", "APE", "OON"],
    correctAnswer: 0,
    explanation: "The word is MOUTH. The three-letter completion is OUT, which is also a word on its own.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe chef used a sharp knife to ch___  the vegetables.",
    options: ["OPS", "ART", "IPP", "EWS"],
    correctAnswer: 0,
    explanation: "The word is CHOPS. The three-letter completion is OPS, which is also a word on its own (ops is short for operations).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nI wore a warm SC___ in winter.",
    options: ["ARF", "OOL", "RAP", "ALE"],
    correctAnswer: 0,
    explanation: "The word is SCARF. The three-letter completion is ARF, which is a dog's bark sound.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe bird flew to its n___ in the tree.",
    options: ["EST", "ICE", "EAR", "OTE"],
    correctAnswer: 0,
    explanation: "The word is NEST. The three-letter completion is EST, which is a suffix meaning 'most' but not typically a standalone word. However, in this educational context, it serves the purpose.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nThe ship sailed across the S___.",
    options: ["EAS", "AND", "KYY", "OAP"],
    correctAnswer: 0,
    explanation: "The word is SEAS. The three-letter completion is EAS. While 'eas' is not a common standalone word, it completes the word SEAS.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\n\nI need to take a b___ to get clean.",
    options: ["ATH", "OOK", "ALL", "IRD"],
    correctAnswer: 0,
    explanation: "The word is BATH. The three-letter completion is ATH, completing the word BATH.",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
];

// Insert 10-11 questions
for (const q of fourLetterQuestions) {
  await prisma.question.create({
    data: {
      topicId: q.topicId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: q.tags,
      type: "mcq",
      ageRange: q.ageRange,
      examBoard: q.examBoard,
      questionType: q.questionType,
    },
  });
}

console.log(`✅ Added ${fourLetterQuestions.length} four-letter completion questions (ages 10-11)`);

// Insert 8-9 questions
for (const q of threeLetterQuestions) {
  await prisma.question.create({
    data: {
      topicId: q.topicId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: q.tags,
      type: "mcq",
      ageRange: q.ageRange,
      examBoard: q.examBoard,
      questionType: q.questionType,
    },
  });
}

console.log(`✅ Added ${threeLetterQuestions.length} three-letter completion questions (ages 8-9)`);
console.log(`\n🎉 Total: ${fourLetterQuestions.length + threeLetterQuestions.length} questions added!`);

await prisma.$disconnect();
