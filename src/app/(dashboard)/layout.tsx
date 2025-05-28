import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/modules/dashboard/ui/components/dashboard-header";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
	return (
		<SidebarProvider>
			<DashboardSidebar />
			<SidebarInset>
				<DashboardHeader />
				<main className="bg-muted flex h-dvh w-full flex-col">{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
