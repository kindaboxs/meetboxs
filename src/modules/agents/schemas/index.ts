import { z } from "zod";

export const agentsInsertSchema = z.object({
	name: z.string().min(1, { message: "Name Agent is required" }),
	instructions: z
		.string()
		.min(1, { message: "Instructions Agent is required" }),
});
