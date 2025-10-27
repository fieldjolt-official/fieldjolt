import { PrismaClient } from "@fieldjolt/db";
import { factory } from "../lib/app";

export const prismaMiddleware = factory.createMiddleware(async (c, next) => {
  const db = new PrismaClient({
    datasourceUrl: c.env.HYPERDRIVE.connectionString,
  });

  c.set("prisma", db);

  await next();
});
