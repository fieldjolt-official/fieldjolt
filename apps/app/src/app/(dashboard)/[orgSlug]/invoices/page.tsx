import { SidebarInset } from "@fieldjolt/ui/components/sidebar";
import { SidebarPageWrapper } from "@/components/dashboard/sidebar-page-wrapper";

export default function InvoicesPage() {
  return (
    <SidebarInset>
      <SidebarPageWrapper
        breadcrumbs={[
          { label: "Dashboard", url: "/" },
          { label: "Invoices", url: "/invoices" },
        ]}
      />
      <div className="flex flex-1 flex-col p-6">
        This is the Invoices for the organization
      </div>
    </SidebarInset>
  );
}
