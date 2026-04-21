import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

console.log("🌱 Seeding Multiple Meanings questions...\n");

// First delete all existing multiple_meanings questions
console.log("Deleting existing multiple_meanings questions...");

const existingQuestions = await prisma.question.findMany({
  where: { questionType: "multiple_meanings" },
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
  console.log("No existing multiple_meanings questions to delete\n");
}

// Multiple Meanings questions for ages 6-7 (very easy - common simple words)
const multipleMeanings6to7 = [
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(flying animal   mammal)   (sports stick   club)",
    options: ["bird", "bat", "ball", "racket", "animal"],
    correctAnswer: 1, // bat
    explanation: "'Bat' is a flying animal, and it's also a stick used to hit a ball in sports.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(able to   am able)   (metal container   tin)",
    options: ["will", "can", "box", "could", "jar"],
    correctAnswer: 1, // can
    explanation: "'Can' means to be able to do something, and it's also a metal container for food or drinks.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(circle   band)   (bell sound   chime)",
    options: ["round", "ring", "noise", "loop", "sound"],
    correctAnswer: 1, // ring
    explanation: "'Ring' is a circle you wear on your finger, and it's also the sound a bell makes.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(observe   look)   (clock   timepiece)",
    options: ["see", "watch", "stare", "time", "tick"],
    correctAnswer: 1, // watch
    explanation: "'Watch' means to look at or observe something, and it's also a small clock you wear.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(tree skin   covering)   (dog sound   woof)",
    options: ["wood", "bark", "howl", "coat", "noise"],
    correctAnswer: 1, // bark
    explanation: "'Bark' is the hard covering on a tree, and it's also the sound a dog makes.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(bounce   hop)   (part of year   season)",
    options: ["jump", "spring", "summer", "leap", "time"],
    correctAnswer: 1, // spring
    explanation: "'Spring' means to jump or bounce, and it's also a season of the year.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(left   remaining)   (relax   stay)",
    options: ["gone", "rest", "extra", "calm", "sleep"],
    correctAnswer: 1, // rest
    explanation: "'Rest' means what is left or remaining, and it also means to relax or stay still.",
    difficulty: 1,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(hand gesture   greet)   (water ripple   sea)",
    options: ["hello", "wave", "splash", "signal", "ocean"],
    correctAnswer: 1, // wave
    explanation: "'Wave' means to move your hand to say hello, and it's also a moving ridge of water in the sea.",
    difficulty: 1,


  },
];

// Multiple Meanings questions for ages 7-8 (easy - moderate vocabulary)
const multipleMeanings7to8 = [
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(bright   shining)   (not heavy   weightless)",
    options: ["glow", "light", "soft", "lamp", "small"],
    correctAnswer: 1, // light
    explanation: "'Light' means bright or shining, and it also means not heavy in weight.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(carnival   festival)   (just   equal)",
    options: ["party", "fair", "honest", "fun", "right"],
    correctAnswer: 1, // fair
    explanation: "'Fair' is a carnival or outdoor festival, and it also means just or treating everyone equally.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(kind   type)   (nice   caring)",
    options: ["sort", "kind", "gentle", "good", "sweet"],
    correctAnswer: 1, // kind
    explanation: "'Kind' means a type or variety of something, and it also means nice or caring.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(metal pin   fastener)   (finger covering   toe)",
    options: ["screw", "nail", "hammer", "claw", "tack"],
    correctAnswer: 1, // nail
    explanation: "'Nail' is a metal pin used to fasten wood, and it's also the hard covering on your fingers and toes.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(hand part   tree)   (inside hand   tropical)",
    options: ["finger", "palm", "leaf", "branch", "coconut"],
    correctAnswer: 1, // palm
    explanation: "'Palm' is the inside flat part of your hand, and it's also a type of tropical tree.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(letters   mail)   (pole   stake)",
    options: ["parcel", "post", "fence", "stick", "delivery"],
    correctAnswer: 1, // post
    explanation: "'Post' means mail or letters you send, and it also means a pole or upright stake.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(ground   earth)   (territory   area)",
    options: ["dirt", "land", "soil", "field", "country"],
    correctAnswer: 1, // land
    explanation: "'Land' is the ground or earth's surface, and it also means territory or an area of ground.",
    difficulty: 2,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(rock   boulder)   (music type   roll)",
    options: ["stone", "rock", "mineral", "beat", "genre"],
    correctAnswer: 1, // rock
    explanation: "'Rock' is a hard piece of stone, and it's also a type of music (rock and roll).",
    difficulty: 2,


  },
];

