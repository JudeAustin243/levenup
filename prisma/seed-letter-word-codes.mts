import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Letter-Word Codes questions...\n");

// First delete all existing letter_word_codes questions
console.log("Deleting existing letter_word_codes questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "letter_word_codes" },
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
  console.log("No existing letter_word_codes questions to delete\n");
}

// Letter-Word Codes questions for ages 6-7 (very easy: simple +1 patterns)
const letterWordCodes6to7 = [
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for CAT is DBU, what is the code for DOG?",
    options: ["EPH", "DPH", "EOH", "EPI", "DPG"],
    correctAnswer: 0, // EPH
    explanation: "Each letter moves forward by +1 in the alphabet. C+1=D, A+1=B, T+1=U. So D+1=E, O+1=P, G+1=H. The answer is EPH.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BED is CFE, what is the code for BAG?",
    options: ["CBH", "CAH", "DBH", "CBG", "BBH"],
    correctAnswer: 0, // CBH
    explanation: "Each letter moves forward by +1 in the alphabet. B+1=C, E+1=F, D+1=E. So B+1=C, A+1=B, G+1=H. The answer is CBH.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for SUN is TVO, what is the code for FUN?",
    options: ["GVO", "FVO", "GUO", "GWO", "GVP"],
    correctAnswer: 0, // GVO
    explanation: "Each letter moves forward by +1 in the alphabet. S+1=T, U+1=V, N+1=O. So F+1=G, U+1=V, N+1=O. The answer is GVO.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BIG is CJH, what is the code for BAD?",
    options: ["CBE", "BBE", "CCE", "CAE", "CBD"],
    correctAnswer: 0, // CBE
    explanation: "Each letter moves forward by +1 in the alphabet. B+1=C, I+1=J, G+1=H. So B+1=C, A+1=B, D+1=E. The answer is CBE.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for HAT is IBU, what is the code for HOT?",
    options: ["IPU", "HPU", "IOU", "IPT", "IQU"],
    correctAnswer: 0, // IPU
    explanation: "Each letter moves forward by +1 in the alphabet. H+1=I, A+1=B, T+1=U. So H+1=I, O+1=P, T+1=U. The answer is IPU.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for PIG is QJH, what is the code for PEN?",
    options: ["QFO", "PFO", "QEO", "QFN", "RFO"],
    correctAnswer: 0, // QFO
    explanation: "Each letter moves forward by +1 in the alphabet. P+1=Q, I+1=J, G+1=H. So P+1=Q, E+1=F, N+1=O. The answer is QFO.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for RAN is SBO, what is the code for SAT?",
    options: ["TBU", "SBU", "TCU", "TAU", "TBT"],
    correctAnswer: 0, // TBU
    explanation: "Each letter moves forward by +1 in the alphabet. R+1=S, A+1=B, N+1=O. So S+1=T, A+1=B, T+1=U. The answer is TBU.",
    difficulty: 1,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for TOP is UPQ, what is the code for POT?",
    options: ["QPU", "PPU", "QOU", "QPT", "ROT"],
    correctAnswer: 0, // QPU
    explanation: "Each letter moves forward by +1 in the alphabet. T+1=U, O+1=P, P+1=Q. So P+1=Q, O+1=P, T+1=U. The answer is QPU.",
    difficulty: 1,


  },
];

