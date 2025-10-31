import { createAuth } from "@fieldjolt/auth";
import { prisma } from "./db"; // Your Prisma client

export const auth = createAuth({
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
  database: prisma,
  baseURL: process.env.NEXT_PUBLIC_APP_URL as string,
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL as string],
  resendApiKey: process.env.RESEND_API_KEY,
});
