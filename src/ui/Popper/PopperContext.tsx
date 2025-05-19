import { createContext, PropsWithChildren, useMemo } from "react";

export interface PopperInsets {
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface PopperContextType {
	insets: PopperInsets;
}

export const PopperContext = createContext<PopperContextType | null>(null);

export default function PopperContextProvider({
	children,
	insets: _providedInsets,
}: PropsWithChildren<{
	insets?: Partial<PopperInsets>;
}>) {
	const insets = useMemo(
		(): PopperInsets => ({
			left: _providedInsets?.left || 0,
			right: _providedInsets?.right || 0,
			top: _providedInsets?.top || 0,
			bottom: _providedInsets?.bottom || 0,
		}),
		[
			_providedInsets?.bottom,
			_providedInsets?.left,
			_providedInsets?.right,
			_providedInsets?.top,
		]
	);

	const value = useMemo(
		() => ({
			insets,
		}),
		[insets]
	);

	return <PopperContext.Provider value={value}>{children}</PopperContext.Provider>;
}
