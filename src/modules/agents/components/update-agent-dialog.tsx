import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "@/modules/agents/components/agent-form";
import type { AgentGetOne } from "@/modules/agents/types";

interface UpdateAgentDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialValues: AgentGetOne;
}

export const UpdateAgentDialog = ({
	open,
	setOpen,
	initialValues,
}: UpdateAgentDialogProps) => {
	return (
		<ResponsiveDialog
			title="Edit Agent"
			description="Edit the agent details"
			open={open}
			onOpenChange={setOpen}
		>
			<AgentForm
				onSuccess={() => setOpen(false)}
				onCancel={() => setOpen(false)}
				initialValues={initialValues}
			/>
		</ResponsiveDialog>
	);
};
