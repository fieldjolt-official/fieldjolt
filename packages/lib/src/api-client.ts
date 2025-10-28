import { hc } from "hono/client";
import type { AppType } from "../../../apps/server/src/index";

export function createClient(baseUrl: string) {
  return hc<AppType>(baseUrl, {
    init: {
      credentials: "include",
    },
  });
}

export { hc, type AppType };
