"use client";

import { useState } from "react";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";
import { AgentsSearchFilters } from "@/modules/agents/components/agents-search-filters";
import { NewAgentDialog } from "@/modules/agents/components/new-agent-dialog";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";

export const AgentsListHeader = () => {
	const [filters, setFilters] = useAgentsFilters();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const isAnyFilterModified = !!filters.search;

	const onClearFilters = async () => {
		await setFilters({
			search: "",
			page: DEFAULT_PAGE,
		});
	};

	return (
		<>
			<NewAgentDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
			<div className="flex flex-col gap-y-4 p-4 md:px-8">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-medium">My Agents</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon /> New Agent
					</Button>
				</div>

				<div className="flex items-center gap-x-2 p-1">
					<AgentsSearchFilters />
					{isAnyFilterModified && (
						<Button variant="outline" size="sm" onClick={onClearFilters}>
							<XCircleIcon /> Clear
						</Button>
					)}
				</div>
			</div>
		</>
	);
};
