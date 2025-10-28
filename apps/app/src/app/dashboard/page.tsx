import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const headersList = await headers();
  console.log(JSON.stringify(Object.fromEntries(headersList), null, 2));
  const session = await authClient.getSession({
    fetchOptions: {
      headers: headersList,
      throw: true,
    },
  });

  if (!session?.user) {
    redirect("/auth");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.name}</p>
      <Dashboard session={session} />
    </div>
  );
}
