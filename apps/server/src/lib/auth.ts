// lib/auth.ts - Move it here
import type { PrismaClient } from "@fieldjolt/db";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { lastLoginMethod, magicLink } from "better-auth/plugins";
import { getResend } from "./resend";

type CreateAuthConfig = {
  environment: "development" | "production";
  database: PrismaClient;
  origin: string;
  apiURL: string;
  resendApiKey: string;
};

export function createAuth(config: CreateAuthConfig) {
  if (!config.database) {
    throw new Error("Database is required");
  }
  if (!config.origin) {
    throw new Error("Origin is required");
  }

  return betterAuth<BetterAuthOptions>({
    baseURL: config.apiURL,
    basePath: "/auth",
    database: prismaAdapter(config.database, {
      provider: "postgresql",
    }),
    trustedOrigins: [config.origin, config.apiURL],
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      ...(config.environment === "production" && {
        useSecureCookies: true,
        crossSubDomainCookies: {
          enabled: true,
          domain: "fieldjolt.com",
        },
      }),
      defaultCookieAttributes: {
        sameSite: config.environment === "production" ? "none" : "lax",
        secure: config.environment === "production",
        httpOnly: true,
        path: "/",
      },
    },
    plugins: [
      lastLoginMethod(),
      magicLink({
        sendMagicLink: async ({ email, url }) => {
          const resend = getResend(config.resendApiKey);

          await resend.emails.send({
            from: "FieldJolt <noreply@noreply.fieldjolt.com>",
            to: email,
            subject: "Login to your account",
            html: `
              <h1>Login to FieldJolt</h1>
              <p>Click the link below to securely log in to your account:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Login to FieldJolt</a>
              <p>This link will expire in 10 minutes.</p>
              <p>If you didn't request this, you can safely ignore this email.</p>
            `,
          });
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;
