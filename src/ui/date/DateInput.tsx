import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";
import { useUnistyles } from "react-native-unistyles";
import { Typography } from "@/ui";

interface DateInputProps {
	label: string;
	value: string; // ISO: YYYY-MM-DD
	onChange: (newDate: string) => void;
	style?: StyleProp<ViewStyle>;
	error?: boolean;
}

export default function DateInput({ label, value, onChange, style }: DateInputProps) {
	const { theme } = useUnistyles();

	// Internal dayjs state
	const [pickerDate, setPickerDate] = useState<Dayjs>(dayjs(value));

	// Sync if value prop changes externally
	useEffect(() => {
		if (dayjs(value).isValid()) {
			setPickerDate(dayjs(value));
		}
	}, [value]);

	const handleDateChange = (selected: Dayjs | Date) => {
		const newDayjs = dayjs(selected);
		setPickerDate(newDayjs);
		onChange(newDayjs.format("YYYY-MM-DD HH:mm"));
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
					mode="single"
					date={pickerDate}
					onChange={({ date }) => handleDateChange(date as Date)}
					timePicker={true}
					styles={{
						header: {
							backgroundColor: theme.colors.primary.light,
						},
						day: {
							color: theme.colors.text.primary,
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
