import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Number Sequences questions...\n");

// First delete all existing number_sequences questions
console.log("Deleting existing number_sequences questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "number_sequences" },
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
  console.log("No existing number_sequences questions to delete\n");
}

// Number Sequences questions for ages 6-7 (very easy patterns - counting)
const numberSequences6to7 = [
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   2   3   4   5   ( ___ )",
    options: ["6", "7", "8", "9", "10"],
    correctAnswer: 0, // 6
    explanation: "The numbers count up by +1 each time (1, 2, 3, 4, 5, 6).",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n2   4   6   8   10   ( ___ )",
    options: ["11", "12", "13", "14", "15"],
    correctAnswer: 1, // 12
    explanation: "Each number increases by +2 (2, 4, 6, 8, 10, 12). These are even numbers.",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n5   10   15   20   25   ( ___ )",
    options: ["28", "29", "30", "31", "32"],
    correctAnswer: 2, // 30
    explanation: "Each number increases by +5 (5, 10, 15, 20, 25, 30). Count by fives.",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n10   20   30   40   50   ( ___ )",
    options: ["55", "58", "60", "65", "70"],
    correctAnswer: 2, // 60
    explanation: "Each number increases by +10 (10, 20, 30, 40, 50, 60). Count by tens.",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n10   9   8   7   6   ( ___ )",
    options: ["5", "4", "3", "2", "1"],
    correctAnswer: 0, // 5
    explanation: "The numbers count down by -1 each time (10, 9, 8, 7, 6, 5).",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   3   5   7   9   ( ___ )",
    options: ["10", "11", "12", "13", "14"],
    correctAnswer: 1, // 11
    explanation: "These are odd numbers increasing by +2 each time (1, 3, 5, 7, 9, 11).",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n3   6   9   12   15   ( ___ )",
    options: ["16", "17", "18", "19", "20"],
    correctAnswer: 2, // 18
    explanation: "Each number increases by +3 (3, 6, 9, 12, 15, 18). These are the 3 times table.",
    difficulty: 1,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n20   18   16   14   12   ( ___ )",
    options: ["11", "10", "9", "8", "7"],
    correctAnswer: 1, // 10
    explanation: "Each number decreases by -2 (20, 18, 16, 14, 12, 10). Count down by twos.",
    difficulty: 1,


  },
];

// Number Sequences questions for ages 7-8 (easy patterns - simple arithmetic)
const numberSequences7to8 = [
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n4   8   12   16   20   ( ___ )",
    options: ["22", "23", "24", "25", "26"],
    correctAnswer: 2, // 24
    explanation: "Each number increases by +4 (4, 8, 12, 16, 20, 24). These are the 4 times table.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   4   7   10   13   ( ___ )",
    options: ["14", "15", "16", "17", "18"],
    correctAnswer: 2, // 16
    explanation: "Each number increases by +3 (1, 4, 7, 10, 13, 16). Start at 1 and add 3 each time.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n50   45   40   35   30   ( ___ )",
    options: ["20", "22", "24", "25", "28"],
    correctAnswer: 3, // 25
    explanation: "Each number decreases by -5 (50, 45, 40, 35, 30, 25). Count back by fives.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n2   5   8   11   14   ( ___ )",
    options: ["15", "16", "17", "18", "19"],
    correctAnswer: 2, // 17
    explanation: "Each number increases by +3 (2, 5, 8, 11, 14, 17). Start at 2 and add 3 each time.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   4   9   16   25   ( ___ )",
    options: ["30", "32", "34", "36", "38"],
    correctAnswer: 3, // 36
    explanation: "These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, 6² = 36.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n2   4   8   16   32   ( ___ )",
    options: ["48", "52", "60", "64", "68"],
    correctAnswer: 3, // 64
    explanation: "Each number doubles (×2): 2, 4, 8, 16, 32, 64. Multiply by 2 each time.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n100   90   80   70   60   ( ___ )",
    options: ["55", "52", "51", "50", "48"],
    correctAnswer: 3, // 50
    explanation: "Each number decreases by -10 (100, 90, 80, 70, 60, 50). Count back by tens.",
    difficulty: 2,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n64   32   16   8   4   ( ___ )",
    options: ["1", "2", "3", "4", "5"],
    correctAnswer: 1, // 2
    explanation: "Each number is divided by 2 (÷2): 64, 32, 16, 8, 4, 2. Halve each time.",
    difficulty: 2,


  },
];

