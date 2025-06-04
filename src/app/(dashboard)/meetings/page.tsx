import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { auth } from "@/lib/auth";
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoading,
} from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function MeetingsPage() {
	const qureryClient = getQueryClient();
	void qureryClient.prefetchQuery(trpc.meetings.getMany.queryOptions({}));

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) redirect("/sign-in");

	return (
		<HydrationBoundary state={dehydrate(qureryClient)}>
			<Suspense fallback={<MeetingsViewLoading />}>
				<ErrorBoundary fallback={<MeetingsViewError />}>
					<MeetingsView />
				</ErrorBoundary>
			</Suspense>
		</HydrationBoundary>
	);
}
