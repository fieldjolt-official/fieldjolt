"use client";

import { useQuery, useTRPC } from "@fieldjolt/api/react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@fieldjolt/ui/components/sidebar";
import { Skeleton } from "@fieldjolt/ui/components/skeleton";
import { Building2 } from "lucide-react";

export function AppSidebarHeader({ orgSlug }: { orgSlug: string }) {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.users.organizations.queryOptions());

  const currentOrg = data?.find((org) => org.organization.slug === orgSlug);

  if (!data) {
    return <AppSidebarHeaderSkeleton />;
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

function AppSidebarHeaderSkeleton() {
  return (
    <SidebarHeader>
      <Skeleton className="size-12 w-full" />
    </SidebarHeader>
  );
}
