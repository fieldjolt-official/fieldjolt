import type { AuthUser } from "@fieldjolt/auth";
import {
  Sidebar,
  SidebarContent,
} from "@fieldjolt/ui/components/sidebar";
import { AppSidebarFooter } from "./SidebarFooter";
import { AppSidebarHeader } from "./SidebarHeader";
import { SidebarItems } from "./SidebarItems";

export function AppSidebar({
  user,
  orgSlug,
}: {
  user: AuthUser;
  orgSlug: string;
}) {
  return (
    <Sidebar variant="inset">
      <AppSidebarHeader orgSlug={orgSlug} />
      <SidebarContent>
        <SidebarItems orgSlug={orgSlug} />
      </SidebarContent>
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
