import { env } from "cloudflare:workers";
import { auth } from "@fieldjolt/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN || "",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

export default app;
