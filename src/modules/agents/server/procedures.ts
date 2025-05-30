import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import {
	DEFAULT_PAGE,
	DEFAULT_PAGE_SIZE,
	MAX_PAGE_SIZE,
	MIN_PAGE_SIZE,
} from "@/constants";
import { db } from "@/db";
import { agents } from "@/db/schema";
import {
	agentsInsertSchema,
	agentsUpdateSchema,
} from "@/modules/agents/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const getManyInputSchema = z.object({
	page: z.number({ coerce: true }).default(DEFAULT_PAGE),
	pageSize: z
		.number({ coerce: true })
		.min(MIN_PAGE_SIZE)
		.max(MAX_PAGE_SIZE)
		.default(DEFAULT_PAGE_SIZE),
	search: z.string().nullish(),
});

export const agentsRouter = createTRPCRouter({
	getMany: protectedProcedure
		.input(getManyInputSchema)
		.query(async ({ input, ctx }) => {
			const { page, pageSize, search } = input;

			const data = await db
				.select({
					...getTableColumns(agents),
					// TODO: change to actual value
					meetingCount: sql<number>`5`,
				})
				.from(agents)
				.where(
					and(
						eq(agents.userId, ctx.auth.user.id),
						search ? ilike(agents.name, `%${search}%`) : undefined
					)
				)
				.orderBy(desc(agents.createdAt), desc(agents.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const [total] = await db
				.select({ count: count() })
				.from(agents)
				.where(
					and(
						eq(agents.userId, ctx.auth.user.id),
						search ? ilike(agents.name, `%${search}%`) : undefined
					)
				);

			const totalPages = Math.ceil(total.count / pageSize);

			return {
				items: data,
				total: total.count,
				totalPages,
			};
		}),

	getOne: protectedProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const [existingAgent] = await db
				.select({
					...getTableColumns(agents),
					// TODO: change to actual value
					meetingCount: sql<number>`5`,
				})
				.from(agents)
				.where(
					and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
				);

			if (!existingAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

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

	remove: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const [removedAgent] = await db
				.delete(agents)
				.where(
					and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
				)
				.returning();

			if (!removedAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

			return removedAgent;
		}),

	update: protectedProcedure
		.input(agentsUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updatedAgent] = await db
				.update(agents)
				.set(updateData)
				.where(and(eq(agents.id, id), eq(agents.userId, ctx.auth.user.id)))
				.returning();

			if (!updatedAgent) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Agent not found",
				});
			}

			return updatedAgent;
		}),
});