// Letter-Word Codes questions for ages 7-8 (easy: +1 and +2 patterns)
const letterWordCodes7to8 = [
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for DAY is EBZ, what is the code for WEEK?",
    options: ["XFFL", "WFFL", "XEEL", "XFFK", "WEFL"],
    correctAnswer: 0, // XFFL
    explanation: "Each letter moves forward by +1 in the alphabet. D+1=E, A+1=B, Y+1=Z. So W+1=X, E+1=F, E+1=F, K+1=L. The answer is XFFL.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BOY is CPZ, what is the code for GIRL?",
    options: ["HJSM", "GJSM", "HISM", "HJSL", "GISM"],
    correctAnswer: 0, // HJSM
    explanation: "Each letter moves forward by +1 in the alphabet. B+1=C, O+1=P, Y+1=Z. So G+1=H, I+1=J, R+1=S, L+1=M. The answer is HJSM.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for SKY is UMA, what is the code for SEA?",
    options: ["UGC", "TGC", "UGB", "UHC", "TGB"],
    correctAnswer: 0, // UGC
    explanation: "Each letter moves forward by +2 in the alphabet. S+2=U, K+2=M, Y+2=A. So S+2=U, E+2=G, A+2=C. The answer is UGC.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BUS is DWU, what is the code for VAN?",
    options: ["XCP", "WCP", "XBP", "XCO", "WBP"],
    correctAnswer: 0, // XCP
    explanation: "Each letter moves forward by +2 in the alphabet. B+2=D, U+2=W, S+2=U. So V+2=X, A+2=C, N+2=P. The answer is XCP.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for HAND is IBOE, what is the code for FOOT?",
    options: ["GPPU", "FPPU", "GOPU", "GPPT", "FOPT"],
    correctAnswer: 0, // GPPU
    explanation: "Each letter moves forward by +1 in the alphabet. H+1=I, A+1=B, N+1=O, D+1=E. So F+1=G, O+1=P, O+1=P, T+1=U. The answer is GPPU.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for FISH is HKUJ, what is the code for BIRD?",
    options: ["DKTF", "CKTF", "DJTF", "DKTE", "CJTE"],
    correctAnswer: 0, // DKTF
    explanation: "Each letter moves forward by +2 in the alphabet. F+2=H, I+2=K, S+2=U, H+2=J. So B+2=D, I+2=K, R+2=T, D+2=F. The answer is DKTF.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for RAIN is SBJO, what is the code for SNOW?",
    options: ["TOPX", "SOPX", "TOPW", "TONX", "SOPW"],
    correctAnswer: 0, // TOPX
    explanation: "Each letter moves forward by +1 in the alphabet. R+1=S, A+1=B, I+1=J, N+1=O. So S+1=T, N+1=O, O+1=P, W+1=X. The answer is TOPX.",
    difficulty: 2,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for JUMP is LWOR, what is the code for SKIP?",
    options: ["UMKR", "TLKR", "UMJR", "UMKQ", "TLJR"],
    correctAnswer: 0, // UMKR
    explanation: "Each letter moves forward by +2 in the alphabet. J+2=L, U+2=W, M+2=O, P+2=R. So S+2=U, K+2=M, I+2=K, P+2=R. The answer is UMKR.",
    difficulty: 2,


  },
];

// Letter-Word Codes questions for ages 9-10 (intermediate: +2, +3, and mixed patterns)
const letterWordCodes9to10 = [
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for GAME is JDPH, what is the code for PLAY?",
    options: ["SODB", "SODG", "TNDB", "SODE", "TNDA"],
    correctAnswer: 0, // SODB
    explanation: "Each letter moves forward by +3 in the alphabet. G+3=J, A+3=D, M+3=P, E+3=H. So P+3=S, L+3=O, A+3=D, Y+3=B. The answer is SODB.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for FOOD is HQQF, what is the code for MEAL?",
    options: ["OGCN", "OGBN", "NHCN", "OGCM", "NHBN"],
    correctAnswer: 0, // OGCN
    explanation: "Each letter moves forward by +2 in the alphabet. F+2=H, O+2=Q, O+2=Q, D+2=F. So M+2=O, E+2=G, A+2=C, L+2=N. The answer is OGCN.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for TIME is WLPH, what is the code for HOUR?",
    options: ["KRXU", "JRXU", "KRWU", "KRXT", "JQXT"],
    correctAnswer: 0, // KRXU
    explanation: "Each letter moves forward by +3 in the alphabet. T+3=W, I+3=L, M+3=P, E+3=H. So H+3=K, O+3=R, U+3=X, R+3=U. The answer is KRXU.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BOOK is DQQM, what is the code for PAGE?",
    options: ["RCIG", "RCIF", "QCIG", "RCHG", "QBHG"],
    correctAnswer: 0, // RCIG
    explanation: "Each letter moves forward by +2 in the alphabet. B+2=D, O+2=Q, O+2=Q, K+2=M. So P+2=R, A+2=C, G+2=I, E+2=G. The answer is RCIG.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for WIND is ZLQG, what is the code for CALM?",
    options: ["FDOP", "FCOP", "FDOO", "FDNP", "ECON"],
    correctAnswer: 0, // FDOP
    explanation: "Each letter moves forward by +3 in the alphabet. W+3=Z, I+3=L, N+3=Q, D+3=G. So C+3=F, A+3=D, L+3=O, M+3=P. The answer is FDOP.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BEAR is DGCT, what is the code for WOLF?",
    options: ["YQNH", "YQMH", "XQNH", "YQNG", "XPNH"],
    correctAnswer: 0, // YQNH
    explanation: "Each letter moves forward by +2 in the alphabet. B+2=D, E+2=G, A+2=C, R+2=T. So W+2=Y, O+2=Q, L+2=N, F+2=H. The answer is YQNH.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for MOON is PRRQ, what is the code for STAR?",
    options: ["VWDU", "VWDT", "UWDU", "VVDU", "VWCU"],
    correctAnswer: 0, // VWDU
    explanation: "Each letter moves forward by +3 in the alphabet. M+3=P, O+3=R, O+3=R, N+3=Q. So S+3=V, T+3=W, A+3=D, R+3=U. The answer is VWDU.",
    difficulty: 4,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for KING is MKPI, what is the code for QUEEN?",
    options: ["SWGGP", "SWGGO", "RVGGP", "SWFGP", "SWGGQ"],
    correctAnswer: 0, // SWGGP
    explanation: "Each letter moves forward by +2 in the alphabet. K+2=M, I+2=K, N+2=P, G+2=I. So Q+2=S, U+2=W, E+2=G, E+2=G, N+2=P. The answer is SWGGP.",
    difficulty: 4,


  },
];

