import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const parsedUrl = new URL(connectionString);
  const adapter = new PrismaPg({
    connectionString,
    // Some local Postgres setups intentionally use an empty password.
    // Passing an explicit string avoids pg's SASL error when password is omitted.
    password: parsedUrl.password || "",
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
