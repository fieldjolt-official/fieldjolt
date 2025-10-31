import { SidebarProvider } from "@fieldjolt/ui/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { getOrganizations } from "@/lib/db/get-organization";
import { getUser } from "@/lib/db/get-user";

export default async function OrganizationLayoutWrapper({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;

  const user = await getUser();

  if (!user) {
    return redirect("/auth");
  }

  if (!orgSlug) {
    return redirect("/");
  }

  const organizations = await getOrganizations(user.id);

  const organizationAccess = organizations.find(
    (org) => org.organization.slug === orgSlug
  );

  if (!organizationAccess) {
    return redirect("/");
  }

  const cookieStore = await cookies();
  const defaultOpen =
    (cookieStore.get("sidebar_state")?.value ?? "true") === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar organizations={organizations} orgSlug={orgSlug} user={user} />
      {children}
    </SidebarProvider>
  );
}
