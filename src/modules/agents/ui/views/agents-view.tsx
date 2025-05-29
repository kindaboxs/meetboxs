"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { columns } from "@/modules/agents/components/columns";
import { DataTable } from "@/modules/agents/components/data-table";
import { useTRPC } from "@/trpc/client";

export const AgentsView = () => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

	return (
		<div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
			{data.length === 0 ? (
				<EmptyState
					title="Create Your First Agent"
					description="Create an agent to join your meetings, Each agent will follow your instructions and can interact with participants during the call."
				/>
			) : (
				<DataTable data={data} columns={columns} />
			)}
		</div>
	);
};

export const AgentsViewLoading = () => {
	return (
		<LoadingState
			title="Load Agents"
			description="This may take a few seconds"
		/>
	);
};

export const AgentsViewError = () => {
	return (
		<ErrorState
			title="Error Loading Agents"
			description="This may be a temporary issue, please try again later"
		/>
	);
};
