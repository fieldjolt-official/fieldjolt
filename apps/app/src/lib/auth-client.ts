import type { Auth } from "@fieldjolt/auth";
import {
  inferAdditionalFields,
  lastLoginMethodClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<Auth>(),
    magicLinkClient(),
    lastLoginMethodClient(),
  ],
});
