import { SidebarInset } from "@fieldjolt/ui/components/sidebar";
import { SidebarPageWrapper } from "@/components/dashboard/SidebarPageWrapper";

export default function SchedulePage() {
  return (
    <SidebarInset>
      <SidebarPageWrapper
        breadcrumbs={[
          { label: "Dashboard", url: "/" },
          { label: "Schedule", url: "/schedule" },
        ]}
      />
      <div className="flex flex-1 flex-col p-6">
        This is the Schedule for the organization
      </div>
    </SidebarInset>
  );
}
