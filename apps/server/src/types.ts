import type { env } from "cloudflare:workers";
import type { PrismaClient } from "@fieldjolt/db";

export type Variables = {
  prisma: PrismaClient;
};

export type HonoEnv = {
  Bindings: typeof env;
  Variables: Variables;
};
