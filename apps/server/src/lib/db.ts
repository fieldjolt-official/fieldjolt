import { PrismaClient } from "@fieldjolt/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

let cachedPrisma: PrismaClient | null = null;
let cachedConnectionString: string | null = null;

export function getPrismaClient(connectionString: string): PrismaClient {
  if (cachedPrisma && cachedConnectionString === connectionString) {
    return cachedPrisma;
  }

  const pool = new Pool({
    connectionString,
    max: 1,
  });

  const adapter = new PrismaPg(pool);
  cachedPrisma = new PrismaClient({ adapter });
  cachedConnectionString = connectionString;

  return cachedPrisma;
}
