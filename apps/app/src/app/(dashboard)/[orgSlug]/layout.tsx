import { Spinner } from "@fieldjolt/ui/components/spinner";
import { Suspense } from "react";
import OrganizationLayoutWrapper from "./layout-wrapper";

export default function OrganizationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string }>;
}) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <OrganizationLayoutWrapper params={params}>
        {children}
      </OrganizationLayoutWrapper>
    </Suspense>
  );
}

function LayoutSkeleton() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Spinner />
    </div>
  );
}
