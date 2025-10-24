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
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => c.text("OK"));

export default app;
