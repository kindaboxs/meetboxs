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
import { agents, meetings } from "@/db/schema";
import {
	meetingsInsertSchema,
	meetingsUpdateSchema,
} from "@/modules/meetings/schemas";
import { MeetingStatus } from "@/modules/meetings/types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const getManyInputSchema = z.object({
	page: z.number({ coerce: true }).default(DEFAULT_PAGE),
	pageSize: z
		.number({ coerce: true })
		.min(MIN_PAGE_SIZE)
		.max(MAX_PAGE_SIZE)
		.default(DEFAULT_PAGE_SIZE),
	search: z.string().nullish(),
	agentId: z.string().nullish(),
	status: z
		.enum([
			MeetingStatus.Upcoming,
			MeetingStatus.Active,
			MeetingStatus.Completed,
			MeetingStatus.Processing,
			MeetingStatus.Cancelled,
		])
		.nullish(),
});

export const meetingsRouter = createTRPCRouter({
	getMany: protectedProcedure
		.input(getManyInputSchema)
		.query(async ({ input, ctx }) => {
			const { page, pageSize, search, agentId, status } = input;

			const data = await db
				.select({
					...getTableColumns(meetings),
					agent: agents,
					duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
						"duration"
					),
				})
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						search ? ilike(meetings.name, `%${search}%`) : undefined,
						status ? eq(meetings.status, status) : undefined,
						agentId ? eq(meetings.agentId, agentId) : undefined
					)
				)
				.orderBy(desc(meetings.createdAt), desc(meetings.id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			const [total] = await db
				.select({ count: count() })
				.from(meetings)
				.innerJoin(agents, eq(meetings.agentId, agents.id))
				.where(
					and(
						eq(meetings.userId, ctx.auth.user.id),
						search ? ilike(meetings.name, `%${search}%`) : undefined,
						status ? eq(meetings.status, status) : undefined,
						agentId ? eq(meetings.agentId, agentId) : undefined
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
			const [existingMeeting] = await db
				.select({
					...getTableColumns(meetings),
				})
				.from(meetings)
				.where(
					and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
				);

			if (!existingMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return existingMeeting;
		}),

	create: protectedProcedure
		.input(meetingsInsertSchema)
		.mutation(async ({ input, ctx }) => {
			const [createdMeeting] = await db
				.insert(meetings)
				.values({
					...input,
					userId: ctx.auth.user.id,
				})
				.returning();

			// TODO: Create stream call, upsert stream users

			return createdMeeting;
		}),

	update: protectedProcedure
		.input(meetingsUpdateSchema)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const [updatedMeeting] = await db
				.update(meetings)
				.set(updateData)
				.where(and(eq(meetings.id, id), eq(meetings.userId, ctx.auth.user.id)))
				.returning();

			if (!updatedMeeting) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Meeting not found",
				});
			}

			return updatedMeeting;
		}),
});
