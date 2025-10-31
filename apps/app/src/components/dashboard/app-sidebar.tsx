import type { AuthUser } from "@fieldjolt/auth";
import { Sidebar, SidebarContent } from "@fieldjolt/ui/components/sidebar";
import type { Organization } from "@/lib/db/get-organization";
import { AppSidebarFooter } from "./sidebar-footer";
import { AppSidebarHeader } from "./sidebar-header";
import { SidebarItems } from "./sidebar-items";

export function AppSidebar({
  user,
  orgSlug,
  organizations,
}: {
  user: AuthUser;
  orgSlug: string;
  organizations: Organization[];
}) {
  return (
    <Sidebar variant="inset">
      <AppSidebarHeader organizations={organizations} orgSlug={orgSlug} />
      <SidebarContent>
        <SidebarItems orgSlug={orgSlug} />
      </SidebarContent>
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
