import { createAuth } from "@fieldjolt/auth";
import { prisma } from "./db"; // Your Prisma client

export const auth = createAuth({
  environment:
    process.env.NODE_ENV === "production" ? "production" : "development",
  database: prisma,
  baseURL: process.env.NEXT_PUBLIC_APP_URL as string, // https://app.fieldjolt.com
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL as string,
    process.env.NEXT_PUBLIC_API_URL as string,
  ],
});
