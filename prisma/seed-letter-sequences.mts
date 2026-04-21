import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Letter Sequences questions...\n");

// Letter Sequences questions for ages 6-7 (very easy - simple +1, +2 patterns)
const letterSequences6to7 = [
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAB  BC  CD  DE  EF  ( ___ )",
    options: ["FG", "GH", "EG", "FH", "GF"],
    correctAnswer: 0, // FG
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters also increase by +1 each time (B, C, D, E, F, G). So the answer is FG.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAC  BD  CE  DF  EG  ( ___ )",
    options: ["FH", "GH", "FI", "GI", "EH"],
    correctAnswer: 0, // FH
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters also increase by +1 each time (C, D, E, F, G, H). So the answer is FH.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAA  BB  CC  DD  EE  ( ___ )",
    options: ["FF", "GG", "EF", "FE", "FG"],
    correctAnswer: 0, // FF
    explanation: "Each pair has the same letter repeated. The letters increase by +1 each time (A, B, C, D, E, F). So the answer is FF.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAC  CE  EG  GI  IK  ( ___ )",
    options: ["KM", "LN", "JL", "KL", "LM"],
    correctAnswer: 0, // KM
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters also increase by +2 each time (C, E, G, I, K, M). So the answer is KM.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBD  DF  FH  HJ  JL  ( ___ )",
    options: ["LN", "MN", "KM", "LM", "MO"],
    correctAnswer: 0, // LN
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (D, F, H, J, L, N). So the answer is LN.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBA  CB  DC  ED  FE  ( ___ )",
    options: ["GF", "HG", "FG", "GE", "HF"],
    correctAnswer: 0, // GF
    explanation: "The first letters increase by +1 each time (B, C, D, E, F, G). The second letters also increase by +1 each time (A, B, C, D, E, F). So the answer is GF.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nCA  DB  EC  FD  GE  ( ___ )",
    options: ["HF", "IG", "GF", "HE", "IF"],
    correctAnswer: 0, // HF
    explanation: "The first letters increase by +1 each time (C, D, E, F, G, H). The second letters also increase by +1 each time (A, B, C, D, E, F). So the answer is HF.",
    difficulty: 1,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAB  CD  EF  GH  IJ  ( ___ )",
    options: ["KL", "JK", "LM", "KM", "MN"],
    correctAnswer: 0, // KL
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters also increase by +2 each time (B, D, F, H, J, L). So the answer is KL.",
    difficulty: 1,


  },
];

// Letter Sequences questions for ages 7-8 (easy - +2, +3 patterns with mixed operations)
const letterSequences7to8 = [
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAD  BE  CF  DG  EH  ( ___ )",
    options: ["FI", "GH", "FJ", "EI", "GI"],
    correctAnswer: 0, // FI
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters also increase by +1 each time (D, E, F, G, H, I). So the answer is FI.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nCA  EB  GC  ID  KE  ( ___ )",
    options: ["MF", "LF", "ME", "KF", "LG"],
    correctAnswer: 0, // MF
    explanation: "The first letters increase by +2 each time (C, E, G, I, K, M). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is MF.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nDA  FB  HC  JD  LE  ( ___ )",
    options: ["NF", "MF", "NG", "ME", "OF"],
    correctAnswer: 0, // NF
    explanation: "The first letters increase by +2 each time (D, F, H, J, L, N). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is NF.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAZ  BY  CX  DW  EV  ( ___ )",
    options: ["FU", "EW", "FV", "GU", "EU"],
    correctAnswer: 0, // FU
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters decrease by -1 each time (Z, Y, X, W, V, U). So the answer is FU.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAE  BG  CI  DK  EM  ( ___ )",
    options: ["FO", "GO", "FN", "GP", "EN"],
    correctAnswer: 0, // FO
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters increase by +2 each time (E, G, I, K, M, O). So the answer is FO.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBE  DG  FI  HK  JM  ( ___ )",
    options: ["LO", "MO", "LN", "KN", "MN"],
    correctAnswer: 0, // LO
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (E, G, I, K, M, O). So the answer is LO.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZA  YB  XC  WD  VE  ( ___ )",
    options: ["UF", "VF", "TF", "UG", "TG"],
    correctAnswer: 0, // UF
    explanation: "The first letters decrease by -1 each time (Z, Y, X, W, V, U). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is UF.",
    difficulty: 2,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBA  DC  FE  HG  JI  ( ___ )",
    options: ["LK", "KL", "MN", "JK", "KJ"],
    correctAnswer: 0, // LK
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (A, C, E, G, I, K). So the answer is LK.",
    difficulty: 2,


  },
];

