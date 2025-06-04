"use client";

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { columns } from "@/modules/meetings/components/columns";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { useTRPC } from "@/trpc/client";

export const MeetingsView = () => {
	const [filters, setFilters] = useMeetingsFilters();
	const router = useRouter();

	const trpc = useTRPC();
	const { data } = useSuspenseQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		})
	);

	return (
		<div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
			{data.items.length === 0 ? (
				<EmptyState
					title="Create Your First Meeting"
					description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas and interact with participants in real-time."
				/>
			) : (
				<>
					<DataTable
						data={data.items}
						columns={columns}
						onRowClick={(row) => router.push(`/meetings/${row.id}`)}
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

export const MeetingsViewLoading = () => {
	return (
		<LoadingState
			title="Load Meetings"
			description="This may take a few seconds"
		/>
	);
};

export const MeetingsViewError = () => {
	return (
		<ErrorState
			title="Error Loading Meetings"
			description="This may be a temporary issue, please try again later"
		/>
	);
};
