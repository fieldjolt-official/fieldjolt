import path from "node:path";
import dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

dotenv.config({
  path: "../../apps/app/.env",
});

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    seed: "tsx src/seed.ts",
  },
} satisfies PrismaConfig;
