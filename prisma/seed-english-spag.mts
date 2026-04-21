import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

// ============================================================
// Types
// ============================================================

interface RawQuestion {
  id: string;
  sub_topic: string;
  question_text: string;
  context_sentence: string | null;
  options: Record<string, string> | null;
  correct_answer: string | string[];
  marking_logic: string;
}

const OPTION_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

function toQuestionType(subTopic: string): string {
  return subTopic
    .toLowerCase()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ============================================================
// Load & deduplicate
// ============================================================

function loadFile(path: string): RawQuestion[] {
  let raw = readFileSync(path, "utf-8").trim();
  // Fix concatenated JSON arrays: }\r\n][\r\n{ → },{
  // The file has Windows line endings (\r\n) and arrays concatenated as ][
  raw = raw.replace(/\}\r?\n\]\[?\r?\n\s*\[?\s*\{/g, "},{");
  // Also handle the simple ][ case
  while (raw.includes("][")) {
    raw = raw.replace("][", ",");
  }
  const all: RawQuestion[] = JSON.parse(raw);
  // IDs are NOT unique in this file (388 unique IDs for 3186 questions).
  // Deduplicate by question content instead.
  const seen = new Set<string>();
  const unique: RawQuestion[] = [];
  for (const q of all) {
    const key = `${q.sub_topic}|${q.question_text}|${q.context_sentence || ""}|${JSON.stringify(q.correct_answer)}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(q);
    }
  }
  return unique;
}

// ============================================================
// Difficulty assignment
// ============================================================

function assignDifficulty(subTopic: string): number {
  const lower = subTopic.toLowerCase();

  // Easy (2) - basic identification
  if (lower.includes("prefix meanings") && !lower.includes("anti") && !lower.includes("sub")) return 2;
  if (lower === "identifying word classes") return 2;
  if (lower === "synonyms" || lower === "antonyms") return 2;
  if (lower === "suffix application") return 2;

  // Medium-Easy (3) - specific word classes, basic punctuation
  if (lower.includes("pronouns") || lower.includes("determiners") || lower.includes("adverbs")) return 3;
  if (lower.includes("suffix application")) return 3;
  if (lower.includes("synonyms and antonyms")) return 3;
  if (lower.includes("formal") && lower.includes("informal")) return 3;
  if (lower.includes("modal verbs")) return 3;
  if (lower.includes("prefix meanings")) return 3;

  // Medium (4) - clauses, punctuation, voice
  if (lower.includes("relative clause") || lower.includes("relative pronoun")) return 4;
  if (lower.includes("subordinate") || lower.includes("main clause")) return 4;
  if (lower.includes("colon") || lower.includes("semi-colon") || lower.includes("semi_colon")) return 4;
  if (lower.includes("dash") || lower.includes("hyphen")) return 4;
  if (lower.includes("apostrophe")) return 4;
  if (lower.includes("passive") || lower.includes("active")) return 4;
  if (lower.includes("fronted adverbial")) return 4;

  // Hard (5) - subjunctive, complex grammar
  if (lower.includes("subjunctive")) return 5;

  return 3;
}

// ============================================================
// Filter: keep MCQ + circle/short-answer convertible questions
// ============================================================

function shouldKeep(q: RawQuestion): boolean {
  // Skip questions where correct_answer is an array (multi-answer)
  if (Array.isArray(q.correct_answer)) return false;

  const hasOptions = q.options && typeof q.options === "object" && Object.keys(q.options).length > 0;
  if (hasOptions) return true;

  const qt = q.question_text.toLowerCase();
  const answer = q.correct_answer || "";

  // "Circle the X" questions
  if (qt.includes("circle")) return true;
  if (qt.includes("which word") || qt.includes("which is")) return true;

  // Short single-word/phrase answers (up to 3 words)
  if (answer.split(/\s+/).length <= 3) return true;

  return false;
}

// ============================================================
// Convert to MCQ format
// ============================================================

function convertToMcq(q: RawQuestion): { options: string[]; correctAnswer: number } | null {
  const hasOptions = q.options && typeof q.options === "object" && Object.keys(q.options).length > 0;

  const answerStr = q.correct_answer as string;

  if (hasOptions) {
    // Already MCQ - convert {A: "...", B: "...", ...} to array
    const opts = q.options!;
    const letters = ["A", "B", "C", "D"].filter((l) => l in opts);
    if (letters.length < 2) return null;

    const optionValues = letters.map((l) => opts[l]);
    const correctIdx = OPTION_INDEX[answerStr];
    if (correctIdx === undefined || correctIdx >= optionValues.length) return null;

    return { options: optionValues, correctAnswer: correctIdx };
  }

  // Circle/short-answer: create MCQ from context
  const answer = (answerStr || "").trim();
  if (!answer) return null;

  // Generate distractors from the context sentence
  const context = q.context_sentence || q.question_text;
  const distractors = generateDistractors(answer, context, q.sub_topic);

  if (distractors.length < 3) return null;

  // Build options: correct + 3 distractors, then shuffle
  const allOptions = [answer, ...distractors.slice(0, 3)];
  const shuffled = shuffleWithCorrectIndex(allOptions, 0);

  return { options: shuffled.options, correctAnswer: shuffled.correctIndex };
}

function generateDistractors(correct: string, context: string, subTopic: string): string[] {
  const lower = subTopic.toLowerCase();

  // Word class questions - extract other words from sentence
  if (lower.includes("word class") || lower.includes("identifying word") || lower.includes("pronoun") || lower.includes("determiner") || lower.includes("adverb")) {
    return getWordDistractors(correct, context, lower);
  }

  // Relative pronouns
  if (lower.includes("relative pronoun") || lower.includes("relative clause")) {
    const pronouns = ["who", "whom", "which", "that", "whose", "where", "when"];
    return pronouns.filter((p) => p.toLowerCase() !== correct.toLowerCase()).slice(0, 3);
  }

  // Modal verbs
  if (lower.includes("modal verb")) {
    const modals = ["can", "could", "may", "might", "must", "shall", "should", "will", "would"];
    return modals.filter((m) => m.toLowerCase() !== correct.toLowerCase()).slice(0, 3);
  }

  // Prefix/suffix
  if (lower.includes("prefix")) {
    const prefixes = ["re", "un", "mis", "dis", "anti", "sub", "pre", "over", "under", "inter"];
    if (correct.length <= 5) {
      return prefixes.filter((p) => p !== correct.toLowerCase()).slice(0, 3);
    }
    // Word with prefix - generate other prefixed words
    return getWordDistractors(correct, context, lower);
  }

  if (lower.includes("suffix")) {
    const suffixes = ["ment", "ness", "ful", "less", "tion", "sion", "ate", "ise", "ify", "able"];
    if (correct.length <= 6) {
      return suffixes.filter((s) => s !== correct.toLowerCase()).slice(0, 3);
    }
    return getWordDistractors(correct, context, lower);
  }

  // Synonyms/antonyms - extract other words
  if (lower.includes("synonym") || lower.includes("antonym")) {
    return getWordDistractors(correct, context, lower);
  }

  // Formal/informal vocabulary
  if (lower.includes("formal")) {
    return getWordDistractors(correct, context, lower);
  }

  // Default: extract words from context
  return getWordDistractors(correct, context, lower);
}

function getWordDistractors(correct: string, context: string, _subTopic: string): string[] {
  // Extract meaningful words from the context (4+ letters, not the correct answer)
  const words = context
    .replace(/[^a-zA-Z\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && w.toLowerCase() !== correct.toLowerCase())
    .map((w) => w.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, ""));

  // Deduplicate and filter
  const unique = [...new Set(words.map((w) => w.toLowerCase()))].map((w) => {
    const orig = words.find((o) => o.toLowerCase() === w);
    return orig || w;
  });

  // Remove common stop words
  const stopWords = new Set(["the", "and", "was", "were", "has", "had", "have", "for", "are", "but", "not", "you", "all", "can", "her", "his", "one", "our", "out", "its", "she", "him", "his", "how", "its", "may", "new", "now", "old", "see", "way", "who", "did", "get", "let", "say", "too", "use", "that", "with", "this", "from", "they", "been", "will", "each", "make", "like", "than", "them", "then", "what", "when", "where", "which", "their", "there", "these", "those", "about", "after", "could", "other", "would"]);

  return unique.filter((w) => !stopWords.has(w.toLowerCase()) && w.length >= 3).slice(0, 5);
}

function shuffleWithCorrectIndex(options: string[], correctIdx: number): { options: string[]; correctIndex: number } {
  const indices = options.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffled = indices.map((i) => options[i]);
  const newCorrectIdx = indices.indexOf(correctIdx);
  return { options: shuffled, correctIndex: newCorrectIdx };
}

// ============================================================
// Build question text
// ============================================================

function buildQuestionText(q: RawQuestion): string {
  if (q.context_sentence) {
    return `${q.question_text}\n\n${q.context_sentence}`;
  }
  return q.question_text;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("\n=== KS2 SPAG Questions → English ===\n");

  // Create topic if it doesn't exist
  const topicId = "top_spag";
  const existing = await prisma.topic.findUnique({ where: { id: topicId } });
  if (!existing) {
    await prisma.topic.create({
      data: {
        id: topicId,
        name: "SPAG",
        subjectId: "sub_english",
        order: 5,
      },
    });
    console.log("Created topic: SPAG (top_spag)");
  } else {
    console.log(`Topic already exists: ${existing.name} (${topicId})`);
  }

  // Load questions
  const allQuestions = loadFile("/Users/jameshe/Downloads/KS2_SPAG_MASTER_2025.json");
  console.log(`Loaded ${allQuestions.length} unique questions from JSON`);

  // Filter to keepable questions
  const keepable = allQuestions.filter(shouldKeep);
  console.log(`Keepable (MCQ + circle/short): ${keepable.length}`);

  // Delete existing Generic SPAG questions
  const deleted = await prisma.question.deleteMany({
    where: { topicId, examBoard: null },
  });
  console.log(`Deleted ${deleted.count} existing Generic SPAG questions`);

  let created = 0;
  let skipped = 0;
  const summary: Record<string, number> = {};

  for (const q of keepable) {
    const mcq = convertToMcq(q);
    if (!mcq || mcq.options.length < 4) {
      skipped++;
      continue;
    }

    const questionType = toQuestionType(q.sub_topic);
    const difficulty = assignDifficulty(q.sub_topic);
    const questionText = buildQuestionText(q);

    await prisma.question.create({
      data: {
        topicId,
        subtopic: q.sub_topic,
        questionText,
        options: mcq.options,
        correctAnswer: mcq.correctAnswer,
        explanation: q.marking_logic,
        difficulty,
        tags: ["english", "spag"],
        type: "mcq",
        ageRange: "10-11",
        examBoard: null,  // Generic / national curriculum
        questionType,
      },
    });
    created++;
    summary[questionType] = (summary[questionType] || 0) + 1;
  }

  console.log(`\nCreated ${created} questions (skipped ${skipped} with insufficient options)`);
  console.log("\nBy question type:");
  for (const [qt, count] of Object.entries(summary).sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`  ${qt}: ${count}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
