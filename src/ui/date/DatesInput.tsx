import React, { useState } from "react";
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

// ... импорты

export function DatesInput({
	label,
	values,
	onChange,
	multipleEnterMode = "normal",
	limitYear,
	style,
}: DatesInputProps) {
	const { theme } = useUnistyles();

	// Используем Dayjs для всех внутренних операций
	const [selectedDates, setSelectedDates] = useState<Dayjs[]>(() =>
		values.map(v => dayjs(v)).filter(d => d.isValid())
	);

	// Обработчик изменения дат
	const handleDateChange = (dates: Date[]) => {
		const newDates = dates.map(d => dayjs(d)).filter(d => d.isValid());

		// Если режим "normal", просто сохраняем выбранные даты
		if (multipleEnterMode === "normal") {
			setSelectedDates(newDates);
			onChange(newDates.map(d => d.format("YYYY-MM-DD HH:mm")));
			return;
		}

		// Для периодических режимов находим последнюю добавленную дату
		const lastAdded = newDates.find(date => !selectedDates.some(sd => sd.isSame(date, "day")));

		if (!lastAdded) {
			setSelectedDates(newDates);
			return;
		}

		// Генерируем даты в зависимости от режима
		let generatedDates: Dayjs[] = [lastAdded];
		const iterations =
			multipleEnterMode === "everyWeek"
				? 52 * limitYear
				: multipleEnterMode === "everyTwoWeeks"
					? 26 * limitYear
					: 12 * limitYear;

		const increment =
			multipleEnterMode === "everyWeek" ? 7 : multipleEnterMode === "everyTwoWeeks" ? 14 : 1; // для месяца будем добавлять месяцы

		for (let i = 1; i < iterations; i++) {
			const newDate =
				multipleEnterMode === "everyMonth"
					? lastAdded.add(i, "month")
					: lastAdded.add(i * increment, "day");

			generatedDates.push(newDate);
		}

		// Объединяем с существующими датами и удаляем дубликаты
		const allDates = [...selectedDates, ...generatedDates].filter(
			(date, index, self) => index === self.findIndex(d => d.isSame(date, "day"))
		);

		setSelectedDates(allDates);
		onChange(allDates.map(d => d.format("YYYY-MM-DD HH:mm")));
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
					dates={selectedDates.map(d => d.toDate())}
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
