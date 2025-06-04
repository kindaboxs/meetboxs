import {
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
	useQueryStates,
} from "nuqs";

import { DEFAULT_PAGE } from "@/constants";
import { MeetingStatus } from "@/modules/meetings/types";

export const useMeetingsFilters = () => {
	return useQueryStates({
		search: parseAsString
			.withDefault("")
			.withOptions({ clearOnDefault: true, history: "push" }),
		page: parseAsInteger
			.withDefault(DEFAULT_PAGE)
			.withOptions({ clearOnDefault: true, history: "push" }),
		status: parseAsStringEnum(Object.values(MeetingStatus)),
		agentId: parseAsString.withDefault("").withOptions({
			clearOnDefault: true,
			history: "push",
		}),
	});
};
