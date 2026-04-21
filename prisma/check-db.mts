import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! });
const { PrismaClient } = await import("../src/generated/prisma/client.ts");
const prisma = new PrismaClient({ adapter });

const subjects = await prisma.subject.findMany({ include: { topics: true } });
for (const s of subjects) {
  console.log(`${s.slug} (id: ${s.id})`);
  for (const t of s.topics) {
    console.log(`  ${t.id} "${t.name}" order:${t.order}`);
  }
}

const counts = await prisma.question.groupBy({ by: ["topicId"], _count: true });
console.log("\nQuestion counts by topic:");
for (const c of counts) {
  console.log(`  ${c.topicId}: ${c._count}`);
}

await prisma.$disconnect();
