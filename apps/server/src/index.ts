import { createTRPCContext } from "@fieldjolt/api";
import { appRouter } from "@fieldjolt/api/root";
import { createAuth } from "@fieldjolt/auth";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prismaMiddleware } from "./middleware/prisma";
import type { HonoEnv } from "./types";

const app = new Hono<HonoEnv>();

app.use(logger());
app.use(
  "*",
  cors({
    origin: (_origin, c) => c.env.CORS_ORIGIN || "",
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Set-Cookie"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", prismaMiddleware);

app.get("/health", (c) => c.json({ status: "ok" }));

app.on(["POST", "GET"], "/auth/*", async (c) => {
  const prisma = c.get("prisma");

  const auth = createAuth({
    environment: c.env.NODE_ENV,
    database: prisma,
    baseURL: c.env.BETTER_AUTH_URL,
    trustedOrigins: [c.env.CORS_ORIGIN, c.env.BETTER_AUTH_URL],
    resendApiKey: c.env.RESEND_API_KEY,
  });

  return await auth.handler(c.req.raw);
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (_opts, c) => {
      const prisma = c.get("prisma");

      const auth = createAuth({
        environment: c.env.NODE_ENV,
        database: prisma,
        baseURL: c.env.BETTER_AUTH_URL,
        trustedOrigins: [c.env.CORS_ORIGIN, c.env.BETTER_AUTH_URL],
        resendApiKey: c.env.RESEND_API_KEY,
      });

      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      return createTRPCContext({
        prisma,
        user: session?.user ?? null,
      });
    },
  })
);

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

export default app;
