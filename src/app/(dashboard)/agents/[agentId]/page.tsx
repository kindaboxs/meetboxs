import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import {
	AgentIdView,
	AgentsIdViewError,
	AgentsIdViewLoading,
} from "@/modules/agents/ui/views/agent-id-view";
import { getQueryClient, trpc } from "@/trpc/server";

interface AgentDetailPageProps {
	params: Promise<{ agentId: string }>;
}

export default async function AgentIdPage({ params }: AgentDetailPageProps) {
	const { agentId } = await params;

	const queryClient = getQueryClient();
	void queryClient.prefetchQuery(
		trpc.agents.getOne.queryOptions({ id: agentId })
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<AgentsIdViewLoading />}>
				<ErrorBoundary fallback={<AgentsIdViewError />}>
					<AgentIdView agentId={agentId} />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
}
