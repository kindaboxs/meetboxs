"use client";

import { useEffect, useState } from "react";

import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { DashboardCommand } from "@/modules/dashboard/ui/components/dashboard-command";

export const DashboardHeader = () => {
	const [commandOpen, setCommandOpen] = useState<boolean>(false);

	const { isMobile, state, toggleSidebar } = useSidebar();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setCommandOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
			<header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
				<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
					<Button
						variant="outline"
						size="icon"
						className="cursor-pointer"
						onClick={toggleSidebar}
					>
						{state === "collapsed" || isMobile ? (
							<PanelLeftIcon />
						) : (
							<PanelLeftCloseIcon />
						)}
					</Button>
					<Separator
						orientation="vertical"
						className="mx-2 data-[orientation=vertical]:h-6"
					/>
					<Button
						variant="outline"
						size="sm"
						className="text-muted-foreground hover:text-muted-foreground h-9 w-[240px] cursor-pointer justify-start font-normal"
						onClick={() => setCommandOpen((open) => !open)}
					>
						<SearchIcon />
						Search
						<kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
							<span className="text-xs">&#8984;</span>K
						</kbd>
					</Button>
				</div>
			</header>
		</>
	);
};
