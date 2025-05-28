import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentsInsertSchema } from "@/modules/agents/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const agentsRouter = createTRPCRouter({
	getMany: protectedProcedure.query(async () => {
		const data = await db.select().from(agents);

		return data;
	}),

	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async () => {
			const [existingAgent] = await db
				.select()
				.from(agents)
				.where(eq(agents.id, "id"));

			return existingAgent;
		}),

	create: protectedProcedure
		.input(agentsInsertSchema)
		.mutation(async ({ input, ctx }) => {
			const [createdAgent] = await db
				.insert(agents)
				.values({
					...input,
					userId: ctx.auth.user.id,
				})
				.returning();

			return createdAgent;
		}),
});
