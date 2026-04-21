import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function findDuplicates() {
  const questions = await prisma.question.findMany({
    where: {
      questionType: "alphabet_series",
      ageRange: "8-9",
    },
    select: {
      id: true,
      questionText: true,
      options: true,
      correctAnswer: true,
      correctAnswers: true,
    },
  });

  console.log(`Found ${questions.length} alphabet_series questions for ages 8-9\n`);

  // Group by similar question pattern (extract the actual question part)
  const questionMap = new Map<string, typeof questions>();

  questions.forEach((q) => {
    // Extract the core question pattern (e.g., "DF is to HJ as KM is to")
    const lines = q.questionText?.split("\n") || [];
    const actualQuestion = lines.length > 1 ? lines[1] : lines[0];
    const pattern = actualQuestion?.replace(/___/g, "").trim() || "";

    if (!questionMap.has(pattern)) {
      questionMap.set(pattern, []);
    }
    questionMap.get(pattern)!.push(q);
  });

  console.log("=== Checking for duplicates ===\n");

  let foundDuplicate = false;
  questionMap.forEach((questions, pattern) => {
    if (questions.length > 1) {
      console.log(`❌ DUPLICATE FOUND: "${pattern.substring(0, 60)}..."`);
      questions.forEach((q) => {
        console.log(`   - ID: ${q.id}`);
        console.log(`     Options: ${(q.options as string[]).join(", ")}`);
        console.log(`     correctAnswer: ${q.correctAnswer}, correctAnswers: ${JSON.stringify(q.correctAnswers)}`);
      });
      console.log("");
      foundDuplicate = true;
    }
  });

  if (!foundDuplicate) {
    console.log("✅ No exact duplicates found\n");
    console.log("Listing all questions:");
    questions.forEach((q, idx) => {
      const lines = q.questionText?.split("\n") || [];
      const actualQ = lines.length > 1 ? lines[1] : lines[0];
      console.log(`${idx + 1}. ${actualQ?.substring(0, 60)}... (ID: ${q.id.substring(0, 8)}...)`);
    });
  }

  await prisma.$disconnect();
}

findDuplicates();
