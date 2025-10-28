import {
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "../../../server/src/lib/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  plugins: [
    inferAdditionalFields<Auth>(),
    magicLinkClient(),
    lastLoginMethodClient(),
  ],
});