// Letter-Word Codes questions for ages 8-9 (easier patterns: +1, +2, +3)
const letterWordCodes8to9 = [
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for DOG is EPH, what is the code for CAT?",
    options: ["DBU", "CBT", "EBU", "DCU", "DBT"],
    correctAnswer: 0, // DBU
    explanation: "Each letter moves forward by +1 in the alphabet. D+1=E, O+1=P, G+1=H. So C+1=D, A+1=B, T+1=U. The answer is DBU.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BIG is CJH, what is the code for WIN?",
    options: ["XJO", "WJN", "XIO", "YJO", "WIO"],
    correctAnswer: 0, // XJO
    explanation: "Each letter moves forward by +1 in the alphabet. B+1=C, I+1=J, G+1=H. So W+1=X, I+1=J, N+1=O. The answer is XJO.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for PET is QFU, what is the code for MAP?",
    options: ["NBQ", "MCQ", "NAP", "MBQ", "NAQ"],
    correctAnswer: 0, // NBQ
    explanation: "Each letter moves forward by +1 in the alphabet. P+1=Q, E+1=F, T+1=U. So M+1=N, A+1=B, P+1=Q. The answer is NBQ.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for RED is SFE, what is the code for BLUE?",
    options: ["CMVF", "BMUF", "CNVF", "CMUF", "BNVF"],
    correctAnswer: 0, // CMVF
    explanation: "Each letter moves forward by +1 in the alphabet. R+1=S, E+1=F, D+1=E. So B+1=C, L+1=M, U+1=V, E+1=F. The answer is CMVF.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for SUN is UWP, what is the code for HOT?",
    options: ["JQV", "IPU", "JRW", "HPT", "IQV"],
    correctAnswer: 0, // JQV
    explanation: "Each letter moves forward by +2 in the alphabet. S+2=U, U+2=W, N+2=P. So H+2=J, O+2=Q, T+2=V. The answer is JQV.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for MAKE is OCMG, what is the code for TAKE?",
    options: ["VCMG", "VAMG", "VCMI", "UCMI", "VCME"],
    correctAnswer: 0, // VCMG
    explanation: "Each letter moves forward by +2 in the alphabet. M+2=O, A+2=C, K+2=M, E+2=G. So T+2=V, A+2=C, K+2=M, E+2=G. The answer is VCMG.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for COLD is DPME, what is the code for FISH?",
    options: ["EHRA", "GJTI", "FISI", "GJSI", "EHRI"],
    correctAnswer: 1, // GJTI
    explanation: "Each letter moves forward by +1 in the alphabet. C+1=D, O+1=P, L+1=M, D+1=E. So F+1=G, I+1=J, S+1=T, H+1=I. The answer is GJTI.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for FUN is HWP, what is the code for REAL?",
    options: ["TGCN", "SGCN", "TGBN", "TGCM", "SGBN"],
    correctAnswer: 0, // TGCN
    explanation: "Each letter moves forward by +2 in the alphabet. F+2=H, U+2=W, N+2=P. So R+2=T, E+2=G, A+2=C, L+2=N. The answer is TGCN.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BAT is EDW, what is the code for RUN?",
    options: ["UXQ", "TVP", "UWQ", "TWQ", "UVP"],
    correctAnswer: 0, // UXQ
    explanation: "Each letter moves forward by +3 in the alphabet. B+3=E, A+3=D, T+3=W. So R+3=U, U+3=X, N+3=Q. The answer is UXQ.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for HAT is KDW, what is the code for MAN?",
    options: ["PDQ", "PCN", "OAN", "PDN", "PCQ"],
    correctAnswer: 0, // PDQ
    explanation: "Each letter moves forward by +3 in the alphabet. H+3=K, A+3=D, T+3=W. So M+3=P, A+3=D, N+3=Q. The answer is PDQ.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for LEG is OHJ, what is the code for ARM?",
    options: ["DUP", "CTO", "DTP", "CUP", "DTO"],
    correctAnswer: 0, // DUP
    explanation: "Each letter moves forward by +3 in the alphabet. L+3=O, E+3=H, G+3=J. So A+3=D, R+3=U, M+3=P. The answer is DUP.",
    difficulty: 3,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for RAIN is TDKP, what is the code for SNOW?",
    options: ["UQPY", "UPQY", "TQPY", "UQPZ", "TPQY"],
    correctAnswer: 0, // UQPY
    explanation: "Each letter moves forward by +2 in the alphabet. R+2=T, A+2=C... wait A(1)+2=C(3) but code shows D(4). So A→D is +3. Let me recalculate: R(18)→T(20) is +2, A(1)→D(4) is +3, I(9)→K(11) is +2, N(14)→P(16) is +2. Pattern is +2, +3, +2, +2. That's inconsistent for age 8-9. Let me create a clean all +2 pattern: RAIN with +2 is TCKP. But that doesn't match. Let me just use verified clean questions only.",
    difficulty: 3,


  },
];

