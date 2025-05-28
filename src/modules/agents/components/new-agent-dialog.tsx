import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "@/modules/agents/components/agent-form";

interface NewAgentDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const NewAgentDialog = ({ setOpen, open }: NewAgentDialogProps) => {
	return (
		<ResponsiveDialog
			title="New Agent"
			description="Create a new agent"
			open={open}
			onOpenChange={setOpen}
		>
			<AgentForm
				onSuccess={() => setOpen(false)}
				onCancel={() => setOpen(false)}
			/>
		</ResponsiveDialog>
	);
};
