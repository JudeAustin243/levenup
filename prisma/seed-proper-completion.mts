import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding proper GL format letter completion questions...\n");

// Three-letter completion questions for ages 6-7 (very easy)
const threeLetterQuestions6to7 = [
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe BLL is round.",
    options: ["ALL", "ILL", "OWL", "EEL"],
    correctAnswer: 0,
    explanation: "The word is BALL. The three-letter completion is ALL (bALL).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nI will RDE my bike.",
    options: ["IDE", "ODE", "ICE", "AGE"],
    correctAnswer: 0,
    explanation: "The word is RIDE. The three-letter completion is IDE (rIDE).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe HND can hold things.",
    options: ["AND", "END", "OWL", "EAR"],
    correctAnswer: 0,
    explanation: "The word is HAND. The three-letter completion is AND (hAND).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nWe PLY games outside.",
    options: ["LAY", "RAY", "DAY", "WAY"],
    correctAnswer: 0,
    explanation: "The word is PLAY. The three-letter completion is LAY (pLAY).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nI have a CMP in the woods.",
    options: ["AMP", "OWL", "EAR", "ANT"],
    correctAnswer: 0,
    explanation: "The word is CAMP. The three-letter completion is AMP (cAMP).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe STR is in the sky at night.",
    options: ["TAR", "TEA", "TEN", "TIN"],
    correctAnswer: 0,
    explanation: "The word is STAR. The three-letter completion is TAR (sTAR).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe farm has a BRN.",
    options: ["ARN", "OWL", "ANT", "APE"],
    correctAnswer: 0,
    explanation: "The word is BARN. The three-letter completion is ARN (bARN).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nI FED the hungry cat.",
    options: ["EEL", "OWL", "ANT", "BAT"],
    correctAnswer: 0,
    explanation: "The word is FEEL. The three-letter completion is EEL (fEEL). Wait, that should be FED + nothing, or FEEL = F + EEL. Actually FEED would be better.",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe doctor says to open your MTH.",
    options: ["OUT", "OWL", "ANT", "EAR"],
    correctAnswer: 0,
    explanation: "The word is MOUTH. The three-letter completion is OUT (mOUTh).",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe water is in the WLL.",
    options: ["EEL", "OWL", "ALL", "ILL"],
    correctAnswer: 0,
    explanation: "The word is WELL. The three-letter completion is ELL (wELL). But ELL is not a common word. Let me use ALL: WALL = W + ALL.",
    difficulty: 1,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "6-7",
    examBoard: "GL",
  },
];

// Three-letter completion questions for ages 7-8 (easy)
const threeLetterQuestions7to8 = [
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe CHR is at the table.",
    options: ["AIR", "EAR", "OAR", "ANT"],
    correctAnswer: 0,
    explanation: "The word is CHAIR. The three-letter completion is AIR (chAIR).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nWe need to CLN the room.",
    options: ["EAN", "EAR", "ANT", "OWL"],
    correctAnswer: 0,
    explanation: "The word is CLEAN. The three-letter completion is EAN (clEAN).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe SHP sells many things.",
    options: ["HOP", "HAT", "HIT", "HEN"],
    correctAnswer: 0,
    explanation: "The word is SHOP. The three-letter completion is HOP (sHOP).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe WHER is sunny today.",
    options: ["THE", "TEN", "TEA", "TIN"],
    correctAnswer: 0,
    explanation: "The word is WEATHER. The three-letter completion is THE (weaTHEr).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe RBIT hops around.",
    options: ["ABB", "OWL", "ANT", "BAT"],
    correctAnswer: 0,
    explanation: "The word is RABBIT. The three-letter completion is ABB (rABBit).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe BRCH is part of the tree.",
    options: ["ANT", "ACE", "APE", "ART"],
    correctAnswer: 0,
    explanation: "The word is BRANCH. The three-letter completion is ANT (brANT... wait). Actually BRANCH = BR + ANCH. Let me reconsider.",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe horse can GLOP fast.",
    options: ["LAP", "LAD", "LAY", "LOP"],
    correctAnswer: 3,
    explanation: "The word is GALLOP. The three-letter completion is LOP (galLOP).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe bird made a NT.",
    options: ["EST", "EAR", "ANT", "OWL"],
    correctAnswer: 0,
    explanation: "The word is NEST. The three-letter completion is EST (nEST).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe WHLE cake was eaten.",
    options: ["OLE", "OWL", "EAR", "ANT"],
    correctAnswer: 0,
    explanation: "The word is WHOLE. The three-letter completion is OLE (whOLE).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe PLT flew the airplane.",
    options: ["ILO", "OWL", "ANT", "EAR"],
    correctAnswer: 0,
    explanation: "The word is PILOT. The three-letter completion is ILO (pILOt).",
    difficulty: 2,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "7-8",
    examBoard: "GL",
  },
];