// Letter-Word Codes questions for ages 10-11 (harder patterns: +4, +5, and includes wrapping)
const letterWordCodes10to11 = [
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for PARK is SDUN, what is the code for TREE?",
    options: ["WUHH", "WUGG", "VUGG", "WUFF", "VUHH"],
    correctAnswer: 0, // WUHH
    explanation: "Each letter moves forward by +3 in the alphabet. P+3=S, A+3=D, R+3=U, K+3=N. So T+3=W, R+3=U, E+3=H, E+3=H. The answer is WUHH.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BLUE is EOXH, what is the code for PINK?",
    options: ["SLQN", "SMRN", "SLRN", "TMAN", "SMQN"],
    correctAnswer: 0, // SLQN
    explanation: "Each letter moves forward by +3 in the alphabet. B+3=E, L+3=O, U+3=X, E+3=H. So P+3=S, I+3=L, N+3=Q, K+3=N. The answer is SLQN.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for GOLD is KSPH, what is the code for STAR?",
    options: ["WXEV", "WYFV", "WXFV", "VXEV", "WXEW"],
    correctAnswer: 0, // WXEV
    explanation: "Each letter moves forward by +4 in the alphabet. G+4=K, O+4=S, L+4=P, D+4=H. So S+4=W, T+4=X, A+4=E, R+4=V. The answer is WXEV.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for SEND is XJSI, what is the code for CALL?",
    options: ["HFQQ", "HGQQ", "IFQQ", "HFPP", "HFRR"],
    correctAnswer: 0, // HFQQ
    explanation: "Each letter moves forward by +5 in the alphabet. S+5=X, E+5=J, N+5=S, D+5=I. So C+5=H, A+5=F, L+5=Q, L+5=Q. The answer is HFQQ.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for GIFT is LNKY, what is the code for WRAP?",
    options: ["BWFU", "BXFU", "CWFU", "BWEV", "CWEV"],
    correctAnswer: 0, // BWFU
    explanation: "Each letter moves forward by +5 in the alphabet. G+5=L, I+5=N, F+5=K, T+5=Y. So W+5=B (W is position 23, +5=28, wraps around: 28-26=2=B), R+5=W, A+5=F, P+5=U. The answer is BWFU.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for MINT is RNSY, what is the code for COIN?",
    options: ["HTNS", "HUNS", "HTMS", "GUMS", "HUMS"],
    correctAnswer: 0, // HTNS
    explanation: "Each letter moves forward by +5 in the alphabet. M+5=R, I+5=N, N+5=S, T+5=Y. So C+5=H, O+5=T, I+5=N, N+5=S. The answer is HTNS.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for PLAN is UQFS, what is the code for WORK?",
    options: ["BTWP", "CTWP", "BUWP", "CUWP", "BTWO"],
    correctAnswer: 0, // BTWP
    explanation: "Each letter moves forward by +5 in the alphabet. P+5=U, L+5=Q, A+5=F, N+5=S. So W+5=B (wraps around: W is 23, +5=28, 28-26=2=B), O+5=T, R+5=W, K+5=P. The answer is BTWP.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for BRICK is FVMGO, what is the code for STONE?",
    options: ["WXSRI", "WXSRH", "WXTRI", "VYTRI", "WXTRH"],
    correctAnswer: 0, // WXSRI
    explanation: "Each letter moves forward by +4 in the alphabet. B+4=F, R+4=V, I+4=M, C+4=G, K+4=O. So S+4=W, T+4=X, O+4=S, N+4=R, E+4=I. The answer is WXSRI.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for TIGER is YNLJW, what is the code for HORSE?",
    options: ["MTWXJ", "MTWYI", "MUWXJ", "NTWXJ", "MTWXK"],
    correctAnswer: 0, // MTWXJ
    explanation: "Each letter moves forward by +5 in the alphabet. T+5=Y, I+5=N, G+5=L, E+5=J, R+5=W. So H+5=M, O+5=T, R+5=W, S+5=X, E+5=J. The answer is MTWXJ.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for CHAIR is HMFNW, what is the code for TABLE?",
    options: ["YFGQJ", "YEGQJ", "YFGQI", "ZFGQJ", "YFHQJ"],
    correctAnswer: 0, // YFGQJ
    explanation: "Each letter moves forward by +5 in the alphabet. C+5=H, H+5=M, A+5=F, I+5=N, R+5=W. So T+5=Y, A+5=F, B+5=G, L+5=Q, E+5=J. The answer is YFGQJ.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for SLEEP is WPIIT, what is the code for DREAM?",
    options: ["HVIEQ", "HVIFQ", "GVIEQ", "HVJEQ", "GVIFQ"],
    correctAnswer: 0, // HVIEQ
    explanation: "Each letter moves forward by +4 in the alphabet. S+4=W, L+4=P, E+4=I, E+4=I, P+4=T. So D+4=H, R+4=V, E+4=I, A+4=E, M+4=Q. The answer is HVIEQ.",
    difficulty: 5,


  },
  {
    questionText: "Each question uses a different code. Use the alphabet to help you work out the answer to each question.\n\nA B C D E F G H I J K L M N O P Q R S T U V W X Y Z\n\nIf the code for LIGHT is PMLMY, what is the code for SOUND?",
    options: ["XTZSI", "XTZRH", "WTZSI", "XUZSI", "XTZRI"],
    correctAnswer: 0, // XTZSI
    explanation: "Each letter moves forward by +4 in the alphabet. L+4=P, I+4=M, G+4=K... wait G(7)+4=K(11) but code shows L(12). So G→L is +5, not +4. Let me recalculate: L(12)→P(16) is +4, I(9)→M(13) is +4, G(7)→L(12) is +5, H(8)→M(13) is +5, T(20)→Y(25) is +5. Pattern is +4, +4, +5, +5, +5. That's inconsistent. Let me create clean all +5 questions.",
    difficulty: 5,


  },
];

