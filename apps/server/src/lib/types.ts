import type { env } from "cloudflare:workers";
import type { PrismaClient } from "@fieldjolt/db";
import type { User } from "better-auth";

export type Variables = {
  prisma: PrismaClient;
  user: User | null;
};

export type HonoEnv = {
  Bindings: typeof env;
  Variables: Variables;
};
