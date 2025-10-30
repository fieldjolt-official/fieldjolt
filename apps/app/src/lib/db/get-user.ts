import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "../auth";

export const getUser = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
});
