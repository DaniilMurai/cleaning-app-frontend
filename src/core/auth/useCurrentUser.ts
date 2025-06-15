import { getCurrentUser, useGetCurrentUser } from "@/api/users";
import { useAuth } from "@/core/auth";
import type { ErrorType } from "@/api/instance";
import type { UseQueryOptions } from "@tanstack/react-query";

export default function useCurrentUser<
	TData = Awaited<ReturnType<typeof getCurrentUser>>,
	TError = ErrorType<unknown>,
>(options?: {
	query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentUser>>, TError, TData>>;
}) {
	const { isAuthorised } = useAuth();
	const { data: user } = useGetCurrentUser({
		query: {
			refetchOnMount: false,
			enabled: isAuthorised,
			...options,
		},
	});
	return user ?? null;
}
