import { QueryClient } from "@tanstack/query-core";
import { AxiosError } from "axios";
import { QueryCache } from "@tanstack/react-query";

export default function createQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error, query) => {
				console.log("query cache error", error, query);
				if ((error as AxiosError)?.response?.status === 401) {
					query.setData(undefined);
				}
			},
		}),
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: (failureCount, error) => {
					return (
						failureCount < 3 &&
						(!(error instanceof AxiosError) ||
							![400, 401, 403, 404].includes(
								error.response?.status || error.status || 0
							))
					);
				},
			},
		},
	});
}
