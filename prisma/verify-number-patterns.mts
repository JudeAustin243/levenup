import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const question = await prisma.question.findFirst({
  where: { questionType: "number_patterns" },
});

if (question) {
  console.log("Question Text:");
  console.log(question.questionText);
}

await prisma.$disconnect();
