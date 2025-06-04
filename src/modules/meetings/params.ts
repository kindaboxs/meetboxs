import {
	createLoader,
	parseAsInteger,
	parseAsString,
	parseAsStringEnum,
} from "nuqs/server";

import { DEFAULT_PAGE } from "@/constants";
import { MeetingStatus } from "@/modules/meetings/types";

export const filtersSearchParam = {
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
};

export const loadSearchParams = createLoader(filtersSearchParam);
