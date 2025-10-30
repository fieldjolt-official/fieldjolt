import { redirect } from "next/navigation";
import { getOrganizations } from "@/lib/db/get-organization";
import { getUser } from "@/lib/db/get-user";

export default async function Home() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth");
  }

  const organizations = await getOrganizations(user.id);

  return <pre>{JSON.stringify({ user, organizations }, null, 2)}</pre>;
}
