import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { MeetingsListHeader } from "@/modules/meetings/components/meetings-list-header";
import { loadSearchParams } from "@/modules/meetings/params";
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface Props {
	searchParams: Promise<SearchParams>;
}

export default async function MeetingsPage({ searchParams }: Props) {
	const filters = await loadSearchParams(searchParams);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/sign-in");

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.meetings.getMany.queryOptions({ ...filters })
	);

	return (
		<>
			<MeetingsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingsViewLoading />}>
					<ErrorBoundary fallback={<MeetingsViewError />}>
						<MeetingsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
}
