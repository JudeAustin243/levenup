import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  let config: pg.PoolConfig;

  if (connectionString) {
    const parsedUrl = new URL(connectionString);
    config = {
      connectionString,
      // Some local Postgres setups intentionally use an empty password.
      // Passing an explicit string avoids pg's SASL error when password is omitted.
      password: parsedUrl.password || "",
    };
  } else {
    // Allow pg to use PGHOST/PGPORT/PGDATABASE/PGUSER defaults when DATABASE_URL is missing.
    // Keep password a string to avoid SASL type errors.
    config = { password: process.env.PGPASSWORD ?? "" };
  }

  const adapter = new PrismaPg(config);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
