import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding alphabetical order questions...\n");

// Alphabetical ordering questions for ages 8-9
const alphabeticalOrder8to9 = [
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    // Store words in shuffled order for display
    options: ["Behaviour", "Beastly", "Beyond", "Belief", "Benevolent"],
    // Correct order stored as indices of the sorted words
    correctAnswer: 0, // Not used for this type, but required by schema
    correctAnswers: [1, 0, 4, 2, 3], // Indices: Beastly, Behaviour, Belief, Benevolent, Beyond
    explanation: "The correct alphabetical order is: Beastly, Behaviour, Belief, Benevolent, Beyond. When words start with the same letters, you need to look at subsequent letters to determine the order.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Surmount", "Surplus", "Surprises", "Surreptitious", "Surfeits"],
    correctAnswer: 0,
    correctAnswers: [4, 1, 0, 3, 2], // Surfeits, Surmount, Surplus, Surprises, Surreptitious
    explanation: "The correct alphabetical order is: Surfeits, Surmount, Surplus, Surprises, Surreptitious. All words start with 'Sur', so you need to compare the letters that follow.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Conurbation", "Contaminated", "Conflagration", "Confounds"],
    correctAnswer: 0,
    correctAnswers: [3, 2, 1, 0], // Conflagration, Confounds, Contaminated, Conurbation
    explanation: "The correct alphabetical order is: Conflagration, Confounds, Contaminated, Conurbation. All words start with 'Con', so compare the fourth letter onwards.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Forbidding", "Formidable", "Fortification", "Forested", "Forcibly"],
    correctAnswer: 0,
    correctAnswers: [4, 1, 3, 2, 0], // Forcibly, Forested, Formidable, Fortification, Forbidding
    explanation: "The correct alphabetical order is: Forbidding, Forcibly, Forested, Formidable, Fortification. When comparing words that start the same, look at each letter position carefully.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Sustainable", "Renewable", "Unbelievable", "Remarkable"],
    correctAnswer: 0,
    correctAnswers: [3, 1, 0, 2], // Remarkable, Renewable, Sustainable, Unbelievable
    explanation: "The correct alphabetical order is: Remarkable, Renewable, Sustainable, Unbelievable. These words have different starting letters, making it easier to sort.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Breakfast", "Longest", "Tallest", "Noisiest", "Balloonist"],
    correctAnswer: 0,
    correctAnswers: [4, 0, 1, 3, 2], // Balloonist, Breakfast, Longest, Noisiest, Tallest
    explanation: "The correct alphabetical order is: Balloonist, Breakfast, Longest, Noisiest, Tallest.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Penitentiary", "Unwary", "Constabulary", "Mercenary", "Judiciary"],
    correctAnswer: 0,
    correctAnswers: [2, 4, 3, 1, 0], // Constabulary, Judiciary, Mercenary, Penitentiary, Unwary
    explanation: "The correct alphabetical order is: Constabulary, Judiciary, Mercenary, Penitentiary, Unwary.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Curious", "Ridiculous", "Hippopotamus", "Devious", "Grievous"],
    correctAnswer: 0,
    correctAnswers: [0, 3, 4, 2, 1], // Curious, Devious, Grievous, Hippopotamus, Ridiculous
    explanation: "The correct alphabetical order is: Curious, Devious, Grievous, Hippopotamus, Ridiculous.",
    difficulty: 3,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "8-9",
    examBoard: "GL",
  },
];

// Alphabetical ordering questions for ages 10-11
const alphabeticalOrder10to11 = [
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Magnificent", "Malevolent", "Maintenance", "Majesty", "Malicious"],
    correctAnswer: 0,
    correctAnswers: [3, 2, 0, 4, 1], // Majesty, Maintenance, Magnificent, Malicious, Malevolent
    explanation: "The correct alphabetical order is: Maintenance, Magnificent, Majesty, Malicious, Malevolent. All words start with 'Ma', so careful comparison of subsequent letters is needed.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Preliminary", "Predatory", "Prestigious", "Preservation", "Presumably"],
    correctAnswer: 0,
    correctAnswers: [1, 0, 3, 4, 2], // Predatory, Preliminary, Preservation, Presumably, Prestigious
    explanation: "The correct alphabetical order is: Predatory, Preliminary, Preservation, Presumably, Prestigious. All start with 'Pre', requiring careful letter-by-letter comparison.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Catastrophic", "Cathedral", "Catalogue", "Caterpillar", "Category"],
    correctAnswer: 0,
    correctAnswers: [2, 4, 1, 0, 3], // Catalogue, Category, Cathedral, Catastrophic, Caterpillar
    explanation: "The correct alphabetical order is: Catalogue, Category, Catastrophic, Cathedral, Caterpillar. All words start with 'Cat', so you must examine the fourth letter and beyond.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Enthusiastic", "Entertainment", "Entrepreneur", "Environment", "Encouragement"],
    correctAnswer: 0,
    correctAnswers: [4, 1, 2, 0, 3], // Encouragement, Entertainment, Entrepreneur, Enthusiastic, Environment
    explanation: "The correct alphabetical order is: Encouragement, Entertainment, Entrepreneur, Enthusiastic, Environment.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Tremendous", "Traditional", "Transparent", "Transformation", "Treacherous"],
    correctAnswer: 0,
    correctAnswers: [1, 3, 2, 4, 0], // Traditional, Transformation, Transparent, Treacherous, Tremendous
    explanation: "The correct alphabetical order is: Traditional, Transformation, Transparent, Treacherous, Tremendous.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "alphabetical_order",
    questionText: "Arrange the following words in alphabetical order.",
    options: ["Imagination", "Imitation", "Illustration", "Immigration", "Illumination"],
    correctAnswer: 0,
    correctAnswers: [2, 4, 0, 3, 1], // Illustration, Illumination, Imagination, Immigration, Imitation
    explanation: "The correct alphabetical order is: Illustration, Illumination, Imagination, Immigration, Imitation. All words start with 'I' and most with 'Im', requiring careful comparison.",
    difficulty: 5,


    tags: ["verbal_reasoning", "alphabetical_order"],
    ageRange: "10-11",
    examBoard: "GL",
  },
];

// Insert 8-9 questions
for (const q of alphabeticalOrder8to9) {
  await prisma.question.create({
    data: {
      topicId: q.topicId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctAnswers: q.correctAnswers,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: q.tags,
      type: "mcq", // Using mcq type, ordering behavior defined by questionType
      ageRange: q.ageRange,
      examBoard: q.examBoard,
      questionType: q.questionType,
    },
  });
}

console.log(`✅ Added ${alphabeticalOrder8to9.length} alphabetical order questions (ages 8-9)`);

// Insert 10-11 questions
for (const q of alphabeticalOrder10to11) {
  await prisma.question.create({
    data: {
      topicId: q.topicId,
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      correctAnswers: q.correctAnswers,
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

console.log(`✅ Added ${alphabeticalOrder10to11.length} alphabetical order questions (ages 10-11)`);
console.log(`\n🎉 Total: ${alphabeticalOrder8to9.length + alphabeticalOrder10to11.length} questions added!`);

await prisma.$disconnect();
