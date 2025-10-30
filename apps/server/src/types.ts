import type { env } from "cloudflare:workers";
import type { PrismaClient } from "@fieldjolt/db/cloudflare";

export type Variables = {
  prisma: PrismaClient;
};

export type HonoEnv = {
  Bindings: typeof env;
  Variables: Variables;
};
