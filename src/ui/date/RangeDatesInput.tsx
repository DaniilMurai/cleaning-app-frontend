import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";
import { useUnistyles } from "react-native-unistyles";
import { Typography } from "@/ui";

interface DateInputProps {
	label?: string;
	startValue?: string; // ISO: YYYY-MM-DD
	endValue?: string; // ISO: YYYY-MM-DD
	onChange: (startDate: string, endDate: string) => void;
	style?: StyleProp<ViewStyle>;
	error?: boolean;
}

export default function RangeDatesInput({
	label,
	startValue,
	endValue,
	onChange,
	style,
}: DateInputProps) {
	const { theme } = useUnistyles();

	// Internal dayjs state
	const [pickerStartDate, setPickerStartDate] = useState<Dayjs>(dayjs(startValue));
	const [pickerEndDate, setPickerEndDate] = useState<Dayjs>(dayjs(endValue));

	// Sync if value prop changes externally
	useEffect(() => {
		if (dayjs(startValue).isValid()) {
			setPickerStartDate(dayjs(startValue));
		}
		if (dayjs(endValue).isValid()) {
			setPickerEndDate(dayjs(endValue));
		}
	}, [startValue, endValue]);

	const handleDateChange = (startDate: Dayjs | Date, endDate: Dayjs | Date) => {
		const startDateJs = dayjs(startDate);
		const endDateJs = dayjs(endDate);
		setPickerStartDate(startDateJs);
		setPickerEndDate(endDateJs);
		onChange(startDateJs.format("YYYY-MM-DD"), endDateJs.format("YYYY-MM-DD"));
	};

	return (
		<View style={style}>
			<Typography
				variant="body2"
				style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing(0.5) }}
			>
				{label}
			</Typography>
			<View
				style={{
					borderRadius: 8,
					backgroundColor: theme.colors.background.default,
					overflow: "hidden",
				}}
			>
				<DateTimePicker
					mode="range"
					startDate={pickerStartDate}
					endDate={pickerEndDate}
					onChange={({ startDate, endDate }) =>
						handleDateChange(startDate as Date, endDate as Date)
					}
					styles={{
						header: {
							backgroundColor: theme.colors.primary.light,
						},
						day: {
							color: theme.colors.text.primary,
						},
						range_fill: {
							color: theme.colors.primary.mainOpacity,
						},
						range_middle: {
							backgroundColor: theme.colors.primary.mainOpacity,
						},

						range_fill_weekend: {
							color: theme.colors.primary.mainOpacity,
						},
						range_fill_weekstart: {
							color: theme.colors.primary.mainOpacity,
						},

						time_label: { color: theme.colors.text.primary },
						day_label: { color: theme.colors.text.primary },
						button_prev_image: { tintColor: theme.colors.primary.text },
						button_next_image: { tintColor: theme.colors.primary.text },
						weekday_label: { color: theme.colors.text.primary },
						selected: {
							backgroundColor: theme.colors.primary.main,
							color: theme.colors.primary.text,
						},
						selected_label: {
							color: theme.colors.primary.text,
						},
						year_label: { color: theme.colors.text.primary },
					}}
				/>
			</View>
		</View>
	);
}