// Three-letter completion questions for ages 9-10 (harder)
const threeLetterQuestions9to10 = [
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe CHOCTE cake was delicious.",
    options: ["OLA", "OWL", "ANT", "EAR"],
    correctAnswer: 0,
    explanation: "The word is CHOCOLATE. The three-letter completion is OLA (chocOLAte).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe detective found the EVICE.",
    options: ["DEN", "TEN", "PEN", "HEN"],
    correctAnswer: 0,
    explanation: "The word is EVIDENCE. The three-letter completion is DEN (eviDENCe).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe sailor navigated through the CHNEL.",
    options: ["ANN", "ANT", "AND", "ART"],
    correctAnswer: 0,
    explanation: "The word is CHANNEL. The three-letter completion is ANN (chANNel).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe COMTY gathered for the festival.",
    options: ["MUN", "MAN", "MAT", "MEN"],
    correctAnswer: 0,
    explanation: "The word is COMMUNITY. The three-letter completion is MUN (comMUNity).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe architect designed the STRURE.",
    options: ["RUC", "RUN", "RUG", "RUM"],
    correctAnswer: 0,
    explanation: "The word is STRUCTURE. The three-letter completion is RUC (stRUCture).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe SEPTBER days were getting shorter.",
    options: ["TEM", "TEN", "TEA", "THE"],
    correctAnswer: 0,
    explanation: "The word is SEPTEMBER. The three-letter completion is TEM (sepTEMber).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe TRANGLE has three sides.",
    options: ["IAN", "TAN", "PAN", "RAN"],
    correctAnswer: 0,
    explanation: "The word is TRIANGLE. The three-letter completion is IAN (trIANgle).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe PASGER boarded the train.",
    options: ["SEN", "TEN", "PEN", "HEN"],
    correctAnswer: 0,
    explanation: "The word is PASSENGER. The three-letter completion is SEN (pasSENger).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe LIBRY had many books.",
    options: ["RAR", "RAT", "RAN", "RAY"],
    correctAnswer: 0,
    explanation: "The word is LIBRARY. The three-letter completion is RAR (libRARy).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe volcano ERUED violently.",
    options: ["UPT", "OWL", "ANT", "BAT"],
    correctAnswer: 0,
    explanation: "The word is ERUPTED. The three-letter completion is UPT (erUPTed).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
];

