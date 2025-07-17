import React, { useEffect, useRef, useState } from "react";
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
	multipleEnterMode?: "normal" | "everyWeek" | "everyTwoWeeks" | "everyMonth";
	limitYear: number;
}

export function DatesInput({
	label,
	values,
	onChange,
	multipleEnterMode = "normal",
	limitYear,
	style,
}: DatesInputProps) {
	const { theme } = useUnistyles();

	const [pickerDates, setPickerDates] = useState<Dayjs[]>(() => values.map(v => dayjs(v)));
	console.log("pickerDates in body: ", pickerDates);
	console.log("values in body: ", values);
	const pickerDatesRef = useRef<Dayjs[]>([]);

	useEffect(() => {
		const validDates = values.map(v => dayjs(v)).filter(d => d.isValid());
		setPickerDates(validDates);
		pickerDatesRef.current = validDates;
	}, [values]);

	function handleDateChange(selected: Dayjs[] | Date[]) {
		const newSelection = (selected as Date[]).map(d => dayjs(d)).filter(d => d.isValid());
		console.log("multipleEnterMode in handleDateChange: ", multipleEnterMode); // вот тут всегда обычный

		const pickerDatesSet = new Set(pickerDatesRef.current.map(d => d.toISOString()));

		const baseDate: Dayjs | undefined = newSelection.find(
			item => !pickerDatesSet.has(item.toISOString())
		);

		console.log("baseDate: ", baseDate);
		console.log("pickerDates: ", pickerDates);
		if (!baseDate) {
			console.log("Нет новой даты. Возможно пользователь снял выбор");
			setPickerDates(newSelection);
			return;
		}

		let generatedDates: Dayjs[];
		let final: Dayjs[];

		switch (multipleEnterMode) {
			case "normal":
				console.log("обычный режим");

				generatedDates = newSelection;
				final = [...pickerDates, ...generatedDates];

				break;

			case "everyWeek":
				console.log("everyWeek режим");

				generatedDates = [baseDate];
				for (let i = 1; i < 52 * limitYear; i++) {
					generatedDates.push(baseDate.add(i * 7, "day"));
				}
				final = generatedDates;

				break;

			case "everyTwoWeeks":
				console.log("everyTwoWeeks режим");

				generatedDates = [baseDate];
				for (let i = 1; i < 26 * limitYear; i++) {
					generatedDates.push(baseDate.add(i * 14, "day"));
				}
				final = generatedDates;

				break;

			case "everyMonth":
				console.log("everyMonth режим");

				generatedDates = [baseDate];
				for (let i = 1; i < 12 * limitYear; i++) {
					generatedDates.push(baseDate.add(i, "month"));
				}
				final = generatedDates;

				break;

			default:
				console.log("обычный режим + default");
				generatedDates = newSelection;
				final = [...pickerDates, ...generatedDates];

				break;
		}

		const unique = final.filter(
			(d, index, self) => index === self.findIndex(other => other.isSame(d, "day"))
		);

		console.log("unique", unique);
		setPickerDates(unique);
		pickerDatesRef.current = unique;

		onChange(unique.map(d => d.format("YYYY-MM-DD HH:mm")));
	}

	console.log("multipleEnterMode in main body: ", multipleEnterMode); // вот тут правильно показывает

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
					onChange={({ dates }) => {
						console.log("onChange");
						console.log("multipleEnterMode in DateTimePicker:", multipleEnterMode); // вот тут тоже всегда обычный

						dates.map(date => console.log("dates: ", date));

						handleDateChange(dates as Date[]);
					}}
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
