import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

import { DEFAULT_PAGE } from "@/constants";

export const useAgentsFilters = () => {
	return useQueryStates({
		search: parseAsString
			.withDefault("")
			.withOptions({ clearOnDefault: true, history: "push" }),
		page: parseAsInteger
			.withDefault(DEFAULT_PAGE)
			.withOptions({ clearOnDefault: true, history: "push" }),
	});
};