// Letter Sequences questions for ages 9-10 (intermediate - +3, +4 patterns with reverse sequences)
const letterSequences9to10 = [
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBD  EG  HJ  KM  NP  ( ___ )",
    options: ["QS", "RS", "QT", "PS", "RT"],
    correctAnswer: 0, // QS
    explanation: "The first letters increase by +3 each time (B, E, H, K, N, Q). The second letters also increase by +3 each time (D, G, J, M, P, S). So the answer is QS.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAC  DF  GI  JL  MO  ( ___ )",
    options: ["PR", "QR", "PS", "OR", "QS"],
    correctAnswer: 0, // PR
    explanation: "The first letters increase by +3 each time (A, D, G, J, M, P). The second letters also increase by +3 each time (C, F, I, L, O, R). So the answer is PR.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nMA  KB  IC  GD  EE  ( ___ )",
    options: ["CF", "DF", "CE", "BF", "CG"],
    correctAnswer: 0, // CF
    explanation: "The first letters decrease by -2 each time (M, K, I, G, E, C). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is CF.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nCA  FD  IG  LJ  OM  ( ___ )",
    options: ["RP", "SP", "RQ", "SQ", "RO"],
    correctAnswer: 0, // RP
    explanation: "The first letters increase by +3 each time (C, F, I, L, O, R). The second letters also increase by +3 each time (A, D, G, J, M, P). So the answer is RP.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZX  WU  TR  QO  NL  ( ___ )",
    options: ["KI", "JI", "KH", "LI", "JH"],
    correctAnswer: 0, // KI
    explanation: "The first letters decrease by -3 each time (Z, W, T, Q, N, K). The second letters also decrease by -3 each time (X, U, R, O, L, I). So the answer is KI.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBZ  DX  FV  HT  JR  ( ___ )",
    options: ["LP", "KP", "LQ", "KQ", "LO"],
    correctAnswer: 0, // LP
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters decrease by -2 each time (Z, X, V, T, R, P). So the answer is LP.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAF  CG  EH  GI  IJ  ( ___ )",
    options: ["KK", "JK", "KL", "LL", "JL"],
    correctAnswer: 0, // KK
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters increase by +1 each time (F, G, H, I, J, K). So the answer is KK.",
    difficulty: 4,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZA  XC  VE  TG  RI  ( ___ )",
    options: ["PK", "OK", "PL", "QK", "OL"],
    correctAnswer: 0, // PK
    explanation: "The first letters decrease by -2 each time (Z, X, V, T, R, P). The second letters increase by +2 each time (A, C, E, G, I, K). So the answer is PK.",
    difficulty: 4,


  },
];

// First delete all existing letter_sequences questions
console.log("Deleting existing letter_sequences questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "letter_sequences" },
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
  console.log("No existing letter_sequences questions to delete\n");
}

