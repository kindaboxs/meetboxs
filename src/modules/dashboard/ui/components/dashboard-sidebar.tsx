"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { BotIcon, StarIcon, VideoIcon } from "lucide-react";

import { BoxsIcon } from "@/components/icons/boxs-icon";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";

const firstSection = [
	{
		label: "Meetings",
		icon: VideoIcon,
		href: "/meetings",
	},
	{
		label: "Agents",
		icon: BotIcon,
		href: "/agents",
	},
];

const secondSection = [
	{
		label: "Upgrade",
		icon: StarIcon,
		href: "/upgrade",
	},
];

export const DashboardSidebar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const { data: session, isPending } = authClient.useSession();
	const { isMobile } = useSidebar();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/sign-in");
				},
			},
		});
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							className="text-sidebar-accent-foreground cursor-pointer"
							asChild
						>
							<Link href="/">
								<div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-transparent">
									<BoxsIcon className="size-7" />
								</div>
								<span className="text-2xl font-bold">MeetBoxs</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Applications</SidebarGroupLabel>
					<SidebarGroupContent className="flex flex-col gap-2">
						<SidebarMenu>
							{firstSection.map((item, index) => (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton
										className={cn("", {
											"bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground transition-all duration-300 ease-in-out":
												pathname === item.href,
										})}
										// isActive={pathname === item.href}
										tooltip={item.label}
										asChild
									>
										<Link href={item.href}>
											<item.icon />
											<span className="text-sm font-medium tracking-tight">
												{item.label}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{secondSection.map((item, index) => (
								<SidebarMenuItem key={index}>
									<SidebarMenuButton
										className={cn("", {
											"bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground transition-all duration-300 ease-in-out":
												pathname === item.href,
										})}
										tooltip={item.label}
										asChild
									>
										<Link href={item.href}>
											<item.icon />
											<span className="text-sm font-medium tracking-tight">
												{item.label}
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						{isPending ? (
							<Skeleton className="h-12 w-full" />
						) : session ? (
							<DashboardUserButton
								session={JSON.parse(JSON.stringify(session))}
								isMobile={isMobile}
								onSignOut={handleSignOut}
							/>
						) : null}
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
