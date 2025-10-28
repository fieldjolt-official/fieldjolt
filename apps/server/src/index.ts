import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createApp } from "./lib/app";
import { createAuth } from "./lib/auth";
import { prismaMiddleware } from "./middleware/prisma";

const app = createApp();

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

app.on(["POST", "GET"], "/auth/*", async (c) => {
  const prisma = c.get("prisma");

  console.log("=== Auth Request ===");
  console.log("Method:", c.req.method);
  console.log("Path:", c.req.path);
  console.log("Origin:", c.req.header("origin"));
  console.log("Environment:", c.env.NODE_ENV);
  console.log("CORS_ORIGIN:", c.env.CORS_ORIGIN);
  console.log("BETTER_AUTH_URL:", c.env.BETTER_AUTH_URL);

  const auth = createAuth({
    environment: c.env.NODE_ENV,
    database: prisma,
    origin: c.env.CORS_ORIGIN,
    apiURL: c.env.BETTER_AUTH_URL,
    resendApiKey: c.env.RESEND_API_KEY,
  });

  const response = await auth.handler(c.req.raw);

  // Log response cookies
  const setCookie = response.headers.get("set-cookie");
  console.log("Set-Cookie:", setCookie);
  console.log("===================\n");

  return response;
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error", message: err.message }, 500);
});

export type AppType = typeof app;

export default app;
