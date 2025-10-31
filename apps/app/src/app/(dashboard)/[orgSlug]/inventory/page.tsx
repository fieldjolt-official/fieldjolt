import { SidebarInset } from "@fieldjolt/ui/components/sidebar";
import { SidebarPageWrapper } from "@/components/dashboard/SidebarPageWrapper";

export default function InventoryPage() {
  return (
    <SidebarInset>
      <SidebarPageWrapper
        breadcrumbs={[
          { label: "Dashboard", url: "/" },
          { label: "Inventory", url: "/inventory" },
        ]}
      />
      <div className="flex flex-1 flex-col p-6">
        This is the Inventory for the organization
      </div>
    </SidebarInset>
  );
}
