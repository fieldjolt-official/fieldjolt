import { COOKIE_PREFIX, createAuth } from "@fieldjolt/auth";
import { getCookie } from "hono/cookie";
import { factory } from "../lib/app";

export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const prisma = c.get("prisma");

  const auth = createAuth({
    database: prisma,
    origin: c.env.CORS_ORIGIN,
  });

  // Get session from cookie/header
  const sessionToken = getCookie(c, `${COOKIE_PREFIX}.session_token`);

  if (sessionToken) {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (session?.user) {
        c.set("user", session.user);
      }
    } catch (_error) {
      // Session invalid or expired
      c.set("user", null);
    }
  } else {
    c.set("user", null);
  }

  await next();
});

export const requireAuth = factory.createMiddleware(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});
