import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

async function checkTopics() {
  const subject = await prisma.subject.findFirst({
    where: { slug: "verbal-reasoning" },
    include: { topics: true },
  });

  if (!subject) {
    console.log("Subject not found");
    await prisma.$disconnect();
    return;
  }

  console.log(`\nTopics for ${subject.name}:`);
  subject.topics.forEach((topic) => {
    console.log(`- ${topic.name} (ID: ${topic.id})`);
  });

  await prisma.$disconnect();
}

checkTopics();
