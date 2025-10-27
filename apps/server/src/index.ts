import { createAuth } from "@fieldjolt/auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createApp } from "./lib/app";
import { prismaMiddleware } from "./middleware/prisma";

const app = createApp();

app.use(logger());
app.use(
  "*",
  cors({
    origin: (_origin, c) => c.env.CORS_ORIGIN || "",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PATCH", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", prismaMiddleware);

app.on(["POST", "GET"], "/auth/*", (c) => {
  const prisma = c.get("prisma");
  const auth = createAuth({
    database: prisma,
    origin: c.env.CORS_ORIGIN,
  });
  return auth.handler(c.req.raw);
});

app.get("/health", (c) => c.json({ status: "ok" }));

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal server error", message: err.message }, 500);
});

export default app;
