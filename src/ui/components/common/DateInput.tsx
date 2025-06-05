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
			<View style={{ borderRadius: 8, backgroundColor: "#F5FCFF", overflow: "hidden" }}>
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
						selected: {
							backgroundColor: theme.colors.primary.main,
						},
						selected_label: {
							color: theme.colors.background.paper,
						},
						today: {
							borderColor: theme.colors.primary.main,
							borderWidth: 1,
						},
						today_label: {
							color: theme.colors.primary.main,
						},
					}}
				/>
			</View>
		</View>
	);
}