// Letter Sequences questions for ages 8-9 (easier patterns)
const letterSequences8to9 = [
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAC  CE  EG  GI  IK  ( ___ )",
    options: ["KM", "LN", "MO", "JL", "KL"],
    correctAnswer: 0, // KM
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters also increase by +2 each time (C, E, G, I, K, M). So the answer is KM.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBA  DC  FE  HG  JI  ( ___ )",
    options: ["LK", "KL", "MN", "JK", "KJ"],
    correctAnswer: 0, // LK
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (A, C, E, G, I, K). So the answer is LK.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAD  BE  CF  DG  EH  ( ___ )",
    options: ["FI", "GH", "FJ", "EI", "GI"],
    correctAnswer: 0, // FI
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters also increase by +1 each time (D, E, F, G, H, I). So the answer is FI.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAZ  BY  CX  DW  EV  ( ___ )",
    options: ["FU", "EW", "FV", "GU", "EU"],
    correctAnswer: 0, // FU
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters decrease by -1 each time (Z, Y, X, W, V, U). So the answer is FU.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nCA  EB  GC  ID  KE  ( ___ )",
    options: ["MF", "LF", "ME", "KF", "LG"],
    correctAnswer: 0, // MF
    explanation: "The first letters increase by +2 each time (C, E, G, I, K, M). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is MF.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBD  DF  FH  HJ  JL  ( ___ )",
    options: ["LN", "MO", "KM", "LM", "MN"],
    correctAnswer: 0, // LN
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (D, F, H, J, L, N). So the answer is LN.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZA  YB  XC  WD  VE  ( ___ )",
    options: ["UF", "VF", "TF", "UG", "TG"],
    correctAnswer: 0, // UF
    explanation: "The first letters decrease by -1 each time (Z, Y, X, W, V, U). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is UF.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAB  CD  EF  GH  IJ  ( ___ )",
    options: ["KL", "JK", "LM", "MN", "KM"],
    correctAnswer: 0, // KL
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters also increase by +2 each time (B, D, F, H, J, L). So the answer is KL.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nDA  FB  HC  JD  LE  ( ___ )",
    options: ["NF", "MF", "NG", "ME", "OF"],
    correctAnswer: 0, // NF
    explanation: "The first letters increase by +2 each time (D, F, H, J, L, N). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is NF.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAE  BG  CI  DK  EM  ( ___ )",
    options: ["FO", "GO", "FN", "GP", "EN"],
    correctAnswer: 0, // FO
    explanation: "The first letters increase by +1 each time (A, B, C, D, E, F). The second letters increase by +2 each time (E, G, I, K, M, O). So the answer is FO.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nMA  KB  IC  GD  EE  ( ___ )",
    options: ["CF", "DF", "CE", "BF", "CG"],
    correctAnswer: 0, // CF
    explanation: "The first letters decrease by -2 each time (M, K, I, G, E, C). The second letters increase by +1 each time (A, B, C, D, E, F). So the answer is CF.",
    difficulty: 3,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBE  DG  FI  HK  JM  ( ___ )",
    options: ["LO", "MO", "LN", "KN", "MN"],
    correctAnswer: 0, // LO
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters also increase by +2 each time (E, G, I, K, M, O). So the answer is LO.",
    difficulty: 3,


  },
];

