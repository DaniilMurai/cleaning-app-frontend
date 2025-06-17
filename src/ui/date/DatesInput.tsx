import React, { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs, { Dayjs } from "dayjs";
import { useUnistyles } from "react-native-unistyles";
import { Typography } from "@/ui";

interface DatesInputProps {
	label: string;
	values: string[]; // ISO: YYYY-MM-DD
	onChange: (newDates: string[]) => void;
	style?: StyleProp<ViewStyle>;
	error?: boolean;
}

export default function DatesInput({ label, values, onChange, style }: DatesInputProps) {
	const { theme } = useUnistyles();

	// Internal state as array of Dayjs
	const [pickerDates, setPickerDates] = useState<Dayjs[]>(() => values.map(v => dayjs(v)));

	// Sync with external props
	// Замените текущий useEffect на этот код:
	useEffect(() => {
		const validDates = values.map(v => dayjs(v)).filter(d => d.isValid());

		setPickerDates(validDates);
	}, [values]);
	const handleDateChange = (selected: Dayjs[] | Date[]) => {
		// Фильтруем только валидные даты
		const validDates = (selected as Date[]).map(d => dayjs(d)).filter(d => d.isValid());

		setPickerDates(validDates);
		onChange(validDates.map(d => d.format("YYYY-MM-DD HH:mm")));
	};

	return (
		<View style={style}>
			<Typography
				variant="body2"
				style={{
					color: theme.colors.text.secondary,
					marginBottom: theme.spacing(0.5),
				}}
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
					mode="multiple"
					dates={(pickerDates ?? []).map(d => d.toDate())}
					onChange={({ dates }) => handleDateChange(dates as Date[])}
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
