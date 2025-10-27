import { PrismaClient } from "@fieldjolt/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { factory } from "../lib/app";

export const prismaMiddleware = factory.createMiddleware(async (c, next) => {
  const pool = new Pool({
    connectionString: c.env.HYPERDRIVE.connectionString,
    maxUses: 1,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  c.set("prisma", prisma);

  await next();

  c.executionCtx.waitUntil(pool.end());
});