// Number Sequences questions for ages 8-9 (easier patterns)
const numberSequences8to9 = [
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   4   6   8   10   ( ___ )",
    options: ["11", "12", "13", "14", "15"],
    correctAnswer: 1, // 12
    explanation: "Each number increases by +2 (2, 4, 6, 8, 10, 12). The pattern is adding 2 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n5   10   15   20   25   ( ___ )",
    options: ["28", "29", "30", "31", "32"],
    correctAnswer: 2, // 30
    explanation: "Each number increases by +5 (5, 10, 15, 20, 25, 30). The pattern is adding 5 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   4   9   16   25   ( ___ )",
    options: ["30", "32", "34", "36", "38"],
    correctAnswer: 3, // 36
    explanation: "These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, 6² = 36.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n100   90   80   70   60   ( ___ )",
    options: ["55", "52", "51", "50", "48"],
    correctAnswer: 3, // 50
    explanation: "Each number decreases by -10 (100, 90, 80, 70, 60, 50). The pattern is subtracting 10 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   4   8   16   32   ( ___ )",
    options: ["48", "52", "60", "64", "68"],
    correctAnswer: 3, // 64
    explanation: "Each number doubles (×2): 2, 4, 8, 16, 32, 64. The pattern is multiplying by 2 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n3   6   9   12   15   ( ___ )",
    options: ["16", "17", "18", "19", "20"],
    correctAnswer: 2, // 18
    explanation: "Each number increases by +3 (3, 6, 9, 12, 15, 18). The pattern is adding 3 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n50   45   40   35   30   ( ___ )",
    options: ["20", "22", "24", "25", "28"],
    correctAnswer: 3, // 25
    explanation: "Each number decreases by -5 (50, 45, 40, 35, 30, 25). The pattern is subtracting 5 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   3   5   7   9   ( ___ )",
    options: ["10", "11", "12", "13", "14"],
    correctAnswer: 1, // 11
    explanation: "These are odd numbers increasing by +2 each time (1, 3, 5, 7, 9, 11).",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n10   20   30   40   50   ( ___ )",
    options: ["55", "58", "60", "65", "70"],
    correctAnswer: 2, // 60
    explanation: "Each number increases by +10 (10, 20, 30, 40, 50, 60). The pattern is adding 10 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   5   8   11   14   ( ___ )",
    options: ["15", "16", "17", "18", "19"],
    correctAnswer: 2, // 17
    explanation: "Each number increases by +3 (2, 5, 8, 11, 14, 17). The pattern is adding 3 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n64   32   16   8   4   ( ___ )",
    options: ["1", "2", "3", "4", "5"],
    correctAnswer: 1, // 2
    explanation: "Each number is divided by 2 (÷2): 64, 32, 16, 8, 4, 2. The pattern is dividing by 2 each time.",
    difficulty: 3,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   2   4   7   11   ( ___ )",
    options: ["14", "15", "16", "17", "18"],
    correctAnswer: 2, // 16
    explanation: "The differences increase by 1 each time: +1, +2, +3, +4, +5. So 11 + 5 = 16.",
    difficulty: 3,


  },
];

// Number Sequences questions for ages 9-10 (intermediate patterns)
const numberSequences9to10 = [
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n3   7   11   15   19   ( ___ )",
    options: ["21", "22", "23", "24", "25"],
    correctAnswer: 2, // 23
    explanation: "Each number increases by +4 (3, 7, 11, 15, 19, 23). The pattern is adding 4 each time.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   4   9   16   25   36   ( ___ )",
    options: ["42", "45", "48", "49", "50"],
    correctAnswer: 3, // 49
    explanation: "These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, 6² = 36, 7² = 49.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n5   10   20   40   80   ( ___ )",
    options: ["120", "140", "150", "160", "180"],
    correctAnswer: 3, // 160
    explanation: "Each number doubles (×2): 5, 10, 20, 40, 80, 160. The pattern is multiplying by 2 each time.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   3   6   10   15   ( ___ )",
    options: ["18", "19", "20", "21", "22"],
    correctAnswer: 3, // 21
    explanation: "These are triangular numbers. The differences increase by 1: +2, +3, +4, +5, +6. So 15 + 6 = 21.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n3   6   12   24   48   ( ___ )",
    options: ["72", "84", "90", "96", "100"],
    correctAnswer: 3, // 96
    explanation: "Each number doubles (×2): 3, 6, 12, 24, 48, 96. The pattern is multiplying by 2 each time.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n1   2   4   7   11   16   ( ___ )",
    options: ["20", "21", "22", "23", "24"],
    correctAnswer: 2, // 22
    explanation: "The differences increase by 1 each time: +1, +2, +3, +4, +5, +6. So 16 + 6 = 22.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n80   40   20   10   5   ( ___ )",
    options: ["2", "2.5", "3", "4", "5"],
    correctAnswer: 1, // 2.5
    explanation: "Each number is divided by 2 (÷2): 80, 40, 20, 10, 5, 2.5. The pattern is halving each time.",
    difficulty: 4,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\\n\\n2   6   18   54   162   ( ___ )",
    options: ["324", "405", "486", "540", "648"],
    correctAnswer: 2, // 486
    explanation: "Each number is multiplied by 3 (×3): 2, 6, 18, 54, 162, 486. The pattern is multiplying by 3 each time.",
    difficulty: 4,


  },
];