// Multiple Meanings questions for ages 9-10 (intermediate - more sophisticated words)
const multipleMeanings9to10 = [
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(money place   savings)   (river edge   shore)",
    options: ["finance", "bank", "coast", "money", "side"],
    correctAnswer: 1, // bank
    explanation: "'Bank' is a place where you keep money, and it's also the edge or shore of a river.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(tolerate   endure)   (large animal   creature)",
    options: ["suffer", "bear", "stand", "beast", "carry"],
    correctAnswer: 1, // bear
    explanation: "'Bear' means to tolerate or endure something, and it's also a large furry animal.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(business   company)   (solid   hard)",
    options: ["strong", "firm", "rigid", "stiff", "trade"],
    correctAnswer: 1, // firm
    explanation: "'Firm' is a business or company, and it also means solid, hard, or not soft.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(water passage   stream)   (TV station   broadcast)",
    options: ["river", "channel", "network", "flow", "media"],
    correctAnswer: 1, // channel
    explanation: "'Channel' is a passage for water to flow through, and it's also a television station.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(period   time)   (flavor   add taste)",
    options: ["moment", "season", "spice", "age", "duration"],
    correctAnswer: 1, // season
    explanation: "'Season' is a period or time of year, and it also means to add flavor or taste to food.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(wood piece   tree trunk)   (record   diary)",
    options: ["timber", "log", "note", "branch", "book"],
    correctAnswer: 1, // log
    explanation: "'Log' is a piece of a tree trunk or wood, and it also means to record information in a diary or logbook.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(position   spot)   (location   area)",
    options: ["point", "place", "site", "position", "zone"],
    correctAnswer: 1, // place
    explanation: "'Place' means a position or spot, and it also means a location or area.",
    difficulty: 4,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(ship officer   friend)   (partner   pair)",
    options: ["captain", "mate", "companion", "couple", "buddy"],
    correctAnswer: 1, // mate
    explanation: "'Mate' is a ship's officer or a friend, and it also means a partner or one of a pair.",
    difficulty: 4,


  },
];

// Multiple Meanings questions for ages 8-9 (easier words)
const multipleMeanings8to9 = [
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(letters   mail)   (pole   stake)",
    options: ["fence", "post", "parcel", "delivery", "pillar"],
    correctAnswer: 1, // post
    explanation: "'Post' means mail (you post letters) and it also means a pole or stake (fence post).",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(chilly   cool)   (illness   sickness)",
    options: ["winter", "cold", "fever", "frozen", "disease"],
    correctAnswer: 1, // cold
    explanation: "'Cold' means chilly or cool temperature, and it also means an illness (catching a cold).",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(tree covering   skin)   (dog sound   call)",
    options: ["wood", "bark", "howl", "trunk", "noise"],
    correctAnswer: 1, // bark
    explanation: "'Bark' means the outer covering of a tree, and it also means the sound a dog makes.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(flying mammal   creature)   (sports stick   racket)",
    options: ["bird", "bat", "club", "ball", "animal"],
    correctAnswer: 1, // bat
    explanation: "'Bat' is a flying mammal (the animal), and it's also a stick used in sports like cricket or baseball.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(hand gesture   greet)   (ocean ripple   sea)",
    options: ["splash", "wave", "tide", "water", "signal"],
    correctAnswer: 1, // wave
    explanation: "'Wave' means to gesture with your hand in greeting, and it also means a ripple in the ocean.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(circular band   circle)   (bell sound   chime)",
    options: ["round", "ring", "loop", "noise", "tone"],
    correctAnswer: 1, // ring
    explanation: "'Ring' means a circular band (like a finger ring), and it also means the sound a bell makes.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(carnival   festival)   (just   equal)",
    options: ["party", "fair", "right", "event", "honest"],
    correctAnswer: 1, // fair
    explanation: "'Fair' means a carnival or festival, and it also means just or equal (treating someone fairly).",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(metal fastener   pin)   (finger covering   claw)",
    options: ["screw", "nail", "tack", "toe", "hammer"],
    correctAnswer: 1, // nail
    explanation: "'Nail' is a metal fastener used in building, and it's also the hard covering at the end of your finger or toe.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(bright   shining)   (not heavy   feather)",
    options: ["lamp", "light", "glow", "soft", "small"],
    correctAnswer: 1, // light
    explanation: "'Light' means bright or shining (like sunlight), and it also means not heavy (a light object).",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(observe   watch)   (timepiece   clock)",
    options: ["look", "watch", "stare", "time", "hour"],
    correctAnswer: 1, // watch
    explanation: "'Watch' means to observe or look at something, and it's also a timepiece you wear on your wrist.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(monetary institution   savings)   (river edge   shore)",
    options: ["money", "bank", "coast", "finance", "water"],
    correctAnswer: 1, // bank
    explanation: "'Bank' is a place where you keep money, and it's also the edge or shore of a river.",
    difficulty: 3,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(tree hand   hand)   (tropical tree   coconut)",
    options: ["finger", "palm", "branch", "leaf", "fruit"],
    correctAnswer: 1, // palm
    explanation: "'Palm' is the inside of your hand, and it's also a type of tropical tree.",
    difficulty: 3,


  },
];

