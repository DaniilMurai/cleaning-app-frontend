import Select from "@/max_ui/Select";
import React from "react";
import { View } from "react-native";
import { Typography } from "@/ui";

export interface PickerOption {
	label: string;
	value: string | undefined;
}

interface CustomPickerProps {
	label?: string;
	value?: string | null;
	options: PickerOption[];
	onChange: (value: string | undefined) => void;
	style?: any;
	placeholder?: string;
	size?: "small" | "medium" | "large";
}

export default function CustomPicker({
	label,
	value,
	options,
	onChange,
	// style,
	// placeholder,
	size = "large",
}: CustomPickerProps) {
	const selectedOption = options.find(option => option.value === value);

	// const selectPlaceholder = placeholder ?? t("common.placeholder");

	console.log(
		"selectedOption?.value + selectedOption?.label:  ",
		selectedOption?.value + " " + selectedOption?.label
	);

	return (
		<View style={{ justifyContent: "space-between" }}>
			<Typography>{label}</Typography>
			<Select
				data={options}
				value={
					selectedOption?.value
					// || selectPlaceholder
				}
				// fullWidth={true}
				onChange={e => onChange(e)}
				size={size}
			/>
		</View>
	);
}
