"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "@/components/error-state";
import { GenerateAvatar } from "@/components/generate-avatar";
import { LoadingState } from "@/components/loading-state";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { AgentIdViewHeader } from "@/modules/agents/components/agent-id-view-header";
import { UpdateAgentDialog } from "@/modules/agents/components/update-agent-dialog";
import { useTRPC } from "@/trpc/client";

interface AgentIdViewProps {
	agentId: string;
}

export const AgentIdView = ({ agentId }: AgentIdViewProps) => {
	const [updateAgentDialogOpen, setUpdateAgentDialogOpen] =
		useState<boolean>(false);

	const trpc = useTRPC();

	const router = useRouter();
	const queryClient = useQueryClient();

	const { data } = useSuspenseQuery(
		trpc.agents.getOne.queryOptions({ id: agentId })
	);

	const removeAgent = useMutation(
		trpc.agents.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({})
				);

				// TODO: Invalidate free tier usage

				router.push("/agents");
			},

			onError: (error) => {
				toast.error("Failed to remove agent", { description: error.message });
			},
		})
	);

	const [RemoveConfirmation, confirmRemove] = useConfirm(
		"Are you sure?",
		`This agent will be permanently removed along with ${data.meetingCount} associated ${data.meetingCount === 1 ? "meeting" : "meetings"}.`
	);

	const handleRemoveAgent = async () => {
		const ok = await confirmRemove();

		if (!ok) return;

		await removeAgent.mutateAsync({ id: agentId });
	};

	return (
		<>
			<RemoveConfirmation />
			<UpdateAgentDialog
				open={updateAgentDialogOpen}
				setOpen={setUpdateAgentDialogOpen}
				initialValues={data}
			/>
			<div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
				<AgentIdViewHeader
					agentId={agentId}
					agentName={data.name}
					onEdit={() => setUpdateAgentDialogOpen(true)}
					onRemove={handleRemoveAgent}
				/>
				<div className="bg-background rounded-lg border">
					<div className="col-span-5 flex flex-col gap-y-5 px-4 py-5">
						<div className="flex items-center gap-x-3">
							<GenerateAvatar
								seed={data.name}
								variant="botttsNeutral"
								className="size-10"
							/>
							<h2 className="text-2xl font-medium">{data.name}</h2>
						</div>

						<Badge
							variant="outline"
							className="flex items-center gap-x-2 [&svg]:size-4"
						>
							<VideoIcon /> {data.meetingCount}{" "}
							{data.meetingCount === 1 ? "Meeting" : "Meetings"}
						</Badge>

						<div className="flex flex-col gap-y-4">
							<p className="text-lg font-medium">Instructions</p>
							<p className="text-muted-foreground">{data.instructions}</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export const AgentsIdViewLoading = () => {
	return (
		<LoadingState
			title="Loading Agent"
			description="This may take a few seconds"
		/>
	);
};

export const AgentsIdViewError = () => {
	return (
		<ErrorState
			title="Error Loading Agent"
			description="This may be a temporary issue, please try again later"
		/>
	);
};
