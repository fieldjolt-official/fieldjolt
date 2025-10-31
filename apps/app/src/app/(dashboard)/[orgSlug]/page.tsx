import { SidebarInset } from "@fieldjolt/ui/components/sidebar";
import { SidebarPageWrapper } from "@/components/dashboard/sidebar-page-wrapper";

export default function OrganizationDashboard() {
  return (
    <SidebarInset>
      <SidebarPageWrapper breadcrumbs={[{ label: "Dashboard", url: "/" }]} />
      <div className="flex flex-1 flex-col p-6">
        This is the dashboard for the organization
      </div>
    </SidebarInset>
  );
}
