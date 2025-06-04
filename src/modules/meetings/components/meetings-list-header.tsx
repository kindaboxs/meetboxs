"use client";

import { useState } from "react";

import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";
import { AgentIdFilter } from "@/modules/meetings/components/agent-id-filter";
import { MeetingsSearchFilters } from "@/modules/meetings/components/meetings-search-filters";
import { NewMeetingDialog } from "@/modules/meetings/components/new-meeting-dialog";
import { StatusFilter } from "@/modules/meetings/components/status-filter";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";

export const MeetingsListHeader = () => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const [filters, setFilters] = useMeetingsFilters();
	const isAnyFilterModified =
		!!filters.status || !!filters.search || !!filters.agentId;

	const onClearFilters = async () => {
		await setFilters({
			status: null,
			agentId: "",
			search: "",
			page: DEFAULT_PAGE,
		});
	};

	return (
		<>
			<NewMeetingDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
			<div className="flex flex-col gap-y-4 p-4 md:px-8">
				<div className="flex items-center justify-between">
					<h5 className="text-xl font-medium">My Meetings</h5>
					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon /> New Meeting
					</Button>
				</div>

				<ScrollArea>
					<div className="flex items-center gap-x-2 p-1">
						<MeetingsSearchFilters />
						<StatusFilter />
						<AgentIdFilter />

						{isAnyFilterModified && (
							<Button variant="outline" onClick={onClearFilters}>
								<XCircleIcon /> Clear
							</Button>
						)}
					</div>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</>
	);
};
