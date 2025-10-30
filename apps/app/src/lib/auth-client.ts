import type { Auth } from "@fieldjolt/auth";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  basePath: "/auth",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    inferAdditionalFields<Auth>(),
    magicLinkClient(),
    lastLoginMethodClient(),
  ],
});
