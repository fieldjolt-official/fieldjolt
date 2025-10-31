import { SidebarInset } from "@fieldjolt/ui/components/sidebar";
import { SidebarPageWrapper } from "@/components/dashboard/SidebarPageWrapper";

export default function OrganizationCRM() {
  return (
    <SidebarInset>
      <SidebarPageWrapper breadcrumbs={[{ label: "Dashboard", url: "/" }, { label: "CRM", url: "/crm" }]} />
      <div className="flex flex-1 flex-col p-6">
        This is the CRM for the organization
      </div>
    </SidebarInset>
  );
}
