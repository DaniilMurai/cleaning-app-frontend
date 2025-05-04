import { GeneratorVerbOptions } from "@orval/core";

export default function (options: GeneratorVerbOptions): GeneratorVerbOptions {
	const isOffsetParamExists = options.originalOperation.parameters?.some(param => {
		// @ts-expect-error. Cannot resolve a type
		return param?.name === "offset" && param?.in === "query";
	});

	const isCursorParamExists = options.originalOperation.parameters?.some(param => {
		// @ts-expect-error. Cannot resolve a type
		return param?.name === "cursor" && param?.in === "query";
	});

	return {
		...options,
		override: {
			...options.override,
			query: {
				...options.override.query,
				useInfiniteQueryParam: isCursorParamExists
					? "cursor"
					: isOffsetParamExists
						? "offset"
						: undefined,
				useInfinite: isCursorParamExists || isOffsetParamExists,
				useSuspenseInfiniteQuery: isCursorParamExists || isOffsetParamExists,
			},
		},
	};
}