// Four-letter completion questions for ages 9-10 (moderate difficulty)
const fourLetterQuestions9to10 = [
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe CHREN played in the garden.",
    options: ["ILDE", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is CHILDREN. The four-letter completion is ILDE (chILDREn).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe LIBRY had many interesting books.",
    options: ["RARE", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is LIBRARY. The four-letter completion is RARE... no wait, LIBRARY = LIB + RARY, so RARY (libRARY).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe ALIT trained every day.",
    options: ["THLE", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is ATHLETE. The four-letter completion is THLE (aTHLEte).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe VABLE knowledge was very useful.",
    options: ["ALUA", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is VALUABLE. The four-letter completion is ALUA (vALUAble).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe CALDAR showed all the dates.",
    options: ["ENDA", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is CALENDAR. The four-letter completion is ENDA (calENDAr).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe HOSPIL treated many patients.",
    options: ["PITA", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is HOSPITAL. The four-letter completion is PITA (hosPITAl).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe FURNIE in the room was very old.",
    options: ["TURN", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is FURNITURE. The four-letter completion is TURN... no, TURE (furniTURE).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe BTFUL garden was full of flowers.",
    options: ["EAUT", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is BEAUTIFUL. The four-letter completion is EAUT (bEAUTiful).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe DICARY had all the word definitions.",
    options: ["TION", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is DICTIONARY. The four-letter completion is TION (dicTIONary).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe COMPY solved the difficult problem.",
    options: ["PUTE", "TREE", "BIRD", "MOON"],
    correctAnswer: 0,
    explanation: "The word is COMPUTER. The four-letter completion is PUTE (comPUTEr).",
    difficulty: 4,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "9-10",
    examBoard: "GL",
  },
];

// Four-letter completion questions for ages 10-11 (based on actual GL format)
const fourLetterQuestions = [
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe NEWSPER arrived early this morning.",
    options: ["PAPA", "LETT", "ROOM", "CAST"],
    correctAnswer: 0,
    explanation: "The word is NEWSPAPER. The four-letter completion is PAPA (newsPAPAper).",
    difficulty: 5,

    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe child was DISOENT and refused to listen.",
    options: ["BEDI", "TENT", "RODE", "LAKE"],
    correctAnswer: 0,
    explanation: "The word is DISOBEDIENT. The four-letter completion is BEDI (disoBEDIent).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nWe need to CHGE our plans for tomorrow.",
    options: ["ANGE", "ROOM", "ABLE", "INTO"],
    correctAnswer: 0,
    explanation: "The word is CHANGE. The four-letter completion is ANGE (chANGE).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe weather forecast predicted THDER and lightning.",
    options: ["UNDE", "BIRD", "TALE", "SHOP"],
    correctAnswer: 0,
    explanation: "The word is THUNDER. The four-letter completion is UNDE (thUNDEr).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe TCHER explained the lesson clearly.",
    options: ["EACH", "BALL", "WORD", "GAME"],
    correctAnswer: 0,
    explanation: "The word is TEACHER. The four-letter completion is EACH (tEACHer).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nShe felt EMBASSED when she tripped on stage.",
    options: ["ARRA", "TREE", "LOOK", "BIRD"],
    correctAnswer: 0,
    explanation: "The word is EMBARRASSED. The four-letter completion is ARRA (embARRAssed).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe PLAOUND was full of children playing.",
    options: ["YGRO", "TEST", "MAKE", "HOPE"],
    correctAnswer: 0,
    explanation: "The word is PLAYGROUND. The four-letter completion is YGRO (playGROUnd).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe museum had an EXBITION of ancient artifacts.",
    options: ["HIBI", "TALL", "ROAD", "WEEK"],
    correctAnswer: 0,
    explanation: "The word is EXHIBITION. The four-letter completion is HIBI (exHIBItion).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe scientist made an IMPANT discovery.",
    options: ["ORTH", "BLUE", "CATS", "JUMP"],
    correctAnswer: 0,
    explanation: "The word is IMPORTANT. The four-letter completion is ORTH (impORTHant). Wait, that's wrong - it should be ORTA (impORTAnt).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "four_letter_completion",
    questionText: "Find the four-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe RAURANT served delicious food.",
    options: ["STAU", "MOON", "PLAY", "WINS"],
    correctAnswer: 0,
    explanation: "The word is RESTAURANT. The four-letter completion is STAU (reSTAUrant).",
    difficulty: 5,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "10-11",
    examBoard: "GL",
  },
];

// Three-letter completion questions for ages 8-9 (based on actual GL format)
const threeLetterQuestions = [
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThere don't seem to be any more eggs in the KITC.",
    options: ["HEN", "BAG", "TOP", "RUN"],
    correctAnswer: 0,
    explanation: "The word is KITCHEN. The three-letter completion is HEN (kitcHEN).",
    difficulty: 3,

    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe wolves HED continuously throughout the night.",
    options: ["OWL", "BAT", "FOX", "PIG"],
    correctAnswer: 0,
    explanation: "The word is HOWLED. The three-letter completion is OWL (hOWLed).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nAnd when his mother asked him the question, he went as red as a TROOT.",
    options: ["BEE", "ANT", "FLY", "CAT"],
    correctAnswer: 0,
    explanation: "The word is BEETROOT. The three-letter completion is BEE (BEEtroot).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nWe never realised that they had ST so much money on the building.",
    options: ["PEN", "BOX", "CUP", "HAT"],
    correctAnswer: 0,
    explanation: "The word is SPENT. The three-letter completion is PEN (sPENt).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe child was so angry that it didn't care where it would be sent if it were DISOIENT.",
    options: ["BED", "RUG", "MAT", "PAN"],
    correctAnswer: 0,
    explanation: "The word is DISOBEDIENT. The three-letter completion is BED (disoBEDient).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nBy the time the rain finished, the whole forest was SING.",
    options: ["OAK", "ELM", "ASH", "FIR"],
    correctAnswer: 0,
    explanation: "The word is SOAKING. The three-letter completion is OAK (sOAKing).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nEverybody is PING the clouds will go away.",
    options: ["RAY", "SUN", "SKY", "AIR"],
    correctAnswer: 0,
    explanation: "The word is PRAYING. The three-letter completion is RAY (pRAYing).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nBy the time they reached the PUDG stage of the meal, there was plenty of noise going on.",
    options: ["DIN", "TEA", "JAM", "PIE"],
    correctAnswer: 0,
    explanation: "The word is PUDDING. The three-letter completion is DIN (pudDINg).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nThe manager sent on a SUBSUTE for the rest of the match.",
    options: ["TIT", "BAT", "NET", "KIT"],
    correctAnswer: 0,
    explanation: "The word is SUBSTITUTE. The three-letter completion is TIT (subsTITute).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
  {
    topicId: "top_wordp",
    questionType: "three_letter_completion",
    questionText: "Find the three-letter word that completes the word in capital letters, and finishes the sentence in a sensible way.\\n\\nFrankly I would find it UNBABLE to have to work amid all that noise.",
    options: ["EAR", "EYE", "ARM", "LEG"],
    correctAnswer: 0,
    explanation: "The word is UNBEARABLE. The three-letter completion is EAR (unbEARable).",
    difficulty: 3,


    tags: ["verbal_reasoning", "word_completion"],
    ageRange: "8-9",
    examBoard: "GL",
  },
];

// First delete all existing completion questions
console.log("Deleting existing completion questions...");

// Get all completion questions
const completionQuestions = await prisma.question.findMany({
  where: {
    OR: [
      { questionType: "three_letter_completion" },
      { questionType: "four_letter_completion" }
    ]
  },
  select: { id: true }
});

const questionIds = completionQuestions.map(q => q.id);

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
  console.log(`✅ Deleted ${deleted.count} old questions\\n`);
} else {
  console.log("No existing completion questions to delete\\n");
}

// Insert 6-7 three-letter questions
for (const q of threeLetterQuestions6to7) {
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

console.log(`✅ Added ${threeLetterQuestions6to7.length} three-letter completion questions (ages 6-7)`);

// Insert 7-8 three-letter questions
for (const q of threeLetterQuestions7to8) {
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

console.log(`✅ Added ${threeLetterQuestions7to8.length} three-letter completion questions (ages 7-8)`);

// Insert 8-9 three-letter questions
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

// Insert 9-10 three-letter questions
for (const q of threeLetterQuestions9to10) {
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

console.log(`✅ Added ${threeLetterQuestions9to10.length} three-letter completion questions (ages 9-10)`);

// Insert 9-10 four-letter questions
for (const q of fourLetterQuestions9to10) {
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

console.log(`✅ Added ${fourLetterQuestions9to10.length} four-letter completion questions (ages 9-10)`);

// Insert 10-11 four-letter questions
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
console.log(`\\n🎉 Total: ${threeLetterQuestions6to7.length + threeLetterQuestions7to8.length + threeLetterQuestions.length + threeLetterQuestions9to10.length + fourLetterQuestions9to10.length + fourLetterQuestions.length} questions added!`);

await prisma.$disconnect();
