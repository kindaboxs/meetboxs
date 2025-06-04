import { useRouter } from "next/navigation";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "@/modules/meetings/components/meeting-form";

interface NewMeetingDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const NewMeetingDialog = ({ setOpen, open }: NewMeetingDialogProps) => {
	const router = useRouter();

	return (
		<ResponsiveDialog
			title="New Meeting"
			description="Create a new meeting"
			open={open}
			onOpenChange={setOpen}
		>
			<MeetingForm
				onSuccess={(id) => {
					setOpen(false);
					router.push(`/meetings/${id}`);
				}}
				onCancel={() => setOpen(false)}
			/>
		</ResponsiveDialog>
	);
};