// Letter Sequences questions for ages 10-11 (harder patterns)
const letterSequences10to11 = [
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBD  EG  HJ  KM  NP  ( ___ )",
    options: ["QS", "RS", "QT", "PS", "RT"],
    correctAnswer: 0, // QS
    explanation: "The first letters increase by +3 each time (B, E, H, K, N, Q). The second letters also increase by +3 each time (D, G, J, M, P, S). So the answer is QS.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZX  WU  TR  QO  NL  ( ___ )",
    options: ["KI", "JI", "KH", "LI", "JH"],
    correctAnswer: 0, // KI
    explanation: "The first letters decrease by -3 each time (Z, W, T, Q, N, K). The second letters also decrease by -3 each time (X, U, R, O, L, I). So the answer is KI.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAF  CG  EH  GI  IJ  ( ___ )",
    options: ["KK", "JK", "KL", "LL", "JL"],
    correctAnswer: 0, // KK
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters increase by +1 each time (F, G, H, I, J, K). So the answer is KK.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBZ  DX  FV  HT  JR  ( ___ )",
    options: ["LP", "KP", "LQ", "KQ", "LO"],
    correctAnswer: 0, // LP
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters decrease by -2 each time (Z, X, V, T, R, P). So the answer is LP.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAC  DF  GI  JL  MO  ( ___ )",
    options: ["PR", "QR", "PS", "OR", "QS"],
    correctAnswer: 0, // PR
    explanation: "The first letters increase by +3 each time (A, D, G, J, M, P). The second letters also increase by +3 each time (C, F, I, L, O, R). So the answer is PR.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nYB  VC  SD  PE  MF  ( ___ )",
    options: ["JG", "KG", "JH", "IG", "KH"],
    correctAnswer: 0, // JG
    explanation: "The first letters decrease by -3 each time (Y, V, S, P, M, J). The second letters increase by +1 each time (B, C, D, E, F, G). So the answer is JG.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nAD  CE  EF  GG  IH  ( ___ )",
    options: ["KI", "JI", "KJ", "JH", "LI"],
    correctAnswer: 0, // KI
    explanation: "The first letters increase by +2 each time (A, C, E, G, I, K). The second letters increase by +1 each time (D, E, F, G, H, I). So the answer is KI.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nCA  FD  IG  LJ  OM  ( ___ )",
    options: ["RP", "SP", "RQ", "SQ", "RO"],
    correctAnswer: 0, // RP
    explanation: "The first letters increase by +3 each time (C, F, I, L, O, R). The second letters also increase by +3 each time (A, D, G, J, M, P). So the answer is RP.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nXZ  UW  RT  OQ  LN  ( ___ )",
    options: ["IK", "JK", "IJ", "HK", "JL"],
    correctAnswer: 0, // IK
    explanation: "The first letters decrease by -3 each time (X, U, R, O, L, I). The second letters also decrease by -3 each time (Z, W, T, Q, N, K). So the answer is IK.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nBF  DI  FL  HO  JR  ( ___ )",
    options: ["LU", "KU", "LT", "MU", "KT"],
    correctAnswer: 0, // LU
    explanation: "The first letters increase by +2 each time (B, D, F, H, J, L). The second letters increase by +3 each time (F, I, L, O, R, U). So the answer is LU.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nZA  XC  VE  TG  RI  ( ___ )",
    options: ["PK", "OK", "PL", "QK", "OL"],
    correctAnswer: 0, // PK
    explanation: "The first letters decrease by -2 each time (Z, X, V, T, R, P). The second letters increase by +2 each time (A, C, E, G, I, K). So the answer is PK.",
    difficulty: 5,


  },
  {
    questionText: "Find the pair of letters that continues each sequence in the best way. Use the alphabet to help you.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nEA  HC  KE  NG  QI  ( ___ )",
    options: ["TK", "SK", "TL", "SL", "UK"],
    correctAnswer: 0, // TK
    explanation: "The first letters increase by +3 each time (E, H, K, N, Q, T). The second letters increase by +2 each time (A, C, E, G, I, K). So the answer is TK.",
    difficulty: 5,


  },
];

// Insert 6-7 questions
for (const q of letterSequences6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_sequences", "patterns"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "letter_sequences",
    },
  });
}

console.log(`✅ Added ${letterSequences6to7.length} Letter Sequences questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of letterSequences7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_sequences", "patterns"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "letter_sequences",
    },
  });
}

console.log(`✅ Added ${letterSequences7to8.length} Letter Sequences questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of letterSequences8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_sequences", "patterns"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "letter_sequences",
    },
  });
}

console.log(`✅ Added ${letterSequences8to9.length} Letter Sequences questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of letterSequences9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_sequences", "patterns"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "letter_sequences",
    },
  });
}

console.log(`✅ Added ${letterSequences9to10.length} Letter Sequences questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of letterSequences10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_sequences", "patterns"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "letter_sequences",
    },
  });
}

console.log(`✅ Added ${letterSequences10to11.length} Letter Sequences questions (ages 10-11)`);
console.log(`\n🎉 Total: ${letterSequences6to7.length + letterSequences7to8.length + letterSequences8to9.length + letterSequences9to10.length + letterSequences10to11.length} questions added!`);

await prisma.$disconnect();
