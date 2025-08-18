import { HTMLAttributes } from "react";
import { PopperProps } from "@/max_ui/Popper";
import { TextProps, ViewProps } from "react-native";
import { ButtonProps } from "@/ui/common/Button";

export interface SelectDataItem<TValue extends string | number | undefined> {
	label: string;
	value: TValue;
}

export interface SelectProps<TValue extends string | number | undefined> {
	value: TValue;
	onChange?: (value: TValue) => unknown;
	data: SelectDataItem<TValue>[];
	variant?: "outlined";
	fullWidth?: boolean;
	size?: "small" | "medium" | "large";
	containerProps?: ViewProps;
	wrapperProps?: ViewProps;
	valueTextProps?: TextProps;
	itemProps?: ButtonProps;
	disablePaperSaveWidthAsInput?: boolean;
	selectWebWrapperProps?: HTMLAttributes<HTMLDivElement>;
	selectWebProps?: HTMLAttributes<HTMLSelectElement>;
	selectWebIconWrapperProps?: HTMLAttributes<HTMLDivElement>;
	popperProps?: Partial<PopperProps>;
}
