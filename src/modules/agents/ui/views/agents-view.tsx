"use client";

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { columns } from "@/modules/agents/components/columns";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { useTRPC } from "@/trpc/client";

export const AgentsView = () => {
	const [filters, setFilters] = useAgentsFilters();

	const router = useRouter();

	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.agents.getMany.queryOptions({ ...filters })
	);

	return (
		<div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
			{data.items.length === 0 ? (
				<EmptyState
					title="Create Your First Agent"
					description="Create an agent to join your meetings, Each agent will follow your instructions and can interact with participants during the call."
				/>
			) : (
				<>
					<DataTable
						data={data.items}
						columns={columns}
						onRowClick={(row) => router.push(`/agents/${row.id}`)}
					/>
					<DataPagination
						page={filters.page}
						totalPages={data.totalPages}
						onPageChange={(page) => setFilters({ page })}
					/>
				</>
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
