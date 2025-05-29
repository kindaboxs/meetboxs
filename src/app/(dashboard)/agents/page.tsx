import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import { AgentsListHeader } from "@/modules/agents/components/agents-list-header";
import { loadSearchParams } from "@/modules/agents/params";
import {
	AgentsView,
	AgentsViewError,
	AgentsViewLoading,
} from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface AgentsPageProps {
	searchParams: Promise<SearchParams>;
}

export default async function AgentsPage({ searchParams }: AgentsPageProps) {
	const filters = await loadSearchParams(searchParams);

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/sign-in");

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.agents.getMany.queryOptions({ ...filters })
	);

	return (
		<>
			<AgentsListHeader />
			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AgentsViewLoading />}>
					<ErrorBoundary fallback={<AgentsViewError />}>
						<AgentsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	);
}
