"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@fieldjolt/ui/components/breadcrumb";
import { buttonVariants } from "@fieldjolt/ui/components/button";
import { Separator } from "@fieldjolt/ui/components/separator";
import { SidebarTrigger } from "@fieldjolt/ui/components/sidebar";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment } from "react";

type SidebarPageWrapperProps = {
  breadcrumbs: { label: string; url?: string }[];
};

export function SidebarPageWrapper({ breadcrumbs }: SidebarPageWrapperProps) {
  const { orgSlug } = useParams<{ orgSlug: string }>();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          className="mx-2 data-[orientation=vertical]:h-4"
          orientation="vertical"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="mx-2 data-[orientation=vertical]:h-4" />
                )}
                <BreadcrumbItem>
                  {breadcrumb.url ? (
                    <BreadcrumbLink href={`/${orgSlug}${breadcrumb.url}`}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Link
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "hidden! sm:inline-flex! cursor-default",
            })}
            href="https://github.com/morganstovold/fieldjolt"
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon className="size-4" />
            <span>Github</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