// Number Sequences questions for ages 10-11 (harder patterns)
const numberSequences10to11 = [
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   8   27   64   125   ( ___ )",
    options: ["180", "196", "200", "216", "225"],
    correctAnswer: 3, // 216
    explanation: "These are cube numbers: 1³ = 1, 2³ = 8, 3³ = 27, 4³ = 64, 5³ = 125, 6³ = 216.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   3   5   8   13   ( ___ )",
    options: ["18", "19", "20", "21", "22"],
    correctAnswer: 3, // 21
    explanation: "Each number is the sum of the previous two numbers (Fibonacci-like): 2, 3, 5 (2+3), 8 (3+5), 13 (5+8), 21 (8+13).",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n3   6   12   24   48   ( ___ )",
    options: ["72", "84", "90", "96", "100"],
    correctAnswer: 3, // 96
    explanation: "Each number doubles (×2): 3, 6, 12, 24, 48, 96. The pattern is multiplying by 2 each time.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   3   5   7   11   ( ___ )",
    options: ["12", "13", "14", "15", "16"],
    correctAnswer: 1, // 13
    explanation: "These are prime numbers: 2, 3, 5, 7, 11, 13. Each number is a prime number in ascending order.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   4   9   16   25   36   ( ___ )",
    options: ["42", "45", "48", "49", "50"],
    correctAnswer: 3, // 49
    explanation: "These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25, 6² = 36, 7² = 49.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n3   7   15   31   63   ( ___ )",
    options: ["95", "115", "120", "127", "135"],
    correctAnswer: 3, // 127
    explanation: "Each number doubles and adds 1: 3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63, 63×2+1=127.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n100   50   25   12.5   6.25   ( ___ )",
    options: ["2.125", "3.000", "3.125", "3.250", "4.000"],
    correctAnswer: 2, // 3.125
    explanation: "Each number is divided by 2 (÷2): 100, 50, 25, 12.5, 6.25, 3.125. The pattern is dividing by 2 each time.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n2   6   12   20   30   ( ___ )",
    options: ["38", "40", "42", "44", "46"],
    correctAnswer: 2, // 42
    explanation: "The differences are consecutive even numbers: +4, +6, +8, +10, +12. So 30 + 12 = 42.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   1   2   3   5   8   ( ___ )",
    options: ["11", "12", "13", "14", "15"],
    correctAnswer: 2, // 13
    explanation: "This is the Fibonacci sequence: each number is the sum of the previous two (1+1=2, 1+2=3, 2+3=5, 3+5=8, 5+8=13).",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n5   10   20   40   80   ( ___ )",
    options: ["120", "140", "150", "160", "180"],
    correctAnswer: 3, // 160
    explanation: "Each number doubles (×2): 5, 10, 20, 40, 80, 160. The pattern is multiplying by 2 each time.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n81   27   9   3   1   ( ___ )",
    options: ["0", "0.333", "0.5", "1", "2"],
    correctAnswer: 1, // 0.333 (1/3)
    explanation: "Each number is divided by 3 (÷3): 81, 27, 9, 3, 1, 0.333... The pattern is dividing by 3 each time.",
    difficulty: 5,


  },
  {
    questionText: "Find the number that continues each sequence in the best way.\n\n1   3   6   10   15   ( ___ )",
    options: ["18", "19", "20", "21", "22"],
    correctAnswer: 3, // 21
    explanation: "These are triangular numbers. The differences increase by 1: +2, +3, +4, +5, +6. So 15 + 6 = 21.",
    difficulty: 5,


  },
];

// Insert 6-7 questions
for (const q of numberSequences6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "number_sequences", "patterns"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "number_sequences",
    },
  });
}

console.log(`✅ Added ${numberSequences6to7.length} Number Sequences questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of numberSequences7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "number_sequences", "patterns"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "number_sequences",
    },
  });
}

console.log(`✅ Added ${numberSequences7to8.length} Number Sequences questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of numberSequences8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "number_sequences", "patterns"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "number_sequences",
    },
  });
}

console.log(`✅ Added ${numberSequences8to9.length} Number Sequences questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of numberSequences9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "number_sequences", "patterns"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "number_sequences",
    },
  });
}

console.log(`✅ Added ${numberSequences9to10.length} Number Sequences questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of numberSequences10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "number_sequences", "patterns"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "number_sequences",
    },
  });
}

console.log(`✅ Added ${numberSequences10to11.length} Number Sequences questions (ages 10-11)`);
console.log(`\n🎉 Total: ${numberSequences6to7.length + numberSequences7to8.length + numberSequences8to9.length + numberSequences9to10.length + numberSequences10to11.length} questions added!`);

await prisma.$disconnect();
