import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generate-avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewAgentDialog } from "@/modules/agents/components/new-agent-dialog";
import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import type { MeetingGetOne } from "@/modules/meetings/types";
import { useTRPC } from "@/trpc/client";

interface MeetingFormProps {
	onSuccess?: (id?: string) => void;
	onCancel?: () => void;
	initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: MeetingFormProps) => {
	const [agentSearch, setAgentSearch] = useState<string>("");
	const [openNewAgentDialog, setOpenNewAgentDialog] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const agents = useQuery(
		trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch })
	);

	const createMeeting = useMutation(
		trpc.meetings.create.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({})
				);

				// TODO: Invalidate free tier usage

				onSuccess?.(data.id);
			},

			onError: (error) => {
				toast.error("Failed to create meeting", { description: error.message });

				// TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
			},
		})
	);

	const updateMeeting = useMutation(
		trpc.meetings.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.meetings.getMany.queryOptions({})
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.meetings.getOne.queryOptions({ id: initialValues.id })
					);
				}

				onSuccess?.();
			},

			onError: (error) => {
				toast.error("Failed to create meeting", { description: error.message });

				// TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
			},
		})
	);

	const form = useForm<z.infer<typeof meetingsInsertSchema>>({
		resolver: zodResolver(meetingsInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			agentId: initialValues?.agentId ?? "",
		},
	});

	const isEdit = !!initialValues?.id;
	const isPending = createMeeting.isPending || updateMeeting.isPending;

	const onSubmitForm = (values: z.infer<typeof meetingsInsertSchema>) => {
		if (isEdit) {
			updateMeeting.mutate({ ...values, id: initialValues.id });
		} else {
			createMeeting.mutate(values);
		}
	};

	return (
		<>
			<NewAgentDialog
				open={openNewAgentDialog}
				setOpen={setOpenNewAgentDialog}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} placeholder="e.g. Coding consultation" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="agentId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Agent</FormLabel>
								<FormControl>
									<CommandSelect
										options={(agents.data?.items ?? []).map((agent) => ({
											id: agent.id,
											value: agent.id,
											children: (
												<div className="flex items-center gap-x-2">
													<GenerateAvatar
														seed={agent.name}
														variant="botttsNeutral"
														className="size-6 border"
													/>
													<span>{agent.name}</span>
												</div>
											),
										}))}
										value={field.value}
										onSelect={field.onChange}
										onSearch={setAgentSearch}
										placeholder="Select an agent"
									/>
								</FormControl>
								<FormDescription>
									Not found what you&apos;re looking for?{" "}
									<Button
										type="button"
										variant="link"
										className="p-0"
										onClick={() => setOpenNewAgentDialog(true)}
									>
										Create new agent
									</Button>
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex items-center justify-between gap-x-2">
						{onCancel && (
							<Button
								type="button"
								variant="ghost"
								onClick={onCancel}
								disabled={isPending}
							>
								Cancel
							</Button>
						)}

						<Button type="submit" disabled={isPending}>
							{isEdit ? "Update" : "Create"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};
