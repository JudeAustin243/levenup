import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { seedGLVerbal } from "./seed-gl-verbal.mts";
import { seedGLVerbal89 } from "./seed-gl-verbal-8-9.mts";
import { seedGLVerbal910 } from "./seed-gl-verbal-9-10.mts";
import { seedGLVerbal78 } from "./seed-gl-verbal-7-8.mts";
import { seedGLVerbal67 } from "./seed-gl-verbal-6-7.mts";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });

// Dynamic import needed for Prisma 7 generated client with custom output
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const DIFFICULTY_MAP: Record<string, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
};

async function main() {
  // Clear tables in FK order
  await prisma.aIReport.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.hexagonProfile.deleteMany();
  await prisma.childTopicDifficulty.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.packPurchase.deleteMany();
  await prisma.ownedItem.deleteMany();
  await prisma.avatarItem.deleteMany();
  await prisma.child.deleteMany();
  await prisma.user.deleteMany();

  // ──── Subjects ────
  const maths = await prisma.subject.create({
    data: {
      id: "sub_maths",
      name: "Maths",
      slug: "maths",
      description: "Arithmetic, fractions, geometry, and word problems",
      icon: "M",
      colour: "#3B82F6",
    },
  });

  const english = await prisma.subject.create({
    data: {
      id: "sub_english",
      name: "English",
      slug: "english",
      description: "Comprehension, grammar, vocabulary, and spelling",
      icon: "E",
      colour: "#059669",
    },
  });

  const verbal = await prisma.subject.create({
    data: {
      id: "sub_verbal",
      name: "Verbal Reasoning",
      slug: "verbal-reasoning",
      description: "Analogies, codes, and word patterns",
      icon: "VR",
      colour: "#9333EA",
    },
  });

  const nonverbal = await prisma.subject.create({
    data: {
      id: "sub_nonverbal",
      name: "Non-Verbal Reasoning",
      slug: "non-verbal-reasoning",
      description: "Sequences, shapes, and spatial awareness",
      icon: "NV",
      colour: "#EA580C",
    },
  });

  // ──── Topics ────
  // Maths topics
  await prisma.topic.createMany({
    data: [
      { id: "top_arith", name: "Arithmetic", subjectId: maths.id, order: 1 },
      { id: "top_frac", name: "Fractions & Decimals", subjectId: maths.id, order: 2 },
      { id: "top_geom", name: "Geometry", subjectId: maths.id, order: 3 },
      { id: "top_word", name: "Word Problems", subjectId: maths.id, order: 4 },
    ],
  });

  // English topics
  await prisma.topic.createMany({
    data: [
      { id: "top_gram", name: "Grammar", subjectId: english.id, order: 1 },
      { id: "top_vocab", name: "Vocabulary", subjectId: english.id, order: 2 },
      { id: "top_spell", name: "Spelling", subjectId: english.id, order: 3 },
      { id: "top_comp", name: "Comprehension", subjectId: english.id, order: 4 },
    ],
  });

  // Verbal Reasoning topics
  await prisma.topic.createMany({
    data: [
      { id: "top_analog", name: "Analogies", subjectId: verbal.id, order: 1 },
      { id: "top_codes", name: "Codes & Ciphers", subjectId: verbal.id, order: 2 },
      { id: "top_wordp", name: "Word Patterns", subjectId: verbal.id, order: 3 },
    ],
  });

  // Non-Verbal Reasoning topics
  await prisma.topic.createMany({
    data: [
      { id: "top_numseq", name: "Number Sequences", subjectId: nonverbal.id, order: 1 },
      { id: "top_shapes", name: "Shape Patterns", subjectId: nonverbal.id, order: 2 },
      { id: "top_spatial", name: "Spatial Reasoning", subjectId: nonverbal.id, order: 3 },
    ],
  });

  // ──── Questions ────
  // Tag mapping for hexagon axes:
  // Mathematical Reasoning: word problems, geometry (reasoning-heavy)
  // Numerical Fluency: arithmetic, fractions (computation-heavy)
  // English: all English topics
  // Verbal Reasoning: all VR topics
  // Non-Verbal Reasoning: all NVR topics
  // Exam Technique: computed from speed/accuracy, not tagged

  const questions = [
    // ── Arithmetic ──
    { id: "q_a1", topicId: "top_arith", questionText: "What is 347 + 568?", options: ["815", "915", "905", "825"], correctAnswer: 1, explanation: "347 + 568 = 915. Add units (7+8=15, carry 1), tens (4+6+1=11, carry 1), hundreds (3+5+1=9).", difficulty: "easy", tags: ["numerical_fluency", "addition"] },
    { id: "q_a2", topicId: "top_arith", questionText: "What is 1,204 - 867?", options: ["337", "347", "437", "327"], correctAnswer: 0, explanation: "1,204 - 867 = 337. You need to borrow from the hundreds and thousands columns.", difficulty: "medium", tags: ["numerical_fluency", "subtraction"] },
    { id: "q_a3", topicId: "top_arith", questionText: "What is 36 x 24?", options: ["764", "864", "854", "964"], correctAnswer: 1, explanation: "36 x 24 = 36 x 20 + 36 x 4 = 720 + 144 = 864.", difficulty: "medium", tags: ["numerical_fluency", "multiplication"] },
    { id: "q_a4", topicId: "top_arith", questionText: "What is 1,536 \u00f7 8?", options: ["182", "192", "202", "172"], correctAnswer: 1, explanation: "1,536 \u00f7 8 = 192. 8 x 192 = 1,536.", difficulty: "medium", tags: ["numerical_fluency", "division"] },
    { id: "q_a5", topicId: "top_arith", questionText: "What is the value of 7\u00b2?", options: ["14", "42", "49", "56"], correctAnswer: 2, explanation: "7\u00b2 means 7 x 7 = 49.", difficulty: "easy", tags: ["numerical_fluency", "powers"] },

    // ── Fractions & Decimals ──
    { id: "q_f1", topicId: "top_frac", questionText: "What is 3/4 + 1/8?", options: ["4/8", "7/8", "4/12", "1"], correctAnswer: 1, explanation: "Convert 3/4 to 6/8, then 6/8 + 1/8 = 7/8.", difficulty: "medium", tags: ["numerical_fluency", "fractions"] },
    { id: "q_f2", topicId: "top_frac", questionText: "What is 2/3 of 45?", options: ["25", "30", "35", "15"], correctAnswer: 1, explanation: "2/3 of 45 = (45 \u00f7 3) x 2 = 15 x 2 = 30.", difficulty: "easy", tags: ["numerical_fluency", "fractions"] },
    { id: "q_f3", topicId: "top_frac", questionText: "Convert 0.375 to a fraction in its simplest form.", options: ["3/8", "375/100", "3/4", "37/100"], correctAnswer: 0, explanation: "0.375 = 375/1000 = 3/8 when simplified (divide both by 125).", difficulty: "hard", tags: ["numerical_fluency", "decimals"] },
    { id: "q_f4", topicId: "top_frac", questionText: "Which fraction is equivalent to 0.6?", options: ["1/6", "2/3", "3/5", "6/8"], correctAnswer: 2, explanation: "0.6 = 6/10 = 3/5 in simplest form.", difficulty: "easy", tags: ["numerical_fluency", "decimals"] },
    { id: "q_f5", topicId: "top_frac", questionText: "What is 5/6 - 1/3?", options: ["4/6", "1/2", "4/3", "2/3"], correctAnswer: 1, explanation: "Convert 1/3 to 2/6, then 5/6 - 2/6 = 3/6 = 1/2.", difficulty: "medium", tags: ["numerical_fluency", "fractions"] },

    // ── Geometry ──
    { id: "q_g1", topicId: "top_geom", questionText: "What is the area of a rectangle with length 12cm and width 8cm?", options: ["40 cm\u00b2", "96 cm\u00b2", "20 cm\u00b2", "80 cm\u00b2"], correctAnswer: 1, explanation: "Area = length x width = 12 x 8 = 96 cm\u00b2.", difficulty: "easy", tags: ["maths_reasoning", "area"] },
    { id: "q_g2", topicId: "top_geom", questionText: "How many degrees are there in a triangle?", options: ["90\u00b0", "180\u00b0", "270\u00b0", "360\u00b0"], correctAnswer: 1, explanation: "The angles in any triangle always add up to 180\u00b0.", difficulty: "easy", tags: ["maths_reasoning", "angles"] },
    { id: "q_g3", topicId: "top_geom", questionText: "What is the perimeter of a regular hexagon with sides of 5cm?", options: ["25 cm", "30 cm", "35 cm", "20 cm"], correctAnswer: 1, explanation: "A regular hexagon has 6 equal sides, so perimeter = 6 x 5 = 30 cm.", difficulty: "medium", tags: ["maths_reasoning", "perimeter"] },
    { id: "q_g4", topicId: "top_geom", questionText: "A circle has a radius of 7cm. What is its diameter?", options: ["3.5 cm", "7 cm", "14 cm", "21 cm"], correctAnswer: 2, explanation: "Diameter = 2 x radius = 2 x 7 = 14 cm.", difficulty: "easy", tags: ["maths_reasoning", "circles"] },
    { id: "q_g5", topicId: "top_geom", questionText: "What type of angle is 135\u00b0?", options: ["Acute", "Right", "Obtuse", "Reflex"], correctAnswer: 2, explanation: "An obtuse angle is between 90\u00b0 and 180\u00b0. 135\u00b0 falls in this range.", difficulty: "easy", tags: ["maths_reasoning", "angles"] },

    // ── Word Problems ──
    { id: "q_w1", topicId: "top_word", questionText: "A shop sells apples at 35p each. How much would 12 apples cost?", options: ["\u00a33.50", "\u00a34.20", "\u00a34.00", "\u00a33.70"], correctAnswer: 1, explanation: "12 x 35p = 420p = \u00a34.20.", difficulty: "easy", tags: ["maths_reasoning", "money"] },
    { id: "q_w2", topicId: "top_word", questionText: "A train leaves at 09:45 and arrives at 11:20. How long is the journey?", options: ["1 hour 25 mins", "1 hour 35 mins", "2 hours 25 mins", "1 hour 45 mins"], correctAnswer: 1, explanation: "09:45 to 10:45 = 1 hour, 10:45 to 11:20 = 35 mins. Total = 1 hour 35 minutes.", difficulty: "medium", tags: ["maths_reasoning", "time"] },
    { id: "q_w3", topicId: "top_word", questionText: "Sarah has \u00a320. She spends 3/5 of it. How much does she have left?", options: ["\u00a312", "\u00a38", "\u00a310", "\u00a35"], correctAnswer: 1, explanation: "3/5 of \u00a320 = \u00a312 spent. \u00a320 - \u00a312 = \u00a38 remaining.", difficulty: "medium", tags: ["maths_reasoning", "fractions", "money"] },
    { id: "q_w4", topicId: "top_word", questionText: "If 4 pencils cost \u00a31.80, how much do 7 pencils cost?", options: ["\u00a32.80", "\u00a33.15", "\u00a33.50", "\u00a32.45"], correctAnswer: 1, explanation: "One pencil costs \u00a31.80 \u00f7 4 = \u00a30.45. Seven pencils cost 7 x \u00a30.45 = \u00a33.15.", difficulty: "medium", tags: ["maths_reasoning", "ratio"] },
    { id: "q_w5", topicId: "top_word", questionText: "A rectangular garden is 15m long and 9m wide. What is the cost of fencing it at \u00a33 per metre?", options: ["\u00a372", "\u00a3135", "\u00a3144", "\u00a3108"], correctAnswer: 2, explanation: "Perimeter = 2 x (15 + 9) = 48m. Cost = 48 x \u00a33 = \u00a3144.", difficulty: "hard", tags: ["maths_reasoning", "perimeter", "money"] },

    // ── Grammar ──
    { id: "q_gr1", topicId: "top_gram", questionText: "Which word is an adjective in: 'The tall man walked quickly.'", options: ["The", "tall", "walked", "quickly"], correctAnswer: 1, explanation: "'Tall' is an adjective because it describes the noun 'man'.", difficulty: "easy", tags: ["english", "grammar", "adjectives"] },
    { id: "q_gr2", topicId: "top_gram", questionText: "Which sentence uses the correct form of 'their/there/they're'?", options: ["Their going to the park.", "There going to the park.", "They're going to the park.", "Theyre going to the park."], correctAnswer: 2, explanation: "'They're' is the contraction of 'they are', which is correct here.", difficulty: "easy", tags: ["english", "grammar", "homophones"] },
    { id: "q_gr3", topicId: "top_gram", questionText: "What is the past tense of 'swim'?", options: ["swimmed", "swam", "swum", "swimming"], correctAnswer: 1, explanation: "'Swam' is the simple past tense of 'swim'. 'Swum' is the past participle.", difficulty: "easy", tags: ["english", "grammar", "tenses"] },
    { id: "q_gr4", topicId: "top_gram", questionText: "Which word is an adverb? 'She sang beautifully at the concert.'", options: ["She", "sang", "beautifully", "concert"], correctAnswer: 2, explanation: "'Beautifully' is an adverb because it describes how she sang (the verb).", difficulty: "easy", tags: ["english", "grammar", "adverbs"] },
    { id: "q_gr5", topicId: "top_gram", questionText: "Choose the correct sentence:", options: ["Me and Tom went to school.", "Tom and me went to school.", "Tom and I went to school.", "I and Tom went to school."], correctAnswer: 2, explanation: "'Tom and I' is correct as the subject of the sentence.", difficulty: "medium", tags: ["english", "grammar", "pronouns"] },

    // ── Vocabulary ──
    { id: "q_v1", topicId: "top_vocab", questionText: "What does the word 'benevolent' mean?", options: ["Cruel", "Kind and generous", "Tired", "Confused"], correctAnswer: 1, explanation: "'Benevolent' means well-meaning, kind, and generous.", difficulty: "medium", tags: ["english", "vocabulary", "definitions"] },
    { id: "q_v2", topicId: "top_vocab", questionText: "Which word is a synonym for 'ancient'?", options: ["Modern", "Old", "Quick", "Heavy"], correctAnswer: 1, explanation: "'Ancient' and 'old' are synonyms, both meaning something from a long time ago.", difficulty: "easy", tags: ["english", "vocabulary", "synonyms"] },
    { id: "q_v3", topicId: "top_vocab", questionText: "What is the antonym of 'courageous'?", options: ["Brave", "Cowardly", "Strong", "Foolish"], correctAnswer: 1, explanation: "'Cowardly' is the opposite of 'courageous' (brave).", difficulty: "easy", tags: ["english", "vocabulary", "antonyms"] },
    { id: "q_v4", topicId: "top_vocab", questionText: "What does the prefix 'mis-' mean in 'misunderstand'?", options: ["Again", "Before", "Wrongly", "After"], correctAnswer: 2, explanation: "The prefix 'mis-' means wrongly or badly.", difficulty: "medium", tags: ["english", "vocabulary", "prefixes"] },
    { id: "q_v5", topicId: "top_vocab", questionText: "Choose the word that best completes: 'The _____ sunset painted the sky in shades of orange.'", options: ["magnificent", "horrible", "tiny", "loud"], correctAnswer: 0, explanation: "'Magnificent' best describes a beautiful sunset.", difficulty: "easy", tags: ["english", "vocabulary", "context"] },

    // ── Spelling ──
    { id: "q_s1", topicId: "top_spell", questionText: "Which word is spelled correctly?", options: ["neccessary", "necessary", "necesary", "neccesary"], correctAnswer: 1, explanation: "'Necessary' is the correct spelling. Remember: one C, two S's.", difficulty: "medium", tags: ["english", "spelling"] },
    { id: "q_s2", topicId: "top_spell", questionText: "Which word is spelled correctly?", options: ["seperate", "separete", "separate", "seperete"], correctAnswer: 2, explanation: "'Separate' is correct. A common trick: there's 'a rat' in separate.", difficulty: "medium", tags: ["english", "spelling"] },
    { id: "q_s3", topicId: "top_spell", questionText: "Which is the correct spelling?", options: ["definately", "definatly", "definitely", "definitly"], correctAnswer: 2, explanation: "'Definitely' is correct. It comes from 'definite' + 'ly'.", difficulty: "medium", tags: ["english", "spelling"] },
    { id: "q_s4", topicId: "top_spell", questionText: "Which word is spelled correctly?", options: ["occurence", "occurrence", "occurrance", "occurance"], correctAnswer: 1, explanation: "'Occurrence' is correct \u2014 double C, double R.", difficulty: "hard", tags: ["english", "spelling"] },
    { id: "q_s5", topicId: "top_spell", questionText: "Which word is spelled correctly?", options: ["accomodation", "accommodation", "acommodation", "acomodation"], correctAnswer: 1, explanation: "'Accommodation' is correct \u2014 double C, double M.", difficulty: "hard", tags: ["english", "spelling"] },

    // ── Comprehension ──
    { id: "q_c1", topicId: "top_comp", questionText: "In 'The fox crept silently through the undergrowth', what does 'crept' tell us?", options: ["Quickly and noisily", "Slowly and carefully", "Happily and freely", "Angrily and loudly"], correctAnswer: 1, explanation: "'Crept' suggests slow, careful, and stealthy movement.", difficulty: "easy", tags: ["english", "comprehension", "inference"] },
    { id: "q_c2", topicId: "top_comp", questionText: "'The classroom fell silent as the headteacher entered.' What does 'fell silent' mean?", options: ["People collapsed", "The room became quiet", "Something dropped", "People were sad"], correctAnswer: 1, explanation: "'Fell silent' is an expression meaning became quiet suddenly.", difficulty: "easy", tags: ["english", "comprehension", "idioms"] },
    { id: "q_c3", topicId: "top_comp", questionText: "What is the purpose of a persuasive text?", options: ["To entertain the reader", "To convince the reader of something", "To give instructions", "To describe a place"], correctAnswer: 1, explanation: "A persuasive text aims to convince the reader to agree with a particular viewpoint.", difficulty: "medium", tags: ["english", "comprehension", "text_types"] },
    { id: "q_c4", topicId: "top_comp", questionText: "'He had butterflies in his stomach.' This is an example of:", options: ["A simile", "An idiom", "Alliteration", "A metaphor"], correctAnswer: 1, explanation: "This is an idiom \u2014 a common expression meaning feeling nervous.", difficulty: "medium", tags: ["english", "comprehension", "literary_devices"] },
    { id: "q_c5", topicId: "top_comp", questionText: "'The wind howled through the trees.' What technique is being used?", options: ["Simile", "Personification", "Alliteration", "Rhyme"], correctAnswer: 1, explanation: "This is personification \u2014 giving human qualities to something non-human.", difficulty: "medium", tags: ["english", "comprehension", "literary_devices"] },

    // ── Analogies ──
    { id: "q_an1", topicId: "top_analog", questionText: "Hot is to cold as tall is to ____", options: ["high", "short", "long", "big"], correctAnswer: 1, explanation: "Hot and cold are opposites, so the answer is the opposite of tall: short.", difficulty: "easy", tags: ["verbal_reasoning", "analogies", "opposites"] },
    { id: "q_an2", topicId: "top_analog", questionText: "Bird is to nest as bear is to ____", options: ["cave", "forest", "den", "tree"], correctAnswer: 2, explanation: "A bird lives in a nest, and a bear lives in a den.", difficulty: "easy", tags: ["verbal_reasoning", "analogies", "associations"] },
    { id: "q_an3", topicId: "top_analog", questionText: "Pen is to write as knife is to ____", options: ["sharp", "cut", "kitchen", "metal"], correctAnswer: 1, explanation: "A pen is used to write, and a knife is used to cut.", difficulty: "easy", tags: ["verbal_reasoning", "analogies", "function"] },
    { id: "q_an4", topicId: "top_analog", questionText: "Chapter is to book as scene is to ____", options: ["stage", "play", "actor", "theatre"], correctAnswer: 1, explanation: "A chapter is a part of a book, and a scene is a part of a play.", difficulty: "medium", tags: ["verbal_reasoning", "analogies", "part_whole"] },
    { id: "q_an5", topicId: "top_analog", questionText: "Puppy is to dog as kitten is to ____", options: ["pet", "cat", "animal", "fur"], correctAnswer: 1, explanation: "A puppy is a young dog, and a kitten is a young cat.", difficulty: "easy", tags: ["verbal_reasoning", "analogies", "young_adult"] },

    // ── Codes & Ciphers ──
    { id: "q_co1", topicId: "top_codes", questionText: "If CAT is coded as DBU, how would DOG be coded?", options: ["EPH", "CPF", "FOH", "EPI"], correctAnswer: 0, explanation: "Each letter moves forward by 1: D\u2192E, O\u2192P, G\u2192H = EPH.", difficulty: "medium", tags: ["verbal_reasoning", "codes", "letter_shift"] },
    { id: "q_co2", topicId: "top_codes", questionText: "If 1=A, 2=B, 3=C etc., what word does 3-1-20 spell?", options: ["BAT", "CAT", "CAN", "CAR"], correctAnswer: 1, explanation: "3=C, 1=A, 20=T, which spells CAT.", difficulty: "easy", tags: ["verbal_reasoning", "codes", "number_letter"] },
    { id: "q_co3", topicId: "top_codes", questionText: "If FISH is written backwards as HSIF, what is TREE written backwards?", options: ["EERT", "TERE", "ERET", "REET"], correctAnswer: 0, explanation: "TREE reversed: E-E-R-T = EERT.", difficulty: "easy", tags: ["verbal_reasoning", "codes", "reversal"] },
    { id: "q_co4", topicId: "top_codes", questionText: "If MOON is coded as NPPO, how is SUN coded?", options: ["TVO", "TVP", "SUO", "RUN"], correctAnswer: 0, explanation: "Each letter moves forward by 1: S\u2192T, U\u2192V, N\u2192O = TVO.", difficulty: "medium", tags: ["verbal_reasoning", "codes", "letter_shift"] },
    { id: "q_co5", topicId: "top_codes", questionText: "If A=1, B=2... Z=26, what does CAT equal (sum of letters)?", options: ["24", "27", "22", "30"], correctAnswer: 0, explanation: "C=3, A=1, T=20. Total = 3+1+20 = 24.", difficulty: "medium", tags: ["verbal_reasoning", "codes", "number_letter"] },

    // ── Word Patterns ──
    { id: "q_wp1", topicId: "top_wordp", questionText: "Which word does not belong? apple, banana, carrot, grape", options: ["apple", "banana", "carrot", "grape"], correctAnswer: 2, explanation: "Carrot is a vegetable; the others are all fruits.", difficulty: "easy", tags: ["verbal_reasoning", "word_patterns", "odd_one_out"] },
    { id: "q_wp2", topicId: "top_wordp", questionText: "Find the hidden word within: 'The teacher appeared angry.'", options: ["each", "hear", "red", "ape"], correctAnswer: 0, explanation: "'each' is hidden across 'tEACHer'.", difficulty: "medium", tags: ["verbal_reasoning", "word_patterns", "hidden_words"] },
    { id: "q_wp3", topicId: "top_wordp", questionText: "Which word can go before both LIGHT and RISE?", options: ["moon", "sun", "star", "day"], correctAnswer: 1, explanation: "SUNlight and SUNrise both work.", difficulty: "easy", tags: ["verbal_reasoning", "word_patterns", "compound_words"] },
    { id: "q_wp4", topicId: "top_wordp", questionText: "Which word does not belong? run, sprint, jog, sit", options: ["run", "sprint", "jog", "sit"], correctAnswer: 3, explanation: "'Sit' does not involve movement; the others are ways of moving on foot.", difficulty: "easy", tags: ["verbal_reasoning", "word_patterns", "odd_one_out"] },
    { id: "q_wp5", topicId: "top_wordp", questionText: "Which word can go after RAIN and before FALL?", options: ["drop", "water", "storm", "cloud"], correctAnswer: 1, explanation: "RAINwater and WATERfall both work.", difficulty: "medium", tags: ["verbal_reasoning", "word_patterns", "compound_words"] },

    // ── Number Sequences ──
    { id: "q_ns1", topicId: "top_numseq", questionText: "What comes next? 2, 5, 8, 11, ___", options: ["12", "13", "14", "15"], correctAnswer: 2, explanation: "The pattern adds 3 each time: 11+3=14.", difficulty: "easy", tags: ["non_verbal", "sequences", "arithmetic"] },
    { id: "q_ns2", topicId: "top_numseq", questionText: "What comes next? 1, 4, 9, 16, ___", options: ["20", "21", "24", "25"], correctAnswer: 3, explanation: "These are square numbers: 1\u00b2, 2\u00b2, 3\u00b2, 4\u00b2, 5\u00b2 = 25.", difficulty: "medium", tags: ["non_verbal", "sequences", "squares"] },
    { id: "q_ns3", topicId: "top_numseq", questionText: "What comes next? 3, 6, 12, 24, ___", options: ["36", "48", "30", "42"], correctAnswer: 1, explanation: "Each number is doubled: 24x2=48.", difficulty: "easy", tags: ["non_verbal", "sequences", "geometric"] },
    { id: "q_ns4", topicId: "top_numseq", questionText: "What comes next? 100, 91, 82, 73, ___", options: ["63", "64", "65", "66"], correctAnswer: 1, explanation: "The pattern subtracts 9 each time: 73-9=64.", difficulty: "medium", tags: ["non_verbal", "sequences", "arithmetic"] },
    { id: "q_ns5", topicId: "top_numseq", questionText: "What comes next? 2, 3, 5, 8, 12, ___", options: ["15", "16", "17", "18"], correctAnswer: 2, explanation: "The differences increase by 1: +1, +2, +3, +4, +5 \u2192 12+5=17.", difficulty: "hard", tags: ["non_verbal", "sequences", "increasing_diff"] },

    // ── Shape Patterns ──
    { id: "q_sh1", topicId: "top_shapes", questionText: "If a shape has 4 equal sides and 4 right angles, what is it?", options: ["Rectangle", "Rhombus", "Square", "Parallelogram"], correctAnswer: 2, explanation: "A square has 4 equal sides AND 4 right angles.", difficulty: "easy", tags: ["non_verbal", "shapes", "properties"] },
    { id: "q_sh2", topicId: "top_shapes", questionText: "How many lines of symmetry does a regular pentagon have?", options: ["3", "4", "5", "6"], correctAnswer: 2, explanation: "A regular pentagon has 5 lines of symmetry.", difficulty: "medium", tags: ["non_verbal", "shapes", "symmetry"] },
    { id: "q_sh3", topicId: "top_shapes", questionText: "A cube has how many edges?", options: ["6", "8", "10", "12"], correctAnswer: 3, explanation: "A cube has 12 edges: 4 on top, 4 on bottom, and 4 vertical edges.", difficulty: "medium", tags: ["non_verbal", "shapes", "3d"] },
    { id: "q_sh4", topicId: "top_shapes", questionText: "Which shape has exactly one pair of parallel sides?", options: ["Square", "Trapezium", "Parallelogram", "Rhombus"], correctAnswer: 1, explanation: "A trapezium has exactly one pair of parallel sides.", difficulty: "medium", tags: ["non_verbal", "shapes", "properties"] },
    { id: "q_sh5", topicId: "top_shapes", questionText: "How many faces does a triangular prism have?", options: ["3", "4", "5", "6"], correctAnswer: 2, explanation: "A triangular prism has 5 faces: 2 triangular ends and 3 rectangular sides.", difficulty: "medium", tags: ["non_verbal", "shapes", "3d"] },

    // ── Spatial Reasoning ──
    { id: "q_sp1", topicId: "top_spatial", questionText: "If you fold paper in half twice then cut a circle in the corner, how many holes when unfolded?", options: ["1", "2", "4", "8"], correctAnswer: 2, explanation: "Folding in half twice creates 4 layers. A single cut makes 4 holes.", difficulty: "medium", tags: ["non_verbal", "spatial", "folding"] },
    { id: "q_sp2", topicId: "top_spatial", questionText: "Which direction would a clock hand point if it rotated 90\u00b0 clockwise from 12?", options: ["3", "6", "9", "12"], correctAnswer: 0, explanation: "90\u00b0 clockwise from 12 points to 3.", difficulty: "easy", tags: ["non_verbal", "spatial", "rotation"] },
    { id: "q_sp3", topicId: "top_spatial", questionText: "If you look in a mirror, which hand appears to be your right hand?", options: ["Right hand", "Left hand", "Both hands", "Neither hand"], correctAnswer: 1, explanation: "A mirror reverses left and right.", difficulty: "easy", tags: ["non_verbal", "spatial", "reflection"] },
    { id: "q_sp4", topicId: "top_spatial", questionText: "A shape is rotated 180\u00b0. If it started pointing up, which direction does it now point?", options: ["Up", "Right", "Down", "Left"], correctAnswer: 2, explanation: "A 180\u00b0 rotation flips the shape upside down.", difficulty: "easy", tags: ["non_verbal", "spatial", "rotation"] },
    { id: "q_sp5", topicId: "top_spatial", questionText: "How many small cubes make up a 3x3x3 cube?", options: ["9", "18", "21", "27"], correctAnswer: 3, explanation: "3 x 3 x 3 = 27 small cubes.", difficulty: "medium", tags: ["non_verbal", "spatial", "3d"] },
  ];

  for (const q of questions) {
    await prisma.question.create({
      data: {
        id: q.id,
        topicId: q.topicId,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: DIFFICULTY_MAP[q.difficulty] ?? 3,
        tags: q.tags,
        type: "mcq",
        examBoard: "Generic",
        ageRange: null,
        questionType: null,
      },
    });
  }

  // Seed GL Verbal Reasoning questions
  console.log("Seeding GL Verbal Reasoning questions...");
  await seedGLVerbal(prisma);      // Ages 10-11
  await seedGLVerbal910(prisma);   // Ages 9-10
  await seedGLVerbal89(prisma);    // Ages 8-9
  await seedGLVerbal78(prisma);    // Ages 7-8
  await seedGLVerbal67(prisma);    // Ages 6-7

  // ──── Test Users ────
  const parentHash = await bcrypt.hash("Password1", 12);
  const parent = await prisma.user.create({
    data: {
      id: "user_test_parent",
      name: "David Thompson",
      email: "test@example.com",
      passwordHash: parentHash,
      role: "parent",
    },
  });

  const childPinHash = await bcrypt.hash("1234", 12);
  await prisma.child.create({
    data: {
      id: "child_test_aisha",
      parentId: parent.id,
      name: "Aisha",
      age: 10,
      pinHash: childPinHash,
      examDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
      examBoard: "GL",
      avatar: "\ud83c\udf1f",
      onboardingDone: true,
    },
  });

  // ──── Avatar Items ────
  console.log("Seeding avatar items...");
  const avatarItems = [
    // Backgrounds
    { name: "Blue Sky",        rarity: "Common",    layer: "background", imageUrl: "/avatar-items/background/blue-sky.png",       coinValue: 50 },
    { name: "Sunset",          rarity: "Common",    layer: "background", imageUrl: "/avatar-items/background/sunset.png",         coinValue: 50 },
    { name: "Forest",          rarity: "Rare",      layer: "background", imageUrl: "/avatar-items/background/forest.png",         coinValue: 150 },
    { name: "Space Nebula",    rarity: "Rare",      layer: "background", imageUrl: "/avatar-items/background/space-nebula.png",   coinValue: 150 },
    { name: "Aurora Borealis", rarity: "Legendary", layer: "background", imageUrl: "/avatar-items/background/aurora.png",         coinValue: 500 },
    // Bodies
    { name: "Default Body",    rarity: "Common",    layer: "body", imageUrl: "/avatar-items/body/default.png",       coinValue: 0 },
    { name: "Sporty Body",     rarity: "Common",    layer: "body", imageUrl: "/avatar-items/body/sporty.png",        coinValue: 50 },
    { name: "Robot Body",      rarity: "Rare",      layer: "body", imageUrl: "/avatar-items/body/robot.png",         coinValue: 150 },
    { name: "Crystal Body",    rarity: "Legendary", layer: "body", imageUrl: "/avatar-items/body/crystal.png",       coinValue: 500 },
    // Shirts
    { name: "White Tee",       rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/white-tee.png",     coinValue: 50 },
    { name: "Blue Hoodie",     rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/blue-hoodie.png",   coinValue: 50 },
    { name: "Red Jacket",      rarity: "Common",    layer: "shirt", imageUrl: "/avatar-items/shirt/red-jacket.png",    coinValue: 50 },
    { name: "Varsity Jacket",  rarity: "Rare",      layer: "shirt", imageUrl: "/avatar-items/shirt/varsity.png",       coinValue: 150 },
    { name: "Gold Blazer",     rarity: "Rare",      layer: "shirt", imageUrl: "/avatar-items/shirt/gold-blazer.png",   coinValue: 150 },
    { name: "Dragon Armour",   rarity: "Legendary", layer: "shirt", imageUrl: "/avatar-items/shirt/dragon-armour.png", coinValue: 500 },
    // Pants
    { name: "Blue Jeans",      rarity: "Common",    layer: "pants", imageUrl: "/avatar-items/pants/blue-jeans.png",    coinValue: 50 },
    { name: "Black Joggers",   rarity: "Common",    layer: "pants", imageUrl: "/avatar-items/pants/black-joggers.png", coinValue: 50 },
    { name: "Camo Pants",      rarity: "Rare",      layer: "pants", imageUrl: "/avatar-items/pants/camo.png",          coinValue: 150 },
    { name: "Flame Pants",     rarity: "Legendary", layer: "pants", imageUrl: "/avatar-items/pants/flame.png",         coinValue: 500 },
    // Shoes
    { name: "White Trainers",  rarity: "Common",    layer: "shoes", imageUrl: "/avatar-items/shoes/white-trainers.png", coinValue: 50 },
    { name: "Black Boots",     rarity: "Common",    layer: "shoes", imageUrl: "/avatar-items/shoes/black-boots.png",    coinValue: 50 },
    { name: "Gold Kicks",      rarity: "Rare",      layer: "shoes", imageUrl: "/avatar-items/shoes/gold-kicks.png",     coinValue: 150 },
    { name: "Rocket Boots",    rarity: "Legendary", layer: "shoes", imageUrl: "/avatar-items/shoes/rocket-boots.png",   coinValue: 500 },
    // Hats
    { name: "Red Cap",         rarity: "Common",    layer: "hat", imageUrl: "/avatar-items/hat/red-cap.png",        coinValue: 50 },
    { name: "Beanie",          rarity: "Common",    layer: "hat", imageUrl: "/avatar-items/hat/beanie.png",         coinValue: 50 },
    { name: "Wizard Hat",      rarity: "Rare",      layer: "hat", imageUrl: "/avatar-items/hat/wizard.png",         coinValue: 150 },
    { name: "Crown",           rarity: "Rare",      layer: "hat", imageUrl: "/avatar-items/hat/crown.png",          coinValue: 150 },
    { name: "Halo",            rarity: "Legendary", layer: "hat", imageUrl: "/avatar-items/hat/halo.png",           coinValue: 500 },
    // Accessories
    { name: "Round Glasses",   rarity: "Common",    layer: "accessory", imageUrl: "/avatar-items/accessory/round-glasses.png", coinValue: 50 },
    { name: "Sunglasses",      rarity: "Common",    layer: "accessory", imageUrl: "/avatar-items/accessory/sunglasses.png",    coinValue: 50 },
    { name: "Gold Chain",      rarity: "Rare",      layer: "accessory", imageUrl: "/avatar-items/accessory/gold-chain.png",    coinValue: 150 },
    { name: "Wings",           rarity: "Legendary", layer: "accessory", imageUrl: "/avatar-items/accessory/wings.png",         coinValue: 500 },
    // Effects
    { name: "Sparkles",        rarity: "Rare",      layer: "effect", imageUrl: "/avatar-items/effect/sparkles.png",   coinValue: 150 },
    { name: "Fire Aura",       rarity: "Legendary", layer: "effect", imageUrl: "/avatar-items/effect/fire-aura.png",  coinValue: 500 },
    { name: "Lightning",       rarity: "Legendary", layer: "effect", imageUrl: "/avatar-items/effect/lightning.png",  coinValue: 500 },
  ];

  for (const item of avatarItems) {
    await prisma.avatarItem.create({
      data: {
        id: `avatar-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
        name: item.name,
        rarity: item.rarity as any,
        layer: item.layer as any,
        imageUrl: item.imageUrl,
        coinValue: item.coinValue,
      },
    });
  }
  console.log(`Seeded ${avatarItems.length} avatar items.`);

  console.log("Seed completed successfully!");
  console.log("Test parent: test@example.com / Password1");
  console.log("Test child: Aisha / PIN: 1234 (login code: child_test_aisha)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
