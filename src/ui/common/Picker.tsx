import Select from "@/max_ui/Select";
import React from "react";
import { View } from "react-native";
import { Typography } from "@/ui";
import { useTranslation } from "react-i18next";

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
}

export default function CustomPicker({
	label,
	value,
	options,
	onChange,
	style,
	placeholder,
}: CustomPickerProps) {
	const { t } = useTranslation();
	const selectedOption = options.find(option => option.value === value);

	const selectPlaceholder = placeholder ?? t("common.placeholder");

	console.log(
		"selectedOption?.value + selectedOption?.label:  ",
		selectedOption?.value + " " + selectedOption?.label
	);

	return (
		<View style={{ justifyContent: "space-between" }}>
			<Typography>{label}</Typography>
			<Select
				data={options}
				value={selectedOption?.value || selectPlaceholder}
				onChange={e => onChange(e)}
				size={"large"}
				// containerProps={style.select}
				// wrapperProps={style.select}
				// itemProps={style.select}
				// popperProps={style.select}
			/>
		</View>
	);
}