// Multiple Meanings questions for ages 10-11 (harder words)
const multipleMeanings10to11 = [
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(agreement   document)   (shrink   reduce)",
    options: ["deal", "contract", "treaty", "lessen", "bargain"],
    correctAnswer: 1, // contract
    explanation: "'Contract' is a formal agreement or document, and it also means to shrink or become smaller.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(lawsuit   trial)   (suit   clothing)",
    options: ["court", "case", "dress", "jacket", "legal"],
    correctAnswer: 1, // case
    explanation: "'Case' refers to a legal lawsuit or trial, and it can also mean a container or covering for something.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(water channel   stream)   (television station   broadcast)",
    options: ["river", "channel", "flow", "network", "media"],
    correctAnswer: 1, // channel
    explanation: "'Channel' is a water passage or stream, and it also means a television station or broadcast frequency.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(musical tone   sound)   (throw   hurl)",
    options: ["note", "pitch", "cast", "toss", "melody"],
    correctAnswer: 2, // pitch
    explanation: "'Pitch' refers to the tone or frequency of a sound in music, and it also means to throw something.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(book page   fallen tree)   (write down   record)",
    options: ["paper", "log", "note", "wood", "timber"],
    correctAnswer: 1, // log
    explanation: "'Log' is a piece of fallen tree or wood, and it also means to record or write down information.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(company   business)   (solid   hard)",
    options: ["strong", "firm", "rigid", "trade", "stiff"],
    correctAnswer: 1, // firm
    explanation: "'Firm' means a company or business, and it also means solid, hard, or not soft.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(tolerate   endure)   (animal   creature)",
    options: ["suffer", "bear", "withstand", "beast", "stand"],
    correctAnswer: 1, // bear
    explanation: "'Bear' means to tolerate or endure something difficult, and it's also a large animal.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(current   flow)   (stream   present)",
    options: ["water", "present", "river", "today", "modern"],
    correctAnswer: 1, // present
    explanation: "'Present' can mean current or happening now, and when stressed differently, it means a gift.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(type   variety)   (caring   benevolent)",
    options: ["sort", "kind", "gentle", "species", "nice"],
    correctAnswer: 1, // kind
    explanation: "'Kind' means a type or variety of something, and it also means caring or benevolent.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(season   jump)   (coiled metal   water)",
    options: ["summer", "spring", "leap", "bounce", "fountain"],
    correctAnswer: 1, // spring
    explanation: "'Spring' is a season of the year, and it's also a coiled metal object or a natural water source.",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(ship's officer   companion)   (pair   partner)",
    options: ["captain", "mate", "friend", "couple", "crew"],
    correctAnswer: 1, // mate
    explanation: "'Mate' is a ship's officer or companion, and it also means a pair or partner (like in checkmate).",
    difficulty: 5,


  },
  {
    questionText: "Choose the word that has a similar meaning to the words in both sets of brackets.\n\n(story   account)   (count   calculate)",
    options: ["tale", "story", "tale", "number", "count"],
    correctAnswer: 4, // count
    explanation: "'Count' means to calculate or number things, and 'account' can mean a story or narrative (though this is trickier).",
    difficulty: 5,


  },
];

// Insert 6-7 questions
for (const q of multipleMeanings6to7) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "multiple_meanings", "vocabulary"],
      type: "mcq",
      ageRange: "6-7",
      examBoard: "GL",
      questionType: "multiple_meanings",
    },
  });
}

console.log(`✅ Added ${multipleMeanings6to7.length} Multiple Meanings questions (ages 6-7)`);

// Insert 7-8 questions
for (const q of multipleMeanings7to8) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "multiple_meanings", "vocabulary"],
      type: "mcq",
      ageRange: "7-8",
      examBoard: "GL",
      questionType: "multiple_meanings",
    },
  });
}

console.log(`✅ Added ${multipleMeanings7to8.length} Multiple Meanings questions (ages 7-8)`);

// Insert 8-9 questions
for (const q of multipleMeanings8to9) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "multiple_meanings", "vocabulary"],
      type: "mcq",
      ageRange: "8-9",
      examBoard: "GL",
      questionType: "multiple_meanings",
    },
  });
}

console.log(`✅ Added ${multipleMeanings8to9.length} Multiple Meanings questions (ages 8-9)`);

// Insert 9-10 questions
for (const q of multipleMeanings9to10) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "multiple_meanings", "vocabulary"],
      type: "mcq",
      ageRange: "9-10",
      examBoard: "GL",
      questionType: "multiple_meanings",
    },
  });
}

console.log(`✅ Added ${multipleMeanings9to10.length} Multiple Meanings questions (ages 9-10)`);

// Insert 10-11 questions
for (const q of multipleMeanings10to11) {
  await prisma.question.create({
    data: {
      topicId: "top_wordp",
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      tags: ["verbal_reasoning", "multiple_meanings", "vocabulary"],
      type: "mcq",
      ageRange: "10-11",
      examBoard: "GL",
      questionType: "multiple_meanings",
    },
  });
}

console.log(`✅ Added ${multipleMeanings10to11.length} Multiple Meanings questions (ages 10-11)`);
console.log(`\n🎉 Total: ${multipleMeanings6to7.length + multipleMeanings7to8.length + multipleMeanings8to9.length + multipleMeanings9to10.length + multipleMeanings10to11.length} questions added!`);

await prisma.$disconnect();
