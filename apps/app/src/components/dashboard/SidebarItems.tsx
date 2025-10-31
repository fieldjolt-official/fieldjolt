"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@fieldjolt/ui/components/sidebar";
import {
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

const createRoutes = (orgSlug: string) => [
  {
    title: "Dashboard",
    url: `/${orgSlug}` as Route,
    icon: LayoutDashboardIcon,
  },
  {
    title: "CRM",
    url: `/${orgSlug}/crm` as Route,
    icon: UsersIcon,
  },
  {
    title: "Schedule",
    url: `/${orgSlug}/schedule` as Route,
    icon: CalendarIcon,
  },
  {
    title: "Invoices",
    url: `/${orgSlug}/invoices` as Route,
    icon: FileTextIcon,
  },
  {
    title: "Inventory",
    url: `/${orgSlug}/inventory` as Route,
    icon: PackageIcon,
  },
];

export function SidebarItems({ orgSlug }: { orgSlug: string }) {
  const pathname = usePathname();
  const routes = createRoutes(orgSlug);

  const isActive = (url: string) => {
    // For the dashboard root, only match exactly
    if (url === `/${orgSlug}`) {
      return pathname === url;
    }
    // For other routes, match if pathname starts with the route
    return pathname.startsWith(url);
  };

  return (
    <SidebarGroup className="border-t">
      <SidebarGroupLabel>Operations</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {routes.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
