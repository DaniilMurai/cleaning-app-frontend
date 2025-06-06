import { useContext, useMemo } from "react";
import { PopperContext, PopperInsets } from "./PopperContext";

export default function usePopperInsets() {
	const context = useContext(PopperContext);

	return useMemo(
		(): PopperInsets =>
			context?.insets || {
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
			},
		[context?.insets]
	);
}
