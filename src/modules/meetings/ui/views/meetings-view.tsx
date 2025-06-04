"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { columns } from "@/modules/meetings/components/columns";
import { useTRPC } from "@/trpc/client";

export const MeetingsView = () => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

	return (
		<div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
			{data.items.length === 0 ? (
				<EmptyState
					title="Create Your First Meeting"
					description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas and interact with participants in real-time."
				/>
			) : (
				<DataTable data={data.items} columns={columns} />
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
