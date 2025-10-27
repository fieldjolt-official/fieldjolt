import { factory } from "../lib/app";
import { getPrismaClient } from "../lib/db";

export const prismaMiddleware = factory.createMiddleware(async (c, next) => {
  const db = getPrismaClient(c.env.HYPERDRIVE.connectionString);

  c.set("prisma", db);

  await next();
});
