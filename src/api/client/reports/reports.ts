/**
 * Generated by orval v7.9.0 🍺
 * Do not edit manually.
 * Neuer Standart Client API
 * OpenAPI spec version: 0.1.0
 */
import { useMutation } from "@tanstack/react-query";
import type {
	MutationFunction,
	QueryClient,
	UseMutationOptions,
	UseMutationResult,
} from "@tanstack/react-query";

import type {
	CreateReport,
	HTTPValidationError,
	ReportResponse,
	UpdateReport,
	UpdateReportParams,
} from ".././schemas";

import { getAxios } from "../../instance";
import type { ErrorType } from "../../instance";

/**
 * @summary Create Report
 */
export const createReport = (createReport: CreateReport, signal?: AbortSignal) => {
	return getAxios<ReportResponse>({
		url: `/client/reports/`,
		method: "POST",
		headers: { "Content-Type": "application/json" },
		data: createReport,
		signal,
	});
};

export const getCreateReportMutationOptions = <
	TError = ErrorType<HTTPValidationError>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof createReport>>,
		TError,
		{ data: CreateReport },
		TContext
	>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof createReport>>,
	TError,
	{ data: CreateReport },
	TContext
> => {
	const mutationKey = ["createReport"];
	const { mutation: mutationOptions } = options
		? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof createReport>>,
		{ data: CreateReport }
	> = props => {
		const { data } = props ?? {};

		return createReport(data);
	};

	return { mutationFn, ...mutationOptions };
};

export type CreateReportMutationResult = NonNullable<Awaited<ReturnType<typeof createReport>>>;
export type CreateReportMutationBody = CreateReport;
export type CreateReportMutationError = ErrorType<HTTPValidationError>;

/**
 * @summary Create Report
 */
export const useCreateReport = <TError = ErrorType<HTTPValidationError>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof createReport>>,
			TError,
			{ data: CreateReport },
			TContext
		>;
	},
	queryClient?: QueryClient
): UseMutationResult<
	Awaited<ReturnType<typeof createReport>>,
	TError,
	{ data: CreateReport },
	TContext
> => {
	const mutationOptions = getCreateReportMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};
/**
 * @summary Update Report
 */
export const updateReport = (updateReport: UpdateReport, params: UpdateReportParams) => {
	return getAxios<ReportResponse>({
		url: `/client/reports/`,
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		data: updateReport,
		params,
	});
};

export const getUpdateReportMutationOptions = <
	TError = ErrorType<HTTPValidationError>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof updateReport>>,
		TError,
		{ data: UpdateReport; params: UpdateReportParams },
		TContext
	>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof updateReport>>,
	TError,
	{ data: UpdateReport; params: UpdateReportParams },
	TContext
> => {
	const mutationKey = ["updateReport"];
	const { mutation: mutationOptions } = options
		? options.mutation && "mutationKey" in options.mutation && options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey } };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof updateReport>>,
		{ data: UpdateReport; params: UpdateReportParams }
	> = props => {
		const { data, params } = props ?? {};

		return updateReport(data, params);
	};

	return { mutationFn, ...mutationOptions };
};

export type UpdateReportMutationResult = NonNullable<Awaited<ReturnType<typeof updateReport>>>;
export type UpdateReportMutationBody = UpdateReport;
export type UpdateReportMutationError = ErrorType<HTTPValidationError>;

/**
 * @summary Update Report
 */
export const useUpdateReport = <TError = ErrorType<HTTPValidationError>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof updateReport>>,
			TError,
			{ data: UpdateReport; params: UpdateReportParams },
			TContext
		>;
	},
	queryClient?: QueryClient
): UseMutationResult<
	Awaited<ReturnType<typeof updateReport>>,
	TError,
	{ data: UpdateReport; params: UpdateReportParams },
	TContext
> => {
	const mutationOptions = getUpdateReportMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};
