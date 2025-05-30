import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { GenerateAvatar } from "@/components/generate-avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { agentsInsertSchema } from "@/modules/agents/schemas";
import type { AgentGetOne } from "@/modules/agents/types";
import { useTRPC } from "@/trpc/client";

interface AgentFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
	initialValues?: AgentGetOne;
}

export const AgentForm = ({
	onSuccess,
	onCancel,
	initialValues,
}: AgentFormProps) => {
	const queryClient = useQueryClient();
	const trpc = useTRPC();

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({})
				);

				// TODO: Invalidate free tier usage

				onSuccess?.();
			},

			onError: (error) => {
				toast.error("Failed to create agent", { description: error.message });

				// TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
			},
		})
	);

	const updateAgent = useMutation(
		trpc.agents.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(
					trpc.agents.getMany.queryOptions({})
				);

				if (initialValues?.id) {
					await queryClient.invalidateQueries(
						trpc.agents.getOne.queryOptions({ id: initialValues.id })
					);
				}

				onSuccess?.();
			},

			onError: (error) => {
				toast.error("Failed to create agent", { description: error.message });

				// TODO: Check if error code is "FORBIDDEN", redirect to "/upgrade"
			},
		})
	);

	const form = useForm<z.infer<typeof agentsInsertSchema>>({
		resolver: zodResolver(agentsInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? "",
			instructions: initialValues?.instructions ?? "",
		},
	});

	const isEdit = !!initialValues?.id;
	const isPending = createAgent.isPending || updateAgent.isPending;

	const onSubmitForm = (values: z.infer<typeof agentsInsertSchema>) => {
		if (isEdit) {
			updateAgent.mutate({ ...values, id: initialValues.id });
		} else {
			createAgent.mutate(values);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-4">
				<GenerateAvatar
					seed={form.watch("name")}
					variant="botttsNeutral"
					className="size-16 border"
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="e.g. Coding tutor" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="instructions"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instructions</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder="You are helpful coding assistant that answers questions about coding."
								/>
							</FormControl>
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
	);
};
