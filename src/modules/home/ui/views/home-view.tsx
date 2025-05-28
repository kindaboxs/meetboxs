"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const HomeView = () => {
	const { data: session } = authClient.useSession();

	const router = useRouter();

	if (!session) {
		return (
			<div className="flex flex-col gap-y-4 p-4">
				<p>Not logged in</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-4 p-4">
			<p>Logged In as {session.user.email}</p>

			<Button
				onClick={() =>
					authClient.signOut({
						fetchOptions: { onSuccess: () => router.refresh() },
					})
				}
			>
				Sign Out
			</Button>
		</div>
	);
};
