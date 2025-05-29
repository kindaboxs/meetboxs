import Link from "next/link";

import {
	ChevronRightIcon,
	MoreVerticalIcon,
	PencilIcon,
	TrashIcon,
} from "lucide-react";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AgentIdViewHeaderProps {
	agentId: string;
	agentName: string;
	onEdit: () => void;
	onRemove: () => void;
}

export const AgentIdViewHeader = ({
	agentId,
	agentName,
	onEdit,
	onRemove,
}: AgentIdViewHeaderProps) => {
	return (
		<div className="flex items-center justify-between">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className="text-xl font-medium" asChild>
							<Link href="/agents">My Agents</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="text-foreground text-xl font-medium [&>svg]:size-4">
						<ChevronRightIcon />
					</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink
							className="text-foreground text-xl font-medium"
							asChild
						>
							<Link href={`/agents/${agentId}`}>{agentName}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			{/* Without modal={false}, the dropdown dialog thats opens cause the site to get unclickable */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<MoreVerticalIcon />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={onEdit}>
						<PencilIcon /> Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={onRemove}>
						<TrashIcon /> Remove
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
