import { PrismaClient } from "@fieldjolt/db";
import { PrismaPg } from "@prisma/adapter-pg";
import { createFactory } from "hono/factory";
import { Pool } from "pg";
import type { HonoEnv } from "../types";

export const prismaMiddleware = createFactory<HonoEnv>().createMiddleware(
  async (c, next) => {
    const pool = new Pool({
      connectionString: c.env.HYPERDRIVE.connectionString,
      maxUses: 1,
    });

    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    c.set("prisma", prisma);

    await next();

    c.executionCtx.waitUntil(pool.end());
  }
);