// Use only the first 11 questions from ages 8-9 (removing the last inconsistent one)
const letterWordCodes8to9Clean = letterWordCodes8to9.slice(0, 11);

// Use only the first 11 questions from ages 10-11 (removing the last inconsistent one)
const letterWordCodes10to11Clean = letterWordCodes10to11.slice(0, 11);

// Insert 6-7 questions
for (const q of letterWordCodes6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_word_codes", "patterns"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "letter_word_codes",
    },
  });
}

console.log(`✅ Added ${letterWordCodes6to7.length} Letter-Word Codes questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of letterWordCodes7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_word_codes", "patterns"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "letter_word_codes",
    },
  });
}

console.log(`✅ Added ${letterWordCodes7to8.length} Letter-Word Codes questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of letterWordCodes8to9Clean) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_word_codes", "alphabet_patterns"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "letter_word_codes",
    },
  });
}

console.log(`✅ Added ${letterWordCodes8to9Clean.length} Letter-Word Codes questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of letterWordCodes9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_word_codes", "patterns"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "letter_word_codes",
    },
  });
}

console.log(`✅ Added ${letterWordCodes9to10.length} Letter-Word Codes questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of letterWordCodes10to11Clean) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "letter_word_codes", "alphabet_patterns"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "letter_word_codes",
    },
  });
}

console.log(`✅ Added ${letterWordCodes10to11Clean.length} Letter-Word Codes questions (ages 10-11)`);
console.log(`\n🎉 Total: ${letterWordCodes6to7.length + letterWordCodes7to8.length + letterWordCodes8to9Clean.length + letterWordCodes9to10.length + letterWordCodes10to11Clean.length} questions added!`);

await prisma.$disconnect();
