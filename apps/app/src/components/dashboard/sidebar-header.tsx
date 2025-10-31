"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@fieldjolt/ui/components/sidebar";
import { Building2 } from "lucide-react";
import type { Organization } from "@/lib/db/get-organization";

export function AppSidebarHeader({
  organizations,
  orgSlug,
}: {
  organizations: Organization[];
  orgSlug: string;
}) {
  const currentOrg = organizations.find(
    (org) => org.organization.slug === orgSlug
  );

  if (!currentOrg) {
    return null;
  }

  return (
    <SidebarHeader className="px-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {currentOrg?.organization.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {currentOrg?.role.name}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
