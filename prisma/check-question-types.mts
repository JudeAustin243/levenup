import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const types = await prisma.question.groupBy({
  by: ["questionType"],
  _count: true,
});

console.log("Question types in database:");
types.forEach((t) => {
  console.log(`  ${t.questionType}: ${t._count} questions`);
});

await prisma.$disconnect();
