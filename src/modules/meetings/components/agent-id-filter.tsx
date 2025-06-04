import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generate-avatar";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";

export const AgentIdFilter = () => {
	const [agentSearch, setAgentSearch] = useState<string>("");
	const [filters, setFilters] = useMeetingsFilters();

	const trpc = useTRPC();
	const { data } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: 100,
			search: agentSearch,
		})
	);

	return (
		<CommandSelect
			placeholder="Agent"
			className="h-9"
			options={(data?.items ?? []).map((agent) => ({
				id: agent.id,
				value: agent.id,
				children: (
					<div className="flex items-center gap-x-2">
						<GenerateAvatar
							variant="botttsNeutral"
							seed={agent.name}
							className="size-4"
						/>
						{agent.name}
					</div>
				),
			}))}
			onSelect={(value) => setFilters({ agentId: value })}
			onSearch={setAgentSearch}
			value={filters.agentId ?? ""}
		/>
	);
};
