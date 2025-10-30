import { PrismaClient } from "@fieldjolt/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

attachDatabasePool(pool);

const adapter = new PrismaPg(pool);

export const prisma: PrismaClient = new PrismaClient({ adapter });
