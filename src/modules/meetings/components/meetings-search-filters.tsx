import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";

export const MeetingsSearchFilters = () => {
	const [filters, setFilters] = useMeetingsFilters();

	return (
		<div className="relative">
			<Input
				placeholder="Filter by name"
				className="bg-background h-9 w-[200px] pl-7"
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value })}
			/>
			<SearchIcon className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
		</div>
	);
};
