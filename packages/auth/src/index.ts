import { PrismaClient } from "@fieldjolt/db";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const COOKIE_PREFIX = "fieldjolt";

type CreateAuthConfig = {
  database: PrismaClient | string;
  origin: string;
};

export function createAuth(config: CreateAuthConfig) {
  if (!config.database) {
    throw new Error("Database is required");
  }
  if (!config.origin) {
    throw new Error("Origin is required");
  }

  // Accept either a PrismaClient instance or a connection string
  const db =
    typeof config.database === "string"
      ? new PrismaClient({ datasourceUrl: config.database })
      : config.database;

  return betterAuth<BetterAuthOptions>({
    basePath: "/auth",
    database: prismaAdapter(db, {
      provider: "postgresql",
    }),
    trustedOrigins: [config.origin],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
      cookiePrefix: COOKIE_PREFIX,
    },
    // plugins: [expo()],
  });
}

export type Auth = ReturnType<typeof createAuth>;
